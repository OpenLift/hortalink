mod get;
mod delete;

use axum::Router;
use axum::routing::{delete, get};
use axum_login::permission_required;
use common::entities::UserRole;
use crate::app::auth::AuthGate;

pub fn router() -> Router {
    Router::new()
        .route("/", get(get::orders))
        .route("/:order_id", delete(delete::order).get(get::order))
        .layer(permission_required!(AuthGate, UserRole::Seller))
}