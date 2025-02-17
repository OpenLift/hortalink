use axum::{Extension, Json};
use axum::extract::{Path, Query};
use axum_garde::WithValidation;
use sqlx::{Pool, Postgres};

use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::utils::Pagination;
use crate::models::ratings::ProductRatingInfo;

pub async fn ratings(
    Extension(state): Extension<AppState>,
    Path(seller_id): Path<i32>,
    WithValidation(query): WithValidation<Query<Pagination>>,
) -> Result<Json<Vec<ProductRatingInfo>>, ApiError> {
    let ratings = fetch_reviews(seller_id, query.into_inner(), &state.pool)
        .await?;

    Ok(Json(ratings))
}

pub async fn fetch_reviews(seller_id: i32, query: Pagination, pool: &Pool<Postgres>) -> Result<Vec<ProductRatingInfo>, ApiError> {
    Ok(sqlx::query_as::<_, ProductRatingInfo>(
        r#"
            SELECT
                s.id, s.author_id, s.created_at, c.id AS user_id,
                s.was_edited, s.rating, s.content, c.name AS user_name,
                c.avatar AS user_avatar, sp.id AS product_id, sp.id AS product_id,
                 p.name AS product_name, sp.photos[1] AS photo
            FROM seller_product_ratings s
            JOIN users c ON s.author_id = c.id
            JOIN seller_products sp ON sp.id = s.seller_product_id
            JOIN products p ON p.id = sp.product_id
            WHERE sp.seller_id = $1
            ORDER BY s.created_at DESC
            LIMIT $2 OFFSET $3
        "#
    )
        .bind(seller_id)
        .bind(query.per_page)
        .bind((query.page - 1) * query.per_page)
        .fetch_all(pool)
        .await?
    )
}