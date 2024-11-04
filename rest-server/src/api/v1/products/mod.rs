mod get;

use axum::Router;
use axum::routing::get;

pub fn router() -> Router {
    Router::new()
        .route("/", get(get::filter_products))
        .route("/dist", get(get::distance))
}