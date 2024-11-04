use axum::{Extension, Json};
use axum::extract::Path;
use axum_garde::WithValidation;
use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::chats::PatchMessage;
use crate::json::error::ApiError;

pub async fn message(
    Extension(state): Extension<AppState>,
    auth_session: AuthSession,
    Path(chat_id): Path<i32>,
    WithValidation(payload): WithValidation<Json<PatchMessage>>
) -> Result<(), ApiError> {
    let payload = payload.into_inner();
    let user = auth_session.user.unwrap();
    
    let (user1, user2) = sqlx::query_as::<_, (i32, i32)>(
        r#"
            SELECT user1, user2
            FROM chats
            WHERE id = $1
        "#
    )
        .bind(chat_id)
        .fetch_one(&state.pool)
        .await?;
    
    if user1 != user.id && user2 != user.id {
        return Err(ApiError::Unauthorized("Esse chat não lhe pertence".to_string()));
    }
    
    sqlx::query(
        r#"
            INSERT INTO messages (author_id, content, chat)
            VALUES ($1, $2, $3)
        "#
    )
        .bind(user.id)
        .bind(payload.content)
        .bind(chat_id)
        .execute(&state.pool)
        .await?;
    
    Ok(())
}