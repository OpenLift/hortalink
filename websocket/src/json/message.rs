use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct MessageCreated {
    id: i64,
    pub author_id: i32,
    pub chat: i64,
    content: String,
    created_at: NaiveDateTime,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct MessageUpdated {
    id: i64,
    pub chat: i64,
    content: String,
    pub author_id: i32,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct MessageDeleted {
    id: i64,
    pub chat: i64,
    pub author_id: i32,
}