use garde::Validate;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Validate)]
pub struct Pagination {
    #[garde(range(min = 1, max = 100))]
    pub page: i16,
    #[garde(range(min = 5, max = 100))]
    pub per_page: i16
}

#[derive(Serialize, Deserialize, Validate)]
pub struct Location {
    #[garde(range(min = -90.0000000, max= 90.0000000))]
    pub latitude: Option<f64>,
    #[garde(range(min = -180.0000000, max= 180.0000000))]
    pub longitude: Option<f64>,
}

#[derive(Deserialize, Validate, Clone)]
pub struct HomePage {
    #[garde(range(min = 1, max = 100))]
    pub page: i16,
    #[garde(range(min = 5, max = 100))]
    pub per_page: i16
}