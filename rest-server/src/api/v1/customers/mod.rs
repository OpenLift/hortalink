pub mod ratings;
pub mod orders;

use axum::Router;


pub fn router() -> Router {
    Router::new()
        .nest("/:customer_id/ratings", ratings::router())
        .nest("/:customer_id/orders", orders::router())
}