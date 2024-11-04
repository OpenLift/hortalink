use crate::json::{GatewayData, GatewayRequest};
use crate::json::notification::NotificationCreated;
use crate::server::send_message;
use crate::server::session::SocketSession;

pub fn created(
    connections: &mut Vec<SocketSession>,
    data: NotificationCreated,
) {
    let client = match connections.iter().find(|session| session.user_id == Some(data.user_id)) {
        None => return,
        Some(value) => value
    };

    send_message(&client.frame, GatewayRequest::new(11, Some(GatewayData::NotificationCreated(data))))
}