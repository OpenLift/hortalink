use garde::Validate;
use serde::Deserialize;

#[derive(Deserialize, Validate)]
pub struct CreateChat {
    #[garde(range(min = 1))]
    pub user_id: i32,
}

#[derive(Deserialize, Validate)]
pub struct PatchMessage {
    #[garde(length(min = 1, max = 2048))]
    pub content: String,
}