CREATE TABLE IF NOT EXISTS "followers"
(
    id          BIGSERIAL PRIMARY KEY,
    seller_id   INT REFERENCES "sellers" (user_id),
    customer_id INT REFERENCES "customers" (user_id),
    UNIQUE (seller_id, customer_id)
);

CREATE INDEX customers_id ON "followers" (customer_id);

CREATE OR REPLACE FUNCTION update_followers_count_after_addition()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE "customers"
        SET following = following + 1
    WHERE user_id = NEW.customer_id;

    UPDATE "sellers"
    SET followers = followers + 1
    WHERE user_id = NEW.seller_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_followers_count_after_removal()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE "customers"
    SET following = following + 1
    WHERE user_id = OLD.customer_id;

    UPDATE "sellers"
    SET followers = followers - 1
    WHERE user_id = OLD.seller_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_insert_followers
    AFTER INSERT ON "followers"
    FOR EACH ROW EXECUTE PROCEDURE update_followers_count_after_addition();

CREATE TRIGGER after_delete_followers
    AFTER DELETE ON "followers"
    FOR EACH ROW EXECUTE PROCEDURE update_followers_count_after_removal();