use axum::Extension;
use axum::extract::Path;
use axum::http::StatusCode;

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::models::products::SellerProduct;

pub async fn product(
    Extension(state): Extension<AppState>,
    Path((seller_id, product_id)): Path<(i32, i32)>,
    auth_session: AuthSession,
) -> Result<(), ApiError> {
    let author = SellerProduct::get_author(&state.pool, product_id)
        .await?;

    if auth_session.user.unwrap().id != seller_id || author != seller_id {
        return Err(ApiError::Unauthorized("Você não pode fazer isso".to_string()));
    }

    let opened_order = sqlx::query_scalar::<_, i32>(
        r#"
            SELECT 1
            FROM cart
            WHERE seller_product_id = $1 AND status = 2 OR status = 4
        "#
    )
        .bind(product_id)
        .fetch_optional(&state.pool)
        .await?;

    if opened_order.is_some() {
        return Err(ApiError::Custom(StatusCode::FAILED_DEPENDENCY, "Pedidos em aberto".to_string()));
    }

    let mut tx = state.pool.begin().await?;

    sqlx::query(
        r#"
            DELETE FROM cart
            WHERE seller_product_id = $1
        "#
    )
        .bind(product_id)
        .execute(&mut *tx)
        .await?;

    sqlx::query(
        r#"
            DELETE FROM seller_product_ratings
            WHERE seller_product_id = $1
        "#
    )
        .bind(product_id)
        .execute(&mut *tx)
        .await?;

    sqlx::query(
        r#"
            DELETE FROM seller_products
            WHERE id = $1
        "#
    )
        .bind(product_id)
        .execute(&mut *tx)
        .await?;

    tx.commit().await?;
    Ok(())
}