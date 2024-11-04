use axum::{Extension, Json};
use axum::extract::Query;
use axum_garde::WithValidation;
use sqlx::QueryBuilder;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::products::{FilterProducts, ProductDistanceQuery};
use crate::models::products::{ProductDistance, SellerProductPreview};

pub async fn filter_products(
    Extension(state): Extension<AppState>,
    WithValidation(query): WithValidation<Query<FilterProducts>>,
) -> Result<Json<Vec<SellerProductPreview>>, ApiError> {
    let query = query.into_inner();

    let mut sql_query = QueryBuilder::new(
        r#"
            SELECT DISTINCT ON (s.id) s.id, p.id AS product_id, p.name,
               s.photos[1] AS photo, s.price, s.unit, s.unit_quantity,
               COALESCE(CAST(s.rating_sum AS FLOAT) / CAST(NULLIF(s.rating_quantity, 0) AS FLOAT), NULL) AS rating,
               s.rating_quantity, s.seller_id
        "#
    );

    if let (Some(_), Some(_)) = (query.latitude, query.longitude) {
        sql_query.push(" FROM places pl ")
            .push(" JOIN schedules sc ON sc.place = pl.id JOIN products_schedules ps ON ps.schedule_id = sc.id JOIN seller_products s ON s.id = ps.seller_product_id");
    } else {
        sql_query.push(" FROM seller_products s ")
            .push(" JOIN products_schedules ps ON ps.seller_product_id = s.id JOIN schedules sc ON sc.id = ps.schedule_id ");
    }
    
    sql_query.push(" JOIN products p ON s.product_id = p.id ");

    if let Some(day_of_week) = query.day_of_week {
        sql_query.push(" AND sc.day_of_week = ")
            .push_bind(day_of_week as i16);
    }

    sql_query.push(" WHERE 1 = 1 ");

    if let Some(product_id) = query.product_id {
        sql_query.push(" AND p.id = ")
            .push_bind(product_id);
    }

    if let Some(max_price) = query.max_price {
        sql_query.push(" AND s.price < ")
            .push_bind(max_price);
    }

    if let Some(min_price) = query.min_price {
        sql_query.push(" AND s.price > ")
            .push_bind(min_price);
    }

    if let Some(min_stars) = query.min_stars {
        sql_query.push(" AND COALESCE(CAST(s.rating_sum AS FLOAT) / CAST(NULLIF(s.rating_quantity, 0) AS FLOAT), NULL) >= ")
            .push_bind(min_stars as i16);
    }

    if let Some(product_type) = query.product_type {
        sql_query.push(" AND p.category = ")
            .push_bind(product_type);
    }

    if let Some(start_time) = query.start_time {
        sql_query.push(" AND sc.start_time > ")
            .push_bind(start_time);
    }

    if let (Some(latitude), Some(longitude), Some(distance)) = (query.latitude, query.longitude, query.distance) {
        sql_query.push(" AND ST_DWithin(pl.geolocation::geography, ST_SetSRID(ST_MakePoint(")
            .push_bind(longitude)
            .push(", ")
            .push_bind(latitude)
            .push(")::geography, 4674), ")
            .push_bind(distance * 1000.0)
            .push(" ) ");
    }

    sql_query.push(" ORDER BY s.id LIMIT ")
        .push_bind(query.per_page)
        .push(" OFFSET ")
        .push_bind((query.page - 1) * query.per_page);

    let products = sql_query.build_query_as::<SellerProductPreview>()
        .fetch_all(&state.pool)
        .await?;

    Ok(Json(products))
}

pub async fn distance(
    Extension(state): Extension<AppState>,
    WithValidation(query): WithValidation<Query<ProductDistanceQuery>>,
) -> Result<Json<Vec<ProductDistance>>, ApiError> {
    let query = query.into_inner();
    let products = sqlx::query_as::<_, ProductDistance>(
        r#"
            SELECT DISTINCT ON (sp.id) sp.id, ST_DistanceSphere(pl.geolocation, ST_SetSRID(ST_MakePoint($1, $2),4674)) AS dist
            FROM seller_products sp
            JOIN products_schedules ps ON ps.seller_product_id = sp.id
            JOIN schedules sc ON sc.id = ps.schedule_id
            JOIN places pl ON pl.id = sc.id
            WHERE sp.id = ANY($3)
            ORDER BY sp.id, dist ASC
        "#
    )
        .bind(query.longitude)
        .bind(query.latitude)
        .bind(query.products_id)
        .fetch_all(&state.pool)
        .await?;

    Ok(Json(products))
}
