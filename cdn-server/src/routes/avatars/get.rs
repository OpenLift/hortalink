use axum::body::Body;
use axum::Extension;
use axum::extract::{Path, Query};
use axum::http::StatusCode;
use axum::response::Response;

use app_core::image::ImageManager;

use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::query::ImageSizeQuery;

pub async fn user_avatar(
    Path((user_id, image)): Path<(i32, String)>,
    Query(query): Query<ImageSizeQuery>,
    Extension(state): Extension<AppState>,
) -> Result<Response, ApiError> {
    let parts: Vec<&str> = image.split(".").collect();
    let filename = parts.first()
        .ok_or(ApiError::NotFound("Nome do arquivo não encontrado".to_string()))?;

    let path = &format!(
        "{}/avatars/{}/{}",
        &state.settings.web.cdn.storage,
        user_id,
        filename
    );

    let path = std::path::Path::new(path);

    if !path.exists() {
        return Err(ApiError::NotFound("Arquivo não encontrado".to_string()));
    }

    let extension = parts.last()
        .ok_or(ApiError::NotFound("Extensão do arquivo não encontrado".to_string()))?;
    path.with_extension(extension);

    Ok(
        Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", format!("image/{extension}"))
            .header(
                "Content-Disposition",
                format!("attachment; filename=\"{}\"", filename),
            )
            .body(Body::from(ImageManager::new(path).get_image(query.size, extension).await?))
            .unwrap()
    )
}