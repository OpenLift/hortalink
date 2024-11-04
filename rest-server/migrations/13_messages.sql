CREATE TABLE IF NOT EXISTS "messages"
(
    id         BIGSERIAL PRIMARY KEY,
    author_id  INT REFERENCES "users" (id),
    content    TEXT      NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited     BOOLEAN            DEFAULT FALSE,
    chat       BIGINT REFERENCES "chats" (id)
);

CREATE INDEX chating ON "messages" (chat);

CREATE OR REPLACE FUNCTION notify_message_insert() RETURNS TRIGGER AS
$$
BEGIN
    PERFORM pg_notify('message_insert', row_to_json(NEW)::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_message_update() RETURNS TRIGGER AS
$$
BEGIN
    NEW.edited := true;

    PERFORM pg_notify('message_update',
                      json_build_object('id', OLD.id, 'content', NEW.content, 'chat', OLD.chat, 'author_id',
                                        OLD.author_id)::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_message_delete() RETURNS TRIGGER AS
$$
BEGIN
    PERFORM pg_notify('message_delete', json_build_object('id', OLD.id, 'chat', OLD.chat, 'author_id', OLD.author_id)::text);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER message_insert_trigger
    AFTER INSERT
    ON "messages"
    FOR EACH ROW
EXECUTE FUNCTION notify_message_insert();

CREATE TRIGGER message_update_trigger
    BEFORE UPDATE
    ON "messages"
    FOR EACH ROW
EXECUTE FUNCTION notify_message_update();

CREATE TRIGGER message_delete_trigger
    AFTER DELETE
    ON "messages"
    FOR EACH ROW
EXECUTE FUNCTION notify_message_delete();