use axum::Router;
use axum::routing::get;

pub mod get;

pub fn router() -> Router {
    Router::new()
        .route("/", get(get::viewed_recently))
}