use sqlx::{Pool, Postgres};
use sqlx::postgres::PgListener;
use web_socket::WebSocket;

use app_core::database::SqlxManager;
use common::settings::{AppSettings, Protocol};

use crate::json::{Command, GatewayRequest};
use crate::server::session::SocketSession;

pub mod session;

pub struct Application {
    pub settings: AppSettings,
    pub connections: Vec<SocketSession>,
    pub cmd_tx: tokio::sync::mpsc::UnboundedSender<Command>,
    pub cmd_rx: tokio::sync::mpsc::UnboundedReceiver<Command>,
    pub pool: Pool<Postgres>,
}

impl Application {
    pub async fn new() -> Self {
        let (cmd_tx, cmd_rx) = tokio::sync::mpsc::unbounded_channel::<Command>();
        let settings = AppSettings::new();
        let pool = SqlxManager::new(&settings.database).await.pool;

        Self {
            settings,
            connections: Vec::new(),
            cmd_tx,
            cmd_rx,
            pool,
        }
    }

    pub async fn run(mut self) -> std::io::Result<()> {
        let listener = tokio::net::TcpListener::bind(&self.settings.websocket.socket()).await?;
        log::info!(
            "WebSocket server is listening on ws://{}",
            self.settings.websocket.socket()
        );

        Self::postgres_client(&self).await;

        loop {
            let cmd_tx = self.cmd_tx.clone();

            tokio::select! {
                Ok((stream, addr)) = listener.accept() => {
                    let (reader, mut writer) = stream.into_split();
                    let mut reader = tokio::io::BufReader::new(reader);

                    if let Err(e) = crate::http::handshake::send(&mut reader, &mut writer).await {
                        log::error!("[{addr}] failed to handshake {e}");
                        continue;
                    }

                    log::trace!("[{addr}] successfully connected");

                    // Channel to send events between sockets
                    let (tx, mut rx) = tokio::sync::mpsc::unbounded_channel::<GatewayRequest>();
                    let mut session = SocketSession::new(addr, tx);
                    self.connections.push(session.clone());

                    tokio::spawn(async move {
                        let mut ws_writer = WebSocket::server(writer);
                        let mut ws_reader = WebSocket::server(reader);

                        let mut interval = tokio::time::interval(std::time::Duration::from_secs(20));

                        loop {
                            tokio::select! {
                                Ok(event) = ws_reader.recv() => {
                                    if let Err(_) = session::handle_client(
                                        &mut session,
                                        event,
                                        &cmd_tx,
                                        &mut ws_writer
                                    ).await {
                                        break;
                                    }
                                },
                                Some(event) = rx.recv() => {
                                    match event.opcode {
                                        8 => {
                                            send_message(
                                                &cmd_tx,
                                                Command::Disconnect(addr)
                                            );

                                            break;
                                        }
                                        9 => { ws_writer.send_ping("p").await; }
                                        _ => {
                                            ws_writer.send(serde_json::to_string(&event).unwrap().as_str()).await;
                                        }
                                    }
                                },
                                _ = interval.tick() => {
                                    if let Err(_) = session.heartbeat() {
                                        send_message(
                                            &cmd_tx,
                                            Command::Disconnect(addr)
                                        );

                                        break;
                                    };
                                }
                            }
                        }
                    });
                },
                Some(cmd) = self.cmd_rx.recv() =>
                    crate::commands::handle(cmd, &mut self.connections, &self.pool)
                        .await,
            }
        }
    }

    async fn postgres_client(&self) {
        let mut pg_listener = PgListener::connect(&self.settings.database.url()).await.unwrap();
        let channels = [
            "notification_insert", "message_insert", "message_update", 
            "message_delete"
        ];

        for channel in channels {
            pg_listener.listen(channel).await.unwrap();
        }
        
        let cmd_tx = self.cmd_tx.clone();

        tokio::spawn(async move {
            loop {
                let notification = pg_listener.recv().await.unwrap();
                crate::events::postgres(&cmd_tx, notification);
            }
        });
    }
}

pub fn send_message<T>(frame: &tokio::sync::mpsc::UnboundedSender<T>, data: T) {
    if let Err(_) = frame.send(data) {
        log::error!("failed to send frame message");
    }
}