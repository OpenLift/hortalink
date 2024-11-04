use axum::{Extension, Json};
use axum::extract::Path;
use axum_login::tower_sessions::Session;

use crate::app::provider::OAuthProvider;
use crate::json::auth::AuthUrlResponse;
use crate::json::error::ApiError;

pub async fn oauth(
    Extension(providers): Extension<OAuthProvider>,
    Path(oauth_type): Path<String>,
    session: Session,
) -> Result<Json<AuthUrlResponse>, ApiError> {
    let ((auth_url, csrf), pkce_verifier) = providers.get_provider(&oauth_type)
        .auth_url();
    
    session
        .insert("oauth.csrf", csrf.secret())
        .await?;

    session
        .insert("oauth.pkce", pkce_verifier.secret())
        .await?;
    
    session.save().await?;
    
    let response = AuthUrlResponse {
        auth_url: if oauth_type == "linkedin" {
            auth_url.as_str().replace("+", "%20")
        } else {
            auth_url.as_str().to_string()
        }
    };

    Ok(Json(response))
}