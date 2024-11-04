use axum::Extension;
use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;

pub async fn chat(
    Extension(state): Extension<AppState>,
    auth_session: AuthSession,
) -> Result<(), ApiError> {
    Ok(())
}