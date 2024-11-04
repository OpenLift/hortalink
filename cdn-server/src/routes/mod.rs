use axum::Router;

mod avatars;
mod products;
mod resources;

pub fn router() -> Router {
    Router::new()
        .nest("/avatars", avatars::router())
        .nest("/products", products::router())
        .nest("/resources", resources::router())
}