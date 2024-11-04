use crate::server::Application;

pub mod http;
pub mod server;
pub mod json;
mod events;
mod commands;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init();

    let server = Application::new()
        .await;

    server.run()
        .await
}