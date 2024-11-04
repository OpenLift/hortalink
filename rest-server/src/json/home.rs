use serde::Serialize;
use crate::models::products::SellerProductPreview;
use crate::models::users::PreviewUser;

#[derive(Serialize)]
pub struct Home {
    pub role: i16,
    pub recents: Option<Vec<SellerProductPreview>>,
    pub more_orders: Option<Vec<SellerProductPreview>>,
    pub recommendations: Option<Vec<PreviewUser>>
}