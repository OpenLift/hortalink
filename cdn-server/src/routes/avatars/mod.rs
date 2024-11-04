use axum::Router;
use axum::routing::get;

mod get;

pub fn router() -> Router {
    Router::new()
        .route("/:user_id/:hash", get(get::user_avatar))
}