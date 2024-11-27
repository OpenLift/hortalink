use axum::extract::{Path, Query};
use axum::{Extension, Json};
use axum_garde::WithValidation;
use sqlx::{Pool, Postgres};

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::products::SellerProductResponse;
use crate::json::utils::HomePage;
use crate::models::products::SellerProductPreview;

pub async fn products(
    Extension(state): Extension<AppState>,
    Path(seller_id): Path<i32>,
    WithValidation(query): WithValidation<Query<HomePage>>,
) -> Result<Json<Vec<SellerProductPreview>>, ApiError> {
    let products = fetch_products(seller_id, query.into_inner(), &state.pool).await?;

    Ok(Json(products))
}

pub async fn fetch_products(
    seller_id: i32,
    query: HomePage,
    pool: &Pool<Postgres>,
) -> Result<Vec<SellerProductPreview>, ApiError> {
    let products = sqlx::query_as::<_, SellerProductPreview>(
        r#"
            SELECT s.id, p.id AS product_id, p.name,
               s.photos[1] AS photo, s.price, s.unit, s.unit_quantity,
               COALESCE(CAST(s.rating_sum AS FLOAT) / CAST(NULLIF(s.rating_quantity, 0) AS FLOAT), NULL) AS rating,
               s.rating_quantity
            FROM seller_products s
            JOIN products p ON s.product_id = p.id
            WHERE s.seller_id = $1
            ORDER BY s.id
            LIMIT $2 OFFSET $3
        "#
    )
        .bind(seller_id)
        .bind(query.per_page)
        .bind((query.page - 1) * query.per_page)
        .fetch_all(pool)
        .await?;

    Ok(products)
}
