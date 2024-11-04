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
            SELECT u.id AS user_id, u.avatar as user_avatar, u.name as user_name,
                m.content AS last_message, c.id
            FROM chats c
            LEFT JOIN users u ON u.id = CASE WHEN c.user1 != $1 THEN c.user1 ELSE c.user2 END
            JOIN messages m ON m.chat = c.id
            WHERE (c.user1 = 1 OR c.user2 = 1) AND c.hidden = false
            ORDER BY m.created_at DESC
        "#
    )
        .bind(user.id)
        .fetch_all(&state.pool)
        .await?;

    Ok(Json(chats))
}
