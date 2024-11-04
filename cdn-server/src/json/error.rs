use axum::extract::multipart::MultipartError;
use axum::http::StatusCode;
use axum::Json;
use axum::response::{IntoResponse, Response};
use image::ImageError;
use serde::{Serialize, Serializer};

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
        String,
    ),
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

impl From<MultipartError> for ApiError {
    fn from(value: MultipartError) -> Self {
        ApiError::Custom(value.status(), value.body_text())
    }
}

impl From<std::io::Error> for ApiError {
    fn from(value: std::io::Error) -> Self {
        ApiError::Custom(StatusCode::INTERNAL_SERVER_ERROR, value.to_string())
    }
}

impl From<ImageError> for ApiError {
    fn from(value: ImageError) -> Self {
        ApiError::Custom(StatusCode::INTERNAL_SERVER_ERROR, value.to_string())
    }
}

pub fn serialize_status_code<S>(status_code: &StatusCode, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
{
    serializer.serialize_u16(status_code.as_u16())
}