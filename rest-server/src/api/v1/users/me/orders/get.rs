use axum::{Extension, Json};

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::models::cart::Order;

pub async fn orders(
    Extension(state): Extension<AppState>,
    auth_session: AuthSession,
) -> Result<Json<Vec<Order>>, ApiError> {
    let orders = sqlx::query_as::<_, Order>(
        r#"
            SELECT u.name, u.avatar, c.customer_id AS user_id,
                json_agg(json_build_object(
                'order_id', c.id,
                'status', c.status,
                'withdrawn', c.withdrawn,
                'amount', c.amount,
                'price', sp.price,
                'product_id', sp.id,
                'photos', sp.photos,
                'product_name', p.name,
                'unit', sp.unit
                )) AS products
            FROM cart c
            JOIN seller_products sp ON c.seller_product_id = sp.id
            JOIN products p ON sp.product_id = p.id
            JOIN users u ON c.customer_id = u.id
            WHERE sp.seller_id = 17 AND c.status = 2 OR c.status = 3 OR c.status = 4
            GROUP BY u.name, u.avatar, c.customer_id;
        "#
    )
        .bind(auth_session.user.unwrap().id)
        .fetch_all(&state.pool)
        .await?;

    Ok(Json(orders))
}