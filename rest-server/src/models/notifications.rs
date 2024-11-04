use serde::Serialize;
use sqlx::types::chrono::NaiveDateTime;
use crate::json::serialize_timestamp;

#[derive(sqlx::FromRow, Serialize)]
pub struct Notification {
    id: i64,
    title: String,
    content: String,
    #[serde(serialize_with = "serialize_timestamp")]
    created_at: NaiveDateTime,
    read: bool,
    notification_type: i16,
    icon: Option<String>
}

#[derive(sqlx::FromRow, Serialize)]
pub struct NotificationPreview {
    id: i64,
    title: String,
    #[serde(serialize_with = "serialize_timestamp")]
    created_at: NaiveDateTime,
    read: bool,
}