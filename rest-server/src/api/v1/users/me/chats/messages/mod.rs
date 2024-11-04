use axum::Router;
use axum::routing::{delete, post};

mod patch;
mod post;
mod delete;
mod get;

pub fn router() -> Router {
    Router::new()
        .route("/", post(post::message)
            .get(get::messages)
        )
        .route("/:message_id", delete(delete::message)
            .patch(patch::message),
        )
}