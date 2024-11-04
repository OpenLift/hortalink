use crate::app::auth::AuthSession;
use crate::json::error::ApiError;

pub async fn logout(
    mut auth_session: AuthSession
) -> Result<(), ApiError> {
    auth_session.logout().await?;

    Ok(())
}