use axum::body::Body;
use axum::Extension;
use axum::extract::{Path, Query};
use axum::http::StatusCode;
use axum::response::Response;

use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::query::ImageSizeQuery;
use crate::utils::image::ImageManager;

pub async fn product_photo(
    Path((product_id, image)): Path<(i32, String)>,
    Query(query): Query<ImageSizeQuery>,
    Extension(state): Extension<AppState>,
) -> Result<Response, ApiError> {
    let parts: Vec<&str> = image.split(".").collect();
    let filename = parts.first()
        .ok_or(ApiError::NotFound("Nome do arquivo não encontrado".to_string()))?;

    let path = &format!(
        "{}/products/{}/{}",
        &state.settings.web.cdn.storage,
        product_id,
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
            .body(Body::from(ImageManager::new(path).get_image(query.size).await?))
            .unwrap()
    )
}