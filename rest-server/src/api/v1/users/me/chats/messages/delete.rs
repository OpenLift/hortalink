use axum::Extension;
use axum::extract::Path;

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;

pub async fn message(
    Extension(state): Extension<AppState>,
    Path((chat_id, message_id)): Path<(i32, i32)>,
    auth_session: AuthSession,
) -> Result<(), ApiError> {
    let user = auth_session.user.unwrap();
    let query = sqlx::query(
        r#"
            DELETE FROM messages
            WHERE id = $1 AND chat = $2 AND author_id = $3
        "#
    )
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