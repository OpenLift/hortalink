use sqlx::{Pool, Postgres};

use crate::json::{GatewayData, GatewayRequest};
use crate::json::message::{MessageCreated, MessageDeleted, MessageUpdated};
use crate::server::send_message;
use crate::server::session::SocketSession;

pub async fn created(
    connections: &mut Vec<SocketSession>,
    data: MessageCreated,
    pool: &Pool<Postgres>,
) {
    let opposite = get_opposite(data.chat, data.author_id, pool)
        .await;
    let client = match connections.iter().find(|session| session.user_id == Some(opposite)) {
        None => return,
        Some(value) => value
    };

    send_message(&client.frame, GatewayRequest::new(12, Some(GatewayData::MessageCreated(data))))
}

pub async fn deleted(
    connections: &mut Vec<SocketSession>,
    data: MessageDeleted,
    pool: &Pool<Postgres>,
) {
    let opposite = get_opposite(data.chat, data.author_id, pool)
        .await;
    let client = match connections.iter().find(|session| session.user_id == Some(opposite)) {
        None => return,
        Some(value) => value
    };

    send_message(&client.frame, GatewayRequest::new(13, Some(GatewayData::MessageDeleted(data))))
}

pub async fn updated(
    connections: &mut Vec<SocketSession>,
    data: MessageUpdated,
    pool: &Pool<Postgres>,
) {
    let opposite = get_opposite(data.chat, data.author_id, pool)
        .await;
    let client = match connections.iter().find(|session| session.user_id == Some(opposite)) {
        None => return,
        Some(value) => value
    };

    send_message(&client.frame, GatewayRequest::new(14, Some(GatewayData::MessageUpdated(data))))
}

async fn get_opposite(chat_id: i64, author_id: i32, pool: &Pool<Postgres>) -> i32 {
    let (user1, user2) = sqlx::query_as::<_, (i32, i32)>(
        r#"
            SELECT user1, user2
            FROM chats
            WHERE id = $1
        "#
    )
        .bind(chat_id)
        .fetch_one(pool)
        .await
        .unwrap();

    if author_id == user1 { user2 } else { user1 }
}