use axum::Router;

mod schedules;
pub mod products;
pub mod ratings;

pub fn router() -> Router {
    Router::new()
        .nest("/:seller_id/schedules", schedules::router())
        .nest("/:seller_id/products", products::router())
        .nest("/:seller_id/ratings", ratings::router())
}
