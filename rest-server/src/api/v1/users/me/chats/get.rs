use axum::{Extension, Json};

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::models::chats::ChatPreview;

pub async fn chats(
    Extension(state): Extension<AppState>,
    auth_session: AuthSession,
) -> Result<Json<Vec<ChatPreview>>, ApiError> {
    let user = auth_session.user.unwrap();
    let chats = sqlx::query_as::<_, ChatPreview>(
        r#"
            SELECT DISTINCT ON (u.id)
                u.id AS user_id,
                u.avatar AS user_avatar,
                u.name AS user_name,
                m.content AS last_message,
                c.id
            FROM chats c
            LEFT JOIN users u ON (u.id = c.user1 OR u.id = c.user2) AND u.id <> $1
            LEFT JOIN messages m ON m.chat = c.id
            ORDER BY u.id, m.created_at DESC;
        "#
    )
        .bind(user.id)
        .fetch_all(&state.pool)
        .await?;

    Ok(Json(chats))
}
