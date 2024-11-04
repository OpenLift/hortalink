use serde::{Deserialize, Serialize};

use common::entities::NotificationType;

#[derive(Serialize, Deserialize, Clone)]
pub struct NotificationCreated {
    pub id: i32,
    #[serde(skip_serializing)]
    pub user_id: i32,
    pub title: String,
    pub content: String,
    pub read: bool,
    #[serde(rename = "type")]
    pub notification_type: NotificationType,
    pub icon: Option<String>,
}