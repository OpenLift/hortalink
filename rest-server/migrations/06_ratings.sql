CREATE TABLE IF NOT EXISTS "seller_product_ratings"
(
    id                BIGSERIAL PRIMARY KEY,
    seller_product_id BIGINT REFERENCES "seller_products" (id),
    author_id         INT REFERENCES "customers" (user_id),
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    was_edited        BOOLEAN      NOT NULL DEFAULT FALSE,
    rating            SMALLINT     NOT NULL,
    content           VARCHAR(256) NOT NULL,
    UNIQUE (seller_product_id, author_id)
);

CREATE INDEX seller_product_rating ON "seller_product_ratings" (seller_product_id, rating);

CREATE OR REPLACE FUNCTION update_rating_sum_and_quantity()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE "seller_products"
    SET rating_sum = GREATEST(rating_sum, 0) + NEW.rating,
        rating_quantity = GREATEST(rating_quantity, 0) + 1
    WHERE id = NEW.seller_product_id;

    RETURN NEW;
END;

$$ LANGUAGE plpgsql;
CREATE TRIGGER after_insert_seller_product_ratings
    AFTER INSERT ON "seller_product_ratings"
    FOR EACH ROW EXECUTE PROCEDURE update_rating_sum_and_quantity();

CREATE OR REPLACE FUNCTION update_rating_sum_and_quantity_on_delete()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE "seller_products"
    SET rating_sum = rating_sum - OLD.rating,
        rating_quantity = CASE WHEN rating_quantity > 0 THEN rating_quantity - 1 ELSE 0 END
    WHERE id = OLD.seller_product_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_delete_seller_product_ratings
    AFTER DELETE ON "seller_product_ratings"
    FOR EACH ROW EXECUTE PROCEDURE update_rating_sum_and_quantity_on_delete();