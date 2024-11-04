use sqlx::postgres::PgNotification;

use crate::json::{Command, GatewayData, GatewayRequest, PostgresEvent};
use crate::server::send_message;
use crate::server::session::SocketSession;

pub async fn handle(
    session: &mut SocketSession,
    data: Box<[u8]>,
    cmd_tx: &tokio::sync::mpsc::UnboundedSender<Command>,
) {
    let event = match serde_json::from_slice::<GatewayRequest>(&data) {
        Ok(event) => event,
        Err(_) => return,
    };

    match (event.opcode, event.d) {
        (10, Some(GatewayData::Identify { session_id })) => {
            send_message(
                &cmd_tx,
                Command::Identify(session.addr, session_id),
            )
        }
        _ => {}
    }
}

pub fn postgres(
    cmd_tx: &tokio::sync::mpsc::UnboundedSender<Command>,
    notification: PgNotification,
) {
    let event = match serde_json::from_str::<PostgresEvent>(notification.payload()) {
        Ok(value) => value,
        Err(_) => return,
    };

    match (notification.channel(), event) {
        ("notification_insert", PostgresEvent::NotificationCreated(data)) =>
            send_message(
                &cmd_tx,
                Command::NotificationCreated(data),
            ),
        ("message_insert", PostgresEvent::MessageCreated(data)) =>
            send_message(
                &cmd_tx,
                Command::MessageCreated(data),
            ),
        ("message_update", PostgresEvent::MessageUpdated(data)) =>
            send_message(
                &cmd_tx,
                Command::MessageUpdated(data),
            ),
        ("message_deleted", PostgresEvent::MessageDeleted(data)) =>
            send_message(
                &cmd_tx,
                Command::MessageDeleted(data),
            ),
        _ => {}
    }
}