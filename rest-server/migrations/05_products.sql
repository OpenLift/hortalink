CREATE TABLE IF NOT EXISTS "products_categories"
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS "products"
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(32) NOT NULL,
    alias    VARCHAR(256)[],
    category INT REFERENCES "products_categories" (id)
);

CREATE TABLE IF NOT EXISTS "seller_products"
(
    id              BIGSERIAL PRIMARY KEY,
    product_id      INT REFERENCES "products" (id),
    seller_id       INT REFERENCES "sellers" (user_id),
    price           NUMERIC(7, 2)  NOT NULL,
    unit            SMALLINT       NOT NULL,
    unit_quantity   REAL,
    quantity        SMALLINT       NOT NULL,
    photos          VARCHAR(256)[] NOT NULL,
    description     TEXT,
    rating_sum      INT DEFAULT NULL,
    rating_quantity INT DEFAULT NULL
);

CREATE INDEX seller_product_id ON "seller_products" (seller_id);
CREATE INDEX seller_product_price ON "seller_products" (price);

CREATE TABLE IF NOT EXISTS "products_schedules"
(
    id                BIGSERIAL PRIMARY KEY,
    seller_product_id BIGINT REFERENCES "seller_products" (id),
    schedule_id       BIGINT REFERENCES "schedules" (id),
    UNIQUE (seller_product_id, schedule_id)
);

CREATE INDEX seller_schedule_product_id ON "products_schedules" (seller_product_id);

CREATE TABLE IF NOT EXISTS "products_seen_recently"
(
    id                BIGSERIAL PRIMARY KEY,
    seller_product_id BIGINT REFERENCES "seller_products" (id),
    customer          INT REFERENCES "customers" (user_id),
    viewed_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_product_customer UNIQUE (seller_product_id, customer)
);

CREATE INDEX customer_product_seen ON "products_seen_recently" (customer);