use axum::{Extension, Json};
use axum::extract::Path;
use axum_garde::WithValidation;
use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::chats::PatchMessage;
use crate::json::error::ApiError;

pub async fn message(
    Extension(state): Extension<AppState>,
    Path((chat_id, message_id)): Path<(i32, i32)>,
    auth_session: AuthSession,
    WithValidation(payload): WithValidation<Json<PatchMessage>>
) -> Result<(), ApiError> {
    let payload = payload.into_inner();
    let user = auth_session.user.unwrap();
    
    let query = sqlx::query(
        r#"
            UPDATE messages
            SET content = $1
            WHERE id = $2 AND chat = $3 AND author_id = $4
        "#
    )
        .bind(payload.content)
        .bind(message_id)
        .bind(chat_id)
        .bind(user.id)
        .execute(&state.pool)
        .await?;

    if query.rows_affected() == 0 {
        return Err(ApiError::NotFound("Mensagem não encontrada".to_string()))
    }

    Ok(())
}