use std::fmt::Formatter;
use num_enum::{IntoPrimitive, TryFromPrimitive};
use serde_repr::{Deserialize_repr, Serialize_repr};

#[derive(TryFromPrimitive, IntoPrimitive, Deserialize_repr, Serialize_repr)]
#[repr(i16)]
pub enum StarRating {
    VeryBad = 1,
    Bad = 2,
    Medium = 3,
    Good = 4,
    VeryGood = 5,
}

#[derive(TryFromPrimitive, IntoPrimitive, Deserialize_repr, Serialize_repr, Eq, PartialEq)]
#[derive(Clone, Debug)]
#[repr(i16)]
pub enum UserRole {
    Verified = 1,
    Viewer = 2,
    Customer = 3,
    Seller = 4,
    Administrator = 5,
}

#[derive(TryFromPrimitive, Deserialize_repr, Serialize_repr, Clone)]
#[repr(i16)]
pub enum NotificationType {
    Info = 1,
    Success = 2,
    Error = 3,
}

#[derive(TryFromPrimitive, IntoPrimitive, Deserialize_repr, Serialize_repr)]
#[repr(i16)]
pub enum WeekDay {
    Monday = 0,
    Tuesday = 1,
    Wednesday = 2,
    Thursday = 3,
    Friday = 4,
    Saturday = 5,
    Sunday = 6
}

#[derive(IntoPrimitive, Deserialize_repr, Serialize_repr)]
#[repr(i16)]
pub enum ImageSize {
    Size16 = 16,
    Size32 = 32,
    Size64 = 64,
    Size128 = 128,
    Size256 = 256,
    Size512 = 512,
    Size1024 = 1024,
    Size2048 = 2048,
    Size4096 = 4096,
}

#[derive(TryFromPrimitive, Deserialize_repr, Serialize_repr, Debug)]
#[repr(i16)]
pub enum UnitMass {
    Kg = 0,
    Hg = 1,
    Dag = 2,
    G = 3,
    Cg = 4,
    Mg = 5,
    U = 6
}

#[derive(TryFromPrimitive, Deserialize_repr, Serialize_repr, Debug)]
#[repr(i16)]
pub enum CartStatus {
    Pending = 1,
    Confirmed = 2,
    Cancelled = 3,
    Delivered = 4,
    Abandoned = 5
}

#[derive(Debug, Default, Clone)]
pub enum Environment {
    #[default]
    Production,
    Stage,
    Development,
}

impl std::str::FromStr for Environment {
    type Err = std::io::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "PRODUCTION" => Ok(Self::Production),
            "STAGE" => Ok(Self::Stage),
            "DEVELOPMENT" => Ok(Self::Development),
            _ => Err(Self::Err::new(
                std::io::ErrorKind::NotFound,
                "environment not recognized",
            )),
        }
    }
}

impl ImageSize {
    pub fn dimensions(self) -> (i16, i16) {
        let size = self.into();
        (size, size)
    }
}

impl std::fmt::Display for UnitMass {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        let string = format!("{:?}", self)
            .to_lowercase();
        
        write!(f, "{string}")
    }
}