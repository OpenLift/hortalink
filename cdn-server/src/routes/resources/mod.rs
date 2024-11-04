use axum::Router;

mod products;

pub fn router() -> Router {
    Router::new()
        .nest("/products", products::router())
}