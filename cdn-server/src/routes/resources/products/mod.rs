use axum::Router;
use axum::routing::get;

mod get;

pub fn router() -> Router {
    Router::new()
        .route("/:image", get(get::product))
}