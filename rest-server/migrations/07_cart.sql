CREATE TABLE IF NOT EXISTS "cart"
(
    id                BIGSERIAL PRIMARY KEY,
    seller_product_id BIGINT REFERENCES "seller_products" (id),
    customer_id       INT REFERENCES "customers" (user_id),
    status            SMALLINT  NOT NULL DEFAULT 1,
    withdrawn         BIGINT REFERENCES "schedules" (id),
    amount            INT       NOT NULL,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (seller_product_id, customer_id)
);

CREATE INDEX customer_cart ON "cart" (customer_id);