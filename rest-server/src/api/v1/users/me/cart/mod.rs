mod get;
mod patch;
mod delete;
mod post;

use axum::Router;
use axum::routing::{delete, get, patch, post};
use axum_login::permission_required;
use common::entities::UserRole;
use crate::app::auth::AuthGate;

pub fn router() -> Router {
    Router::new()
        .route("/", post(post::product))
        .route("/:cart_product_id", delete(delete::product)
            .patch(patch::product)
        )
        .route("/:cart_product_id/reserve", patch(patch::reserve_product))
        .route_layer(permission_required!(AuthGate, UserRole::Customer, UserRole::Verified))
        .route("/", get(get::products))
}