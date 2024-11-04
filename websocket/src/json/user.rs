use std::collections::HashMap;

use serde::Deserialize;
use sqlx::types::time::OffsetDateTime;

#[derive(Deserialize)]
pub struct Id(pub i128);

#[derive(Deserialize)]
pub struct Record {
    pub id: Id,
    pub data: HashMap<String, serde_json::Value>,
    pub expiry_date: OffsetDateTime,
}