use axum::{Extension, Json};
use axum::extract::Path;
use axum::http::StatusCode;
use axum_garde::WithValidation;

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::schedules::UpdateSchedulePayload;
use crate::models::schedules::Schedule;

pub async fn schedule(
    Extension(state): Extension<AppState>,
    Path((seller_id, schedule_id)): Path<(i32, i32)>,
    auth_session: AuthSession,
    WithValidation(payload): WithValidation<Json<UpdateSchedulePayload>>,
) -> Result<(), ApiError> {
    let author = Schedule::get_author(&state.pool, schedule_id)
        .await?;
    
    if auth_session.user.unwrap().id != seller_id || seller_id != author {
        return Err(ApiError::Unauthorized("Você não pode fazer isso".to_string()))
    }

    let payload = payload.into_inner();
    
    if let Some(location) = payload.location.as_ref() {
        if location.latitude.is_none() || location.longitude.is_none() {
            return Err(ApiError::Custom(StatusCode::BAD_REQUEST, "Campos inválidos: latitude ou longitude faltando".to_string())); 
        }
    }

    sqlx::query(r#"
        UPDATE schedules
        SET
            geolocation = COALESCE($1::geometry, geolocation),
            address = COALESCE($2, address),
            start_time = COALESCE($3, start_time),
            end_time = COALESCE($4, end_time),
            day_of_week = COALESCE($5, day_of_week)
        WHERE id = $6
    "#)
        .bind(payload.location
            .map(|loc| {
                format!("ST_SetSRID(ST_MakePoint({}, {}),  4674)", loc.latitude.unwrap(), loc.longitude.unwrap())
            }))
        .bind(payload.address)
        .bind(payload.start_time)
        .bind(payload.end_time)
        .bind::<Option<i16>>(payload.day_of_week
            .map(|day| day.into()))
        .bind(schedule_id)
        .execute(&state.pool)
        .await?;

    Ok(())
}