use axum::Router;
use axum::routing::get;

mod get;
mod post;
mod messages;
mod patch;

pub fn router() -> Router {
    Router::new()
        .nest("/:chat_id/messages", messages::router())
        .route("/", get(get::chats)
            .post(post::chat)
            .patch(patch::chat),
        )
}