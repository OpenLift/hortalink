use axum::{Extension, Json};
use axum::extract::{Path, Query};
use axum_garde::WithValidation;
use serde::Serialize;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::utils::Pagination;
use crate::models::ratings::ProductRatingInfo;

#[derive(Serialize)]
pub struct RatingsResponse {
    rating: f64,
    ratings: Vec<ProductRatingInfo>
}

pub async fn ratings(
    Extension(state): Extension<AppState>,
    Path((_, product_id)): Path<(i32, i32)>,
    WithValidation(query): WithValidation<Query<Pagination>>,
) -> Result<Json<RatingsResponse>, ApiError> {
    let query = query.into_inner();

    let rating = sqlx::query_scalar::<_, f64>(
        r#"
            SELECT COALESCE(CAST(rating_sum AS FLOAT) / CAST(NULLIF(rating_quantity, 0) AS FLOAT), NULL) AS rating
            FROM seller_products
            WHERE id = $1
        "#
    )
        .bind(product_id)
        .fetch_one(&state.pool)
        .await?;

    let ratings = sqlx::query_as::<_, ProductRatingInfo>(
        r#"
            SELECT
                s.id, s.author_id, s.created_at, c.id AS user_id,
                s.was_edited, s.rating, s.content, c.name AS user_name,
                c.avatar AS user_avatar
            FROM seller_product_ratings s
            JOIN users c ON s.author_id = c.id
            WHERE s.seller_product_id = $1
            ORDER BY s.created_at DESC
            LIMIT $2 OFFSET $3
        "#
    )
        .bind(product_id)
        .bind(query.per_page)
        .bind((query.page - 1) * query.per_page)
        .fetch_all(&state.pool)
        .await?;

    Ok(Json(RatingsResponse { rating, ratings }))
}