use serde::Serialize;
use sqlx::types::chrono::NaiveDateTime;

use crate::json::serialize_timestamp;
use crate::models::users::PreviewUser;

#[derive(Serialize, sqlx::FromRow)]
pub struct ChatPreview {
    id: i64,
    #[sqlx(flatten)]
    user: PreviewUser,
    last_message: Option<String>,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct Message {
    is_author: bool,
    content: String,
    #[serde(serialize_with = "serialize_timestamp")]
    created_at: NaiveDateTime,
    viewed: bool,
}