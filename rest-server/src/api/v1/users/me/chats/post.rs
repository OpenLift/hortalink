use axum::Extension;
use axum::extract::Query;
use axum_garde::WithValidation;

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::chats::CreateChat;
use crate::json::error::ApiError;

pub async fn chat(
    Extension(state): Extension<AppState>,
    auth_session: AuthSession,
    WithValidation(payload): WithValidation<Query<CreateChat>>,
) -> Result<(), ApiError> {
    let user = auth_session.user.unwrap();

    sqlx::query(
        r#"
            INSERT INTO chats (user1, user2)
            VALUES ($1, $2)
        "#
    )
        .bind(user.id)
        .bind(payload.user_id)
        .execute(&state.pool)
        .await?;

    Ok(())
}