CREATE TABLE IF NOT EXISTS "sellers"
(
    user_id         INT REFERENCES "users" (id),
    bio             VARCHAR(256),
    followers       INT DEFAULT 0,
    orders_received INT DEFAULT 0,
    PRIMARY KEY (user_id)
);