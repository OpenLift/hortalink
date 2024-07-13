use axum::{Extension, Json};
use axum::extract::Query;
use axum_garde::WithValidation;

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::json::home::Home;
use crate::json::utils::{HomePage, Location};

pub async fn home(
    Extension(state): Extension<AppState>,
    auth_session: AuthSession,
    WithValidation(query): WithValidation<Query<Location>>,
) -> Result<Json<Home>, ApiError> {
    let user = auth_session.user.as_ref().unwrap();
    let query = HomePage {
        longitude: query.longitude,
        latitude: query.latitude,
        page: 1,
        per_page: 9
    };

    if user.roles.contains(&3) {
        let recent = super::most_recent::get::fetch(
            user.id,
            query.clone(),
            &state.pool,
        )
            .await?;

        let more_orders = super::more_orders::get::fetch(
            query.clone(),
            &state.pool,
        )
            .await?;

        let recommendations = crate::api::v1::users::get::recommendations(
            &state.pool
        )
            .await?;

        return Ok(Json(Home {
            recents: Some(recent),
            more_orders: Some(more_orders),
            recommendations: Some(recommendations),
        }));
    } else {}

    return Ok(Json(Home {
        recents: None,
        more_orders: None,
        recommendations: None,
    }));
}