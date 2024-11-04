use serde::Serialize;
use sqlx::{Pool, Postgres};

use crate::json::error::ApiError;

#[derive(sqlx::FromRow, Serialize)]
pub struct SellerUser {
    pub bio: Option<String>,
}

#[derive(sqlx::FromRow, Serialize)]
pub struct PublicSeller {
    pub name: String,
    pub id: i32,
    pub bio: Option<String>,
    pub avatar: Option<String>,
}

#[derive(sqlx::FromRow, Serialize)]
pub struct PublicProfile {
    pub name: String,
    pub id: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bio: Option<String>,
    pub avatar: Option<String>,
    pub is_seller: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub followers: Option<i32>,
    pub roles: Vec<i16>,
    #[serde(skip_serializing_if = "Option::is_none")]
    following: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    orders_made: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    orders_received: Option<i32>,
}

impl PublicProfile {
    pub async fn fetch(user_id: i32, pool: &Pool<Postgres>) -> Result<Self, ApiError> {
        sqlx::query_as::<_, PublicProfile>(
            r#"
            SELECT
                u.id, u.name, u.avatar, 4 = ANY(u.roles) as is_seller,
                s.bio, s.followers, c.following, c.orders_made, s.orders_received,
                u.roles
            FROM users u
            LEFT JOIN sellers s ON u.id = s.user_id
            LEFT JOIN customers c ON u.id = c.user_id
            WHERE u.id = $1
        "#
        )
            .bind(user_id)
            .fetch_optional(pool)
            .await?
            .ok_or(ApiError::NotFound("Usuário não encontrado".to_string()))
    }
}