use serde::Serialize;
use sqlx::{Pool, Postgres};
use sqlx::types::chrono::NaiveDateTime;

use crate::json::error::ApiError;
use crate::json::serialize_timestamp;
use crate::models::products::SellerProductMinimal;
use crate::models::users::PreviewUser;

#[derive(Serialize, sqlx::FromRow)]
pub struct ProductRatingInfo {
    id: i64,
    #[serde(serialize_with = "serialize_timestamp")]
    created_at: NaiveDateTime,
    was_edited: bool,
    rating: i16,
    content: String,
    #[sqlx(flatten)]
    user: PreviewUser,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct CustomerRating {
    id: i64,
    #[serde(serialize_with = "serialize_timestamp")]
    created_at: NaiveDateTime,
    was_edited: bool,
    rating: i16,
    content: String,
    #[sqlx(flatten)]
    product: SellerProductMinimal,
}

impl ProductRatingInfo {
    pub async fn get_author(
        pool: &Pool<Postgres>,
        rating_id: i32,
    ) -> Result<i32, ApiError> {
        let user_id = sqlx::query_scalar::<_, i32>(
            r#"
                SELECT author_id FROM seller_product_ratings
                WHERE id = $1
            "#
        )
            .bind(rating_id)
            .fetch_optional(pool)
            .await?;

        if user_id.is_none() {
            return Err(ApiError::NotFound("Produto não encontrada".to_string()));
        }

        Ok(user_id.unwrap())
    }
}