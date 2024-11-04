use axum::Extension;
use axum::extract::Path;

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::models::ratings::ProductRatingInfo;

pub async fn rating(
    Extension(state): Extension<AppState>,
    Path((seller_id, _, rating_id)): Path<(i32, i32, i32)>,
    auth_session: AuthSession,
) -> Result<(), ApiError> {
    let author_id = ProductRatingInfo::get_author(&state.pool, rating_id)
        .await?;
    let login_user_id = auth_session.user.unwrap().id;

    if login_user_id == seller_id || login_user_id != author_id {
        return Err(ApiError::Unauthorized("Você não pode fazer isso".to_string()));
    }
    
    sqlx::query(
        r#"
            DELETE FROM seller_product_ratings
            WHERE id = $1
        "#
    )
        .bind(rating_id)
        .execute(&state.pool)
        .await?;

    Ok(())
}