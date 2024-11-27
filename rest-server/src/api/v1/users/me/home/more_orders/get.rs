use axum::{Extension, Json};
use axum::extract::Query;
use axum_garde::WithValidation;
use sqlx::{Pool, Postgres};

use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::utils::HomePage;
use crate::models::products::SellerProductPreview;

pub async fn more_orders(
    Extension(state): Extension<AppState>,
    WithValidation(query): WithValidation<Query<HomePage>>,
) -> Result<Json<Vec<SellerProductPreview>>, ApiError> {
    Ok(Json(fetch(query.into_inner(), &state.pool).await?))
}

pub async fn fetch(
    query: HomePage,
    pool: &Pool<Postgres>,
) -> Result<Vec<SellerProductPreview>, ApiError> {
    let more_orders = sqlx::query_as::<_, SellerProductPreview>(
        r#"
            SELECT sp.id, p.id AS product_id, p.name,
                sp.photos[1] AS photo, sp.price, sp.unit_quantity,
                COALESCE(CAST(sp.rating_sum AS FLOAT) / CAST(NULLIF(sp.rating_quantity, 0) AS FLOAT), NULL) AS rating,
                sp.rating_quantity, sp.unit,
                SUM(c.amount) AS total
            FROM cart c
            JOIN seller_products sp ON c.seller_product_id = sp.id
            JOIN products p ON sp.product_id = p.id
            WHERE status = 4
            GROUP BY sp.id, p.id
            ORDER BY total DESC
            LIMIT $1 OFFSET $2
        "#
    )
        .bind(query.per_page)
        .bind((query.page - 1) * query.per_page)
        .fetch_all(pool)
        .await?;

    Ok(more_orders)
}