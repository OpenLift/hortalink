use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::schedules::ScheduleQuery;
use crate::models::schedules::Schedule;
use axum::extract::{Path, Query};
use axum::{Extension, Json};
use sqlx::QueryBuilder;

pub async fn schedules(
    Extension(state): Extension<AppState>,
    Path(seller_id): Path<i32>,
    Query(query): Query<ScheduleQuery>,
) -> Result<Json<Vec<Schedule>>, ApiError> {
    let mut sql_builder = QueryBuilder::new(
        r#"
        SELECT sc.id, pl.address, sc.start_time, sc.end_time, sc.day_of_week
        FROM schedules sc
        JOIN places pl ON pl.id = sc.place
        WHERE sc.seller_id = $1
        "#
    );

    if let Some(day_of_week) = query.day_of_week {
        sql_builder.push("AND sc.day_of_week = ")
            .push_bind(day_of_week as i16);
    }

    let schedules: Vec<Schedule> = sql_builder.build_query_as()
        .bind(seller_id)
        .fetch_all(&state.pool)
        .await?;

    Ok(Json(schedules))
}