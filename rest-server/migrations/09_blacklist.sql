CREATE TABLE IF NOT EXISTS "blacklist"
(
    user_id  INT REFERENCES "users" (id),
    end_time TIMESTAMP NOT NULL,
    reason   VARCHAR(511),
    PRIMARY KEY (user_id)
);