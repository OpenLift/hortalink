use axum::extract::multipart::MultipartError;
use axum::http::StatusCode;
use axum::Json;
use axum::response::{IntoResponse, Response};
use image::ImageError;
use serde::{Serialize, Serializer};
use crate::app::auth::AuthGate;

#[derive(Debug, thiserror::Error, Serialize)]
pub enum ApiError {
    #[error("Database")]
    #[serde(rename = "message")]
    Database(String),
    #[error("Unauthorized")]
    #[serde(rename = "message")]
    Unauthorized(String),
    #[error("NotFound")]
    #[serde(rename = "message")]
    NotFound(String),
    #[serde(rename = "message")]
    #[error("Custom")]
    Custom(
        #[serde(serialize_with = "serialize_status_code")]
        StatusCode,
        String
    )
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let status = match self {
            ApiError::Database(_) => StatusCode::INTERNAL_SERVER_ERROR,
            ApiError::Unauthorized(_) => StatusCode::UNAUTHORIZED,
            ApiError::NotFound(_) => StatusCode::NOT_FOUND,
            ApiError::Custom(code, _) => code
        };

        (status, Json(self)).into_response()
    }
}

impl From<sqlx::Error> for ApiError {
    fn from(value: sqlx::Error) -> Self {
        log::error!("Database error: {value}");
        ApiError::Database(format!("Falha no banco de dados: {}", value))
    }
}

impl From<axum_login::Error<AuthGate>> for ApiError {
    fn from(value: axum_login::Error<AuthGate>) -> Self {
        ApiError::Database(format!("Falha no banco de dados: {}", value))
    }
}

impl From<axum_login::tower_sessions::session::Error> for ApiError {
    fn from(value: axum_login::tower_sessions::session::Error) -> Self {
        ApiError::Custom(StatusCode::INTERNAL_SERVER_ERROR, format!("{:?}", value))
    }
}

impl From<ImageError> for ApiError {
    fn from(value: ImageError) -> Self {
        ApiError::Custom(StatusCode::INTERNAL_SERVER_ERROR, value.to_string())
    }
}

impl From<MultipartError> for ApiError {
    fn from(value: MultipartError) -> Self {
        ApiError::Custom(value.status(), value.body_text())
    }
}

pub fn serialize_status_code<S>(status_code: &StatusCode, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
{
    serializer.serialize_u16(status_code.as_u16())
}