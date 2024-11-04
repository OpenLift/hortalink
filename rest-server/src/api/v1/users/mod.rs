mod me;
mod get;

use axum::Router;
use axum::routing::get;

pub fn router() -> Router {
    Router::new()
        .nest("/@me", me::router())
        .route("/", get(get::users))
        .route("/:id", get(get::user))
}