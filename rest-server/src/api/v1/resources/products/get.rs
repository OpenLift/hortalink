use axum::{Extension, Json};
use axum::extract::Query;
use axum_garde::WithValidation;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::products::FilterResources;
use crate::models::products::ResourceProduct;

pub async fn products(
    WithValidation(query): WithValidation<Query<FilterResources>>,
    Extension(state): Extension<AppState>,
) -> Result<Json<Vec<ResourceProduct>>, ApiError> {
    let query = query.into_inner();
    let mut sql_query = r#"
        SELECT p.id AS product_id, p.name AS product_name, p.alias,
            pc.name AS category_name, pc.id AS category_id 
        FROM products p
        JOIN products_categories pc ON p.category = pc.id 
    "#.to_string();

    if let Some(name) = query.query.map(|name| name.to_lowercase()) {
        sql_query.push_str(&format!("WHERE p.name LIKE '{name}%' OR '{name}' = ANY (p.alias) "));
    } else {
        sql_query.push_str("ORDER BY p.name ASC ")
    }

    sql_query.push_str(&format!("LIMIT {} OFFSET {}", query.per_page, (query.page - 1) * query.per_page));

    let sql_query = sqlx::query_as::<_, ResourceProduct>(&sql_query)
        .fetch_all(&state.pool)
        .await?;

    Ok(Json(sql_query))
}