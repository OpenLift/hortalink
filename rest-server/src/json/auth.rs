use axum::body::Bytes;
use axum_typed_multipart::{FieldData, TryFromMultipart};
use garde::Validate;
use oauth2::CsrfToken;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize)]
pub enum Credentials {
    Password(LoginCreds),
    OAuth(OAuthCreds),
}

#[derive(Debug, Clone, Deserialize)]
pub struct OAuthCreds {
    pub user: UserInfo,
    pub token: String,
}

#[derive(Debug, Clone, Deserialize, Serialize, Validate)]
pub struct LoginCreds {
    #[garde(email)]
    pub email: String,
    #[garde(length(min = 8, max = 64))]
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserInfo {
    pub email: String,
    pub name: String,
    pub picture: Option<String>,
}

#[derive(Validate, TryFromMultipart)]
pub struct SignCreds {
    #[garde(skip)]
    pub name: String,
    #[garde(email)]
    pub email: String,
    #[garde(length(min = 8, max = 64))]
    pub password: Option<String>,
    #[garde(range(min = 3, max = 6))]
    pub role: i32,
    #[garde(skip)]
    #[form_data(limit = "15MiB")]
    pub image: Option<FieldData<Bytes>>,
}

#[derive(Serialize)]
pub struct AuthUrlResponse {
    pub auth_url: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct AuthzResp {
    pub state: CsrfToken,
    pub code: String,
}
