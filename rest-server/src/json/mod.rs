use std::fmt::format;
use std::str::FromStr;
use locale::Numeric;
use rust_decimal::prelude::ToPrimitive;

use serde::{Deserialize, Deserializer, Serializer};
use serde::ser::Error;
use sqlx::types::chrono::NaiveDateTime;
use sqlx::types::Decimal;
use sqlx::types::time::Time;

use common::entities::UnitMass;

pub mod auth;
pub mod error;
pub mod users;
pub mod notifications;
pub mod schedules;
pub mod sellers;
pub mod ratings;
pub mod products;
pub mod utils;
pub mod cart;
pub mod home;
pub mod chats;

pub fn serialize_timestamp<S>(naive_datetime: &NaiveDateTime, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    let timestamp = naive_datetime.and_utc().timestamp();
    serializer.serialize_i64(timestamp)
}

pub fn serialize_time<S>(time: &Time, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    serializer.serialize_str(&format!("{:02}:{:02}", time.hour(), time.minute()))
}

pub fn validate_price(value: &Option<Decimal>, _: &()) -> garde::Result {
    if let Some(value) = value {
        if !(value > &Decimal::ZERO) {
            return Err(garde::Error::new("O preço precisa ser maior que 0"));
        }
    }

    Ok(())
}

pub fn serialize_unit<S>(unit: &i16, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    let unit = match UnitMass::try_from(*unit) {
        Ok(unit) => unit,
        Err(_) => {
            return Err(S::Error::custom("Falha ao identificar unidade de medida"));
        }
    };

    serializer.serialize_str(&unit.to_string())
}

pub fn serialize_price<S>(num: &Decimal, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
{
    serializer.serialize_str(&format_num(num.to_usize().unwrap()))
}

pub fn serialize_rating<S>(num: &Option<f64>, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
{
    if let Some(num) = num {
        serializer.serialize_str(&format!("{num:.1}").replace(".", ","))
    } else {
        serializer.serialize_none()
    }
}

pub fn deserialize_array<'de, D, T>(deserializer: D) -> Result<Vec<T>, D::Error>
where
    D: Deserializer<'de>,
    T: Deserialize<'de> + FromStr,
{
    let s = String::deserialize(deserializer)?;
    let v = s.replace('[', " ").replace(']', " ")
        .trim()
        .split(",")
        .map(|value| {
            value.parse::<T>().ok().unwrap()
        })
        .collect();

    Ok(v)
}

fn format_num(num: usize) -> String {
    let binding = num.to_string();
    let parts = binding.split(".").collect::<Vec<&str>>();

    let formated_integer = parts[0]
        .as_bytes()
        .rchunks(3)
        .rev()
        .map(std::str::from_utf8)
        .collect::<Result<Vec<&str>, _>>()
        .unwrap()
        .join(".");

    if parts.len() > 1 {
        format!("{formated_integer},{}", parts[1])
    } else {
        format!("{formated_integer},00")
    }
}