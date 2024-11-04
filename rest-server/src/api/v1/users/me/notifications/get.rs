use axum::{Extension, Json};

use crate::app::auth::AuthSession;
use crate::app::server::AppState;
use crate::json::error::ApiError;
use crate::models::notifications::NotificationPreview;

pub async fn notifications(
    Extension(state): Extension<AppState>,
    auth_session: AuthSession,
) -> Result<Json<Vec<NotificationPreview>>, ApiError> {
    let user_id = auth_session.user.unwrap().id;

    let notifications: Vec<NotificationPreview> = sqlx::query_as(
        r#"
            SELECT id, title, created_at,
                read
            FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
        "#,
    )
        .bind(user_id)
        .fetch_all(&state.pool)
        .await?;

    Ok(Json(notifications))
}