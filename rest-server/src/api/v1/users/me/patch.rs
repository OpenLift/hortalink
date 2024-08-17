use std::path::Path;

use axum::{Extension};
use axum::http::StatusCode;
use axum_typed_multipart::TypedMultipart;
use garde::Validate;
use app_core::image::ImageManager;

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::users::PatchUserMe;

pub async fn me(
    Extension(state): Extension<AppState>,
    auth_session: AuthSession,
    TypedMultipart(payload): TypedMultipart<PatchUserMe>,
) -> Result<(), ApiError> {
    if let Err(e) = payload.validate() {
        return Err(ApiError::Custom(StatusCode::BAD_REQUEST, format!("Campos inválidos: {e}")));
    }
    
    let login_user = auth_session.user.unwrap().id;
    
    let mut hash = None;

    if let Some(avatar) = payload.image {
        let format = avatar.metadata.content_type
            .ok_or(ApiError::NotFound("Formato de imagem não encontrado".to_string()))?
            .to_string();
        let format = format
            .split('/')
            .last().unwrap();

        let path = &format!("{}/avatars/{}", &state.settings.web.cdn.storage, login_user);
        let path = Path::new(path);

        if !path.exists() {
            std::fs::create_dir(path)
                .map_err(|e| ApiError::Custom(StatusCode::INTERNAL_SERVER_ERROR, format!("Falha ao criar repositório: {e}")))?;
        }

        if let Ok(entries) = std::fs::read_dir(path) {
            for entry in entries {
                if let Ok(entry) = entry {
                    if let Err(e) = std::fs::remove_file(entry.path()) {
                        eprintln!("Failed to remove file: {}", e);
                    }
                }
            }
        }

        hash = Some(ImageManager::new(path).create_image(&format, avatar.contents, 400).await?);
    }

    sqlx::query(
        r#"
            UPDATE users
            SET
                avatar = COALESCE($1, avatar),
                name = COALESCE($2, name),
                phone = COALESCE($3, phone),
                email = COALESCE($4, email)
            WHERE id = $5;
        "#
    )
        .bind(hash)
        .bind(payload.name)
        .bind(payload.phone)
        .bind(payload.email)
        .bind(login_user)
        .execute(&state.pool)
        .await
        .unwrap();

    Ok(())
}