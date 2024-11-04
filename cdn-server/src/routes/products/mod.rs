use axum::Router;
use axum::routing::get;

mod get;

pub fn router() -> Router {
    Router::new()
        .route("/:product_id/:hash", get(get::product_photo))
}