use axum::{Extension, Json};
use axum::extract::{Path, Query};
use axum_garde::WithValidation;
use sqlx::{Pool, Postgres};

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::products::SellerProductResponse;
use crate::json::utils::HomePage;
use crate::models::products::{SellerProduct, SellerProductPreview};
use crate::models::users::PreviewUser;

pub async fn product(
    Extension(state): Extension<AppState>,
    auth_session: AuthSession,
    Path((seller_id, product_id)): Path<(i32, i32)>,
) -> Result<Json<SellerProductResponse>, ApiError> {
    let product = sqlx::query_as::<_, SellerProduct>(
        r#"
            SELECT s.id, p.id AS product_id, p.name, 
                s.photos, s.quantity, s.price, s.description,
                COALESCE(CAST(s.rating_sum AS FLOAT) / CAST(NULLIF(s.rating_quantity, 0) AS FLOAT), NULL) AS rating,
                s.rating_quantity, s.unit, s.unit_quantity
            FROM seller_products s
            JOIN products p ON s.product_id = p.id
            LEFT JOIN seller_product_ratings sp ON s.id = sp.seller_product_id
            WHERE s.id = $1 AND s.seller_id = $2
            GROUP BY s.id, p.id, p.name, s.photos, s.quantity, s.price;
        "#
    )
        .bind(product_id)
        .bind(seller_id)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(ApiError::NotFound("Produto não encontrado".to_string()))?;

    let seller = sqlx::query_as::<_, PreviewUser>(
        r#"
            SELECT id AS user_id, avatar as user_avatar, name as user_name
            FROM users
            WHERE id = $1
        "#
    )
        .bind(seller_id)
        .fetch_one(&state.pool)
        .await?;

    let schedules = sqlx::query_scalar::<_, i64>(
        r#"
            SELECT sc.schedule_id
            FROM seller_products sp
            JOIN products_schedules sc ON sc.seller_product_id = sp.id
            WHERE sp.id = $1
        "#
    )
        .bind(product_id)
        .fetch_all(&state.pool)
        .await?;

    if let Some(user) = auth_session.user {
        if user.roles.contains(&3) {
            sqlx::query(
                r#"
                INSERT INTO products_seen_recently (seller_product_id, customer)
                VALUES ($1, $2) 
                ON CONFLICT ON CONSTRAINT unique_product_customer
                DO UPDATE SET viewed_at = CURRENT_TIMESTAMP;
            "#
            )
                .bind(product_id)
                .bind(user.id)
                .execute(&state.pool)
                .await?;
        }
    };

    Ok(Json(SellerProductResponse { product, schedules, seller }))
}

pub async fn products(
    Extension(state): Extension<AppState>,
    Path(seller_id): Path<i32>,
    WithValidation(query): WithValidation<Query<HomePage>>,
) -> Result<Json<Vec<SellerProductPreview>>, ApiError> {
    let products = fetch_products(seller_id, query.into_inner(), &state.pool)
        .await?;

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
               s.rating_quantity, s.seller_id
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