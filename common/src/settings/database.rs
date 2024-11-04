use std::env::var;

#[derive(Clone)]
pub struct DatabaseSettings {
    pub username: String,
    pub database: String,
    pub password: String,
    pub host: String,
    pub port: u16,
}

impl DatabaseSettings {
    pub fn new() -> Self {
        Self {
            username: var("DB_USERNAME")
                .unwrap(),
            database: var("DB_NAME")
                .unwrap(),
            password: var("DB_PASSWORD")
                .unwrap(),
            host: var("DB_HOST")
                .unwrap(),
            port: var("DB_PORT")
                .unwrap()
                .parse().unwrap(),
        }
    }

    pub fn url(&self) -> String {
        format!(
            "postgresql://{}:{}@{}:{}/{}",
            self.username, self.password, self.host, self.port, self.database
        )
    }
}