use std::net::SocketAddr;
use std::time::Instant;

use tokio::sync::mpsc::UnboundedSender;

use crate::json::{Command, GatewayRequest};
use crate::server::send_message;

#[derive(Clone)]
pub struct SocketSession {
    hb: Instant,
    pub addr: SocketAddr,
    pub frame: UnboundedSender<GatewayRequest>,
    pub user_id: Option<i32>,
}

impl SocketSession {
    pub fn new(addr: SocketAddr, frame: UnboundedSender<GatewayRequest>) -> Self {
        Self {
            hb: Instant::now(),
            addr,
            frame,
            user_id: None,
        }
    }

    pub fn heartbeat(&self) -> Result<(), GatewayRequest> {
        if Instant::now().duration_since(self.hb) > std::time::Duration::new(45, 0) {
            log::trace!("[{}] client heartbeat failed, disconnecting!", self.addr);

            // Send close event
            return Err(GatewayRequest { opcode: 8, d: None });
        }

        // Send ping event
        send_message(&self.frame, GatewayRequest { opcode: 9, d: None });

        Ok(())
    }

    pub fn refresh_hb(&mut self) {
        self.hb = Instant::now();
    }
}

pub async fn handle_client(
    session: &mut SocketSession,
    event: web_socket::Event,
    cmd_tx: &UnboundedSender<Command>,
    ws_writer: &mut web_socket::WebSocket<tokio::net::tcp::OwnedWriteHalf>,
) -> Result<(), ()> {
    match event {
        web_socket::Event::Data { data, .. } => {
            crate::events::handle(session, data, cmd_tx).await;
        }
        web_socket::Event::Ping(_) => {
            ws_writer.send_pong("p").await;
        }
        web_socket::Event::Pong(_) => session.refresh_hb(),
        web_socket::Event::Error(_) | web_socket::Event::Close { .. } => {
            send_message(&cmd_tx, Command::Disconnect(session.addr));

            return Err(());
        }
    }

    Ok(())
}