use axum::{Extension, Json};
use axum::extract::{Path, Query};
use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::utils::Pagination;
use crate::models::chats::Message;

pub async fn messages(
    Extension(state): Extension<AppState>,
    Path(chat_id): Path<i32>,
    Query(query): Query<Pagination>,
    auth_session: AuthSession,
) -> Result<Json<Vec<Message>>, ApiError> {
    let user = auth_session.user.unwrap();
    let messages = sqlx::query_as::<_, Message>(
        r#"
            SELECT 
                (m.author_id = $1) AS is_author, m.content, m.created_at
            FROM messages m
            INNER JOIN chats c ON m.chat = c.id
            WHERE m.chat = $2 AND (c.user1 = $1 OR c.user2 = $1)
            ORDER BY m.created_at DESC
            LIMIT $3 OFFSET $4;
        "#
    )
        .bind(user.id)
        .bind(chat_id)
        .bind(query.per_page)
        .bind((query.page - 1) * query.per_page)
        .fetch_all(&state.pool)
        .await?;

    Ok(Json(messages))
}