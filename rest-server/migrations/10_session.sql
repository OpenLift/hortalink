CREATE SCHEMA IF NOT EXISTS "tower_sessions";

CREATE TABLE IF NOT EXISTS "tower_sessions"."sessions"
(
    id          TEXT PRIMARY KEY NOT NULL,
    data        BYTEA            NOT NULL,
    expiry_date timestamptz      NOT NULL
);