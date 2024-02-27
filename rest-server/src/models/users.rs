use std::fmt::Debug;
use axum_login::AuthUser;
use serde::Serialize;
use sqlx::types::chrono::NaiveDateTime;
use crate::json::serialize_timestamp;

#[derive(sqlx::FromRow, Serialize)]
pub struct ProtectedUser {
    id: i32,
    email: String,
    name: String,
    avatar: Option<String>,
    phone: String,
    username: String
}

#[derive(sqlx::FromRow, Serialize)]
pub struct CustomerUser {
    address: String
}

#[derive(sqlx::FromRow, Serialize)]
pub struct SellerUser {
}

#[derive(sqlx::FromRow, Serialize)]
pub struct ViewerUser {
    #[serde(serialize_with = "serialize_timestamp")]
    end_time: NaiveDateTime,
}

#[derive(sqlx::FromRow, Clone, Debug)]
pub struct LoginUser {
    pub id: i32,
    pub password: Option<String>,
    pub roles: Vec<i16>,
    access_token: Option<String>,
}

impl AuthUser for LoginUser {
    type Id = i32;

    fn id(&self) -> Self::Id {
        self.id.clone()
    }

    fn session_auth_hash(&self) -> &[u8] {
        if let Some(password) = &self.password {
            password.as_bytes()
        } else {
            self.access_token
                .as_ref()
                .unwrap()
                .as_bytes()
        }
    }
}