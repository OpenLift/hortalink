use axum::{Extension, Json};
use axum::http::StatusCode;
use axum_garde::WithValidation;

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::cart::PostProductCart;
use crate::json::error::ApiError;

pub async fn product(
    Extension(state): Extension<AppState>,
    auth_session: AuthSession,
    WithValidation(payload): WithValidation<Json<PostProductCart>>,
) -> Result<(), ApiError> {
    if let Some(withdrawn) = payload.withdrawn {
        sqlx::query_scalar::<_, i64>(
            r#"
            SELECT id
            FROM products_schedules
            WHERE seller_product_id = $1 AND schedule_id = $2
            "#
        )
            .bind(payload.seller_product_id)
            .bind(withdrawn)
            .fetch_optional(&state.pool)
            .await?
            .ok_or(ApiError::Custom(StatusCode::BAD_REQUEST, "Agenda inválida".to_string()))?;
    }

    sqlx::query(
        r#"
            INSERT INTO cart (seller_product_id, customer_id, withdrawn, amount)
            VALUES ($1, $2, $3, $4)
        "#
    )
        .bind(payload.seller_product_id)
        .bind(auth_session.user.unwrap().id)
        .bind(payload.withdrawn)
        .bind(payload.amount)
        .execute(&state.pool)
        .await?;

    Ok(())
}