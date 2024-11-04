use axum::{Extension, Json};
use crate::api::v1::customers::orders::get::fetch_orders;
use crate::api::v1::sellers::ratings::get::fetch_reviews;
use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::users::UserResponse;
use crate::json::utils::Pagination;
use crate::models::sellers::PublicProfile;

pub async fn me(
    Extension(state): Extension<AppState>,
    auth_session: AuthSession,
) -> Result<Json<UserResponse>, ApiError> {
    let login_user = auth_session.user.unwrap();

    let profile = PublicProfile::fetch(login_user.id, &state.pool)
        .await?;

    if profile.is_seller {
        Ok(
            Json(UserResponse {
                profile,
                orders: None,
                reviews: Some(fetch_reviews(
                    login_user.id, 
                    Pagination { page: 1, per_page: 15 }, 
                    &state.pool
                ).await?),
                customer_reviews: None,
                products: None,
            })
        )
    } else {
        Ok(
            Json(UserResponse {
                profile,
                orders: Some(fetch_orders(
                    login_user.id, 
                    Pagination { page: 1, per_page: 15 }, 
                    &state.pool
                ).await?),
                reviews: None,
                customer_reviews: None,
                products: None,
            })
        )
    }
}