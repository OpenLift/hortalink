use axum::Router;
use axum::routing::get;

mod get;
mod most_recent;
mod more_orders;

pub fn router() -> Router {
    Router::new()
        .route("/", get(get::home))
        .nest("/most_recent", most_recent::router())
        .nest("/more_orders", more_orders::router())
}