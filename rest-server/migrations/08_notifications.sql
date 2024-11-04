CREATE TABLE IF NOT EXISTS "notifications"
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    INT REFERENCES "users" (id),
    title      VARCHAR(64) NOT NULL,
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read"     BOOLEAN     NOT NULL DEFAULT FALSE,
    type       SMALLINT    NOT NULL,
    content    JSONB
);

CREATE INDEX user_notification ON "notifications" (user_id);

CREATE OR REPLACE FUNCTION log_notification() RETURNS TRIGGER AS
$$
BEGIN
    PERFORM pg_notify('notification_insert', row_to_json(NEW)::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notification_insert_trigger
    AFTER INSERT
    ON "notifications"
    FOR EACH ROW
EXECUTE FUNCTION log_notification();