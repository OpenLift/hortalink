use std::net::SocketAddr;

use serde::{Deserialize, Deserializer, Serialize, Serializer};
use crate::json::message::{MessageCreated, MessageDeleted, MessageUpdated};
use crate::json::notification::NotificationCreated;

pub mod user;
pub mod notification;
pub mod message;

#[derive(Serialize, Deserialize)]
pub struct GatewayRequest {
    pub opcode: u32,
    pub d: Option<GatewayData>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(untagged)]
pub enum GatewayData {
    // opcode: 10
    Identify { session_id: String },
    // opcode: 11
    NotificationCreated(NotificationCreated),
    // opcode: 12
    MessageCreated(MessageCreated),
    // opcode: 13
    MessageDeleted(MessageDeleted),
    // opcode: 14
    MessageUpdated(MessageUpdated),
}

#[derive(Serialize, Deserialize)]
#[serde(untagged)]
pub enum PostgresEvent {
    NotificationCreated(NotificationCreated),
    MessageCreated(MessageCreated),
    MessageDeleted(MessageDeleted),
    MessageUpdated(MessageUpdated),
}

pub enum Command {
    Disconnect(SocketAddr),
    Identify(SocketAddr, String),
    NotificationCreated(NotificationCreated),
    MessageCreated(MessageCreated),
    MessageDeleted(MessageDeleted),
    MessageUpdated(MessageUpdated),
}

impl GatewayRequest {
    pub fn new(opcode: u32, d: Option<GatewayData>) -> Self {
        Self { opcode, d }
    }
}