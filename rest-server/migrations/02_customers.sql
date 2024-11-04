CREATE TABLE IF NOT EXISTS "customers"
(
    user_id     INT REFERENCES "users" (id),
    orders_made INT DEFAULT 0,
    following   INT DEFAULT 0,
    PRIMARY KEY (user_id)
);