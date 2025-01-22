use crate::json::error::ApiError;
use crate::json::serialize_unit;
use crate::json::serialize_price;
use crate::models::products::SellerProductMinimal;
use common::entities::CartStatus;
use serde::{Deserialize, Serialize};
use sqlx::types::{Decimal};
use sqlx::{Pool, Postgres};

#[derive(sqlx::FromRow, Serialize)]
pub struct Order {
    #[sqlx(flatten)]
    user: UserPreview,
    products: sqlx::types::JsonValue,
}

#[derive(sqlx::FromRow, Serialize)]
pub struct OrderPreview {
    #[sqlx(rename = "order_id")]
    id: i64,
    amount: i32,
    #[sqlx(flatten)]
    product: SellerProductMinimal,
    #[sqlx(try_from = "i16")]
    status: CartStatus,
}

#[derive(sqlx::FromRow, Serialize)]
struct UserPreview {
    #[sqlx(rename = "user_id")]
    id: i32,
    name: String,
    avatar: Option<String>,
}

#[derive(sqlx::FromRow, Serialize, Deserialize)]
struct ProductPreview {
    order_id: i64,
    withdrawn: sqlx::types::Json<ProductWithdrawn>,
    amount: i32,
    product_id: i64,
    product_name: String,
    #[serde(serialize_with = "serialize_price")]
    price: Decimal,
    photo: String,
    #[serde(serialize_with = "serialize_unit")]
    unit: i16,
}

#[derive(sqlx::FromRow, Serialize, Deserialize)]
struct ProductWithdrawn {
    id: i64,
    start_time: i64,
    end_time: i64,
    day_of_week: i16,
    address: String,
}

impl Order {
    pub async fn get_seller(pool: &Pool<Postgres>, order_id: i32) -> Result<i32, ApiError> {
        let seller_id = sqlx::query_scalar::<_, i32>(
            r#"
                SELECT sp.seller_id
                FROM cart c
                JOIN "seller_products" sp ON sp.id = c.seller_product_id
                WHERE c.id = $1
            "#
        )
            .bind(order_id)
            .fetch_optional(pool)
            .await?;

        if seller_id.is_none() {
            return Err(ApiError::NotFound("Produto não encontrada".to_string()));
        }

        Ok(seller_id.unwrap())
    }

    pub async fn get_customer(pool: &Pool<Postgres>, order_id: i32) -> Result<i32, ApiError> {
        sqlx::query_scalar::<_, i32>(
            r#"
                SELECT customer_id
                FROM cart
                WHERE id = $1
            "#
        )
            .bind(order_id)
            .fetch_optional(pool)
            .await?
            .ok_or(ApiError::NotFound("Produto não encontrada".to_string()))
    }
}