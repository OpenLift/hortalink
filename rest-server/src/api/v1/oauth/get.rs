use axum::extract::{Path, Query};
use axum::{Extension, Json};
use axum_login::tower_sessions::Session;
use oauth2::{AuthorizationCode, PkceCodeVerifier, TokenResponse};
use reqwest::StatusCode;

use crate::app::auth::AuthSession;
use crate::app::provider::OAuthProvider;
use crate::app::server::AppState;
use crate::json::auth::{AuthzResp, UserInfo};
use crate::json::error::ApiError;
use crate::models::users::LoginUser;

pub async fn oauth_callback(
    session: Session,
    mut auth_session: AuthSession,
    Path(oauth_type): Path<String>,
    Extension(providers): Extension<OAuthProvider>,
    Query(AuthzResp { code, state: new_state }): Query<AuthzResp>,
    Extension(state): Extension<AppState>,
) -> Result<Json<Option<UserInfo>>, ApiError> {
    if let Ok(Some(old_state)) = session.remove::<String>("oauth.csrf").await {
        if &old_state != new_state.secret() {
            return Err(ApiError::Custom(StatusCode::BAD_REQUEST, "State não coincidem".to_string()));
        };
    } else {
        return Err(ApiError::Custom(StatusCode::BAD_REQUEST, "State não encontrado na sessão".to_string()));
    };

    let Ok(Some(pkce)) = session.remove::<String>("oauth.pkce").await else {
        return Err(ApiError::Custom(StatusCode::BAD_REQUEST, "PKCE não encontrado na sessão".to_string()))
    };

    let provider = providers.get_provider(&oauth_type);

    let token = if oauth_type == "linkedin" {
        provider.client
            .exchange_code(AuthorizationCode::new(code))
            .add_extra_param("client_secret", state.settings.secrets.linkedin.client_secret)
            .set_pkce_verifier(PkceCodeVerifier::new(pkce))
            .request_async(&oauth2::reqwest::Client::builder()
                .redirect(oauth2::reqwest::redirect::Policy::limited(1))
                .build().unwrap())
            .await
            .unwrap()
            .access_token()
            .secret()
            .clone()
    } else {
        provider.get_token(code, PkceCodeVerifier::new(pkce)).await?
            .access_token()
            .secret()
            .clone()
    };

    let user_info: UserInfo = provider.get_user(&token).await;

    let user = sqlx::query_as::<_, LoginUser>(
        r#"
            SELECT
                id, password,
                roles, access_token
            FROM USERS
            WHERE email = $1
        "#
    )
        .bind(&user_info.email)
        .fetch_optional(&state.pool)
        .await?;

    if let Some(user) = user {
        auth_session.login(&user).await?;

        Ok(Json(None))
    } else {
        session.insert("oauth.token", token).await?;
            
        Ok(Json(Some(user_info)))
    }
}