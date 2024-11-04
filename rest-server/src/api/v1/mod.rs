mod users;
mod sellers;
mod customers;
mod auth;
mod products;
mod oauth;
mod resources;

use axum::Router;
use axum_login::{login_required};
use crate::app::auth::AuthGate;


pub fn router() -> Router {
    Router::new()
        .nest("/sellers", sellers::router())
        .nest("/customers", customers::router())
        .nest("/users", users::router())
        .nest("/products", products::router())
        .layer(login_required!(AuthGate))
        .nest("/resources", resources::router())
        .nest("/auth", auth::router())
        .nest("/oauth", oauth::router())
}