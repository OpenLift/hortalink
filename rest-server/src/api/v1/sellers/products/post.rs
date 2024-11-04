use axum::Extension;
use axum::extract::Path;
use axum::http::StatusCode;
use axum_typed_multipart::TypedMultipart;
use garde::Validate;

use app_core::image::ImageManager;

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::products::PostSellerProduct;

pub async fn product(
    Extension(state): Extension<AppState>,
    Path(seller_id): Path<i32>,
    auth_session: AuthSession,
    TypedMultipart(payload): TypedMultipart<PostSellerProduct>,
) -> Result<(), ApiError> {
    if let Err(e) = payload.validate() {
        return Err(ApiError::Custom(StatusCode::BAD_REQUEST, format!("Campos inválidos: {e}")));
    }
    
    if auth_session.user.unwrap().id != seller_id {
        return Err(ApiError::Unauthorized("Você não pode fazer isso".to_string()));
    }

    let mut tx = state.pool.begin().await?;

    let id = sqlx::query_scalar::<_, i32>(
        r#"
            INSERT INTO seller_products (product_id, seller_id, price, quantity, unit, unit_quantity, description)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        "#
    )
        .bind(payload.product_id)
        .bind(seller_id)
        .bind(payload.price)
        .bind(payload.quantity)
        .bind(payload.unit)
        .bind(payload.unit_quantity)
        .bind(payload.description)
        .fetch_one(&mut *tx)
        .await?;

    for schedule_id in payload.schedules_id {
        sqlx::query(
            r#"
                INSERT INTO products_schedules (seller_product_id, schedule_id)
                VALUES ($1, $2)
            "#
        )
            .bind(id)
            .bind(schedule_id)
            .execute(&mut *tx)
            .await?;
    }

    let mut hashes = Vec::new();

    let path = &format!("{}/products/{id}", &state.settings.web.cdn.storage);
    let path = std::path::Path::new(path);

    if !path.exists() {
        std::fs::create_dir(path)
            .map_err(|e| ApiError::Custom(StatusCode::INTERNAL_SERVER_ERROR, format!("Falha ao criar repositório: {e}")))?;
    }
    
    for photo in payload.photos {
        let format = photo.metadata.content_type
            .ok_or(ApiError::NotFound("Formato de imagem não encontrado".to_string()))?
            .to_string();
        let format = format
            .split('/')
            .last().unwrap();

        let hash = ImageManager::new(path).create_image(&format, photo.contents, 400).await?;
        hashes.push(hash);
    }

    sqlx::query(
        r#"
            UPDATE seller_products SET photos = $1 WHERE id = $2
        "#
    )
        .bind(hashes)
        .bind(id)
        .execute(&mut *tx)
        .await?;

    tx.commit().await?;
    Ok(())
}