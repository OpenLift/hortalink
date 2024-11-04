use axum::Extension;
use axum::extract::Path;
use axum::http::StatusCode;
use axum_typed_multipart::TypedMultipart;
use garde::Validate;

use app_core::image::ImageManager;

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::products::PatchSellerProduct;
use crate::models::products::SellerProduct;

pub async fn product(
    Extension(state): Extension<AppState>,
    Path((seller_id, product_id)): Path<(i32, i32)>,
    auth_session: AuthSession,
    TypedMultipart(payload): TypedMultipart<PatchSellerProduct>,
) -> Result<(), ApiError> {
    if let Err(e) = payload.validate() {
        return Err(ApiError::Custom(StatusCode::BAD_REQUEST, format!("Campos inválidos: {e}")));
    }

    let author = SellerProduct::get_author(&state.pool, product_id)
        .await?;

    if auth_session.user.unwrap().id != seller_id || author != seller_id {
        return Err(ApiError::Unauthorized("Você não pode fazer isso".to_string()));
    }

    let mut tx = state.pool.begin().await?;

    sqlx::query(
        r#"
            UPDATE seller_products
            SET price = COALESCE($1, price), 
                quantity = COALESCE($2, quantity),
                unit = COALESCE($3, unit)
                unit_quantity = COALESCE($4, unit_quantity)
                description = COALESCE($5, description)
            WHERE product_id = $4
        "#
    )
        .bind(payload.price)
        .bind(payload.quantity)
        .bind(payload.unit)
        .bind(payload.unit_quantity)
        .bind(payload.description)
        .bind(product_id)
        .execute(&mut *tx)
        .await?;

    if !payload.remove_schedules.is_empty() {
        sqlx::query(
            r#"
                DELETE FROM products_schedules
                WHERE seller_product_id = $1 AND schedule_id IN $2;
            "#
        )
            .bind(product_id)
            .bind(payload.remove_schedules)
            .execute(&mut *tx)
            .await?;
    }

    if !payload.add_schedules.is_empty() {
        let mut values = String::new();
        for (index, schedule) in payload.add_schedules.iter().enumerate() {
            if index != 0 {
                values.push_str(", ");
            }

            values.push_str(&format!("({product_id}, {schedule})"));
        }

        sqlx::query(&format!(
            r#"
                INSERT INTO products_schedules (seller_product_id, schedule_id)
                VALUES {values}
            "#
        ))
            .execute(&mut *tx)
            .await?;
    }


    if !payload.remove_photos.is_empty() || !payload.add_photos.is_empty() {
        let path = &format!("{}/products/{product_id}", &state.settings.web.cdn.storage);
        let path = std::path::Path::new(path);

        if !path.exists() {
            std::fs::create_dir(path)
                .map_err(|e| ApiError::Custom(StatusCode::INTERNAL_SERVER_ERROR, format!("Falha ao criar repositório: {e}")))?;
        }

        let mut actual = Vec::new();
        let mut hashes = Vec::new();

        if let Ok(entries) = std::fs::read_dir(path) {
            for entry in entries {
                if let Ok(entry) = entry {
                    let name = entry.file_name().to_str().unwrap().to_string();

                    if payload.remove_photos.contains(&name) {
                        std::fs::remove_file(entry.path()).expect("Failed to delete");
                    } else {
                        actual.push(name)
                    }
                }
            }
        }
        
        if !payload.add_photos.is_empty() {
            for photo in payload.add_photos {
                let format = photo.metadata.content_type
                    .ok_or(ApiError::NotFound("Formato de imagem não encontrado".to_string()))?
                    .to_string();
                let format = format
                    .split('/')
                    .last().unwrap();

                let hash = ImageManager::new(path).create_image(&format, photo.contents, 400).await?;
                hashes.push(hash);
            }
        }

        sqlx::query(
            r#"
                UPDATE seller_products
                SET photos = $1
                WHERE product_id = $2
            "#
        )
            .bind([actual, hashes].concat())
            .bind(product_id)
            .execute(&mut *tx)
            .await?;
    }

    tx.commit().await?;

    Ok(())
}