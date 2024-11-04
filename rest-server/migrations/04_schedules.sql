CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS "places"
(
    id          BIGSERIAL PRIMARY KEY,
    geolocation GEOMETRY(Point, 4674) NOT NULL,
    address     VARCHAR(256)          NOT NULL,
    UNIQUE (geolocation)
);

CREATE INDEX schedule_geolocation ON "places" USING gist (geolocation);

CREATE TABLE IF NOT EXISTS "schedules"
(
    id          BIGSERIAL PRIMARY KEY,
    place       BIGINT REFERENCES "places" (id),
    start_time  TIME WITHOUT TIME ZONE NOT NULL,
    end_time    TIME WITHOUT TIME ZONE NOT NULL,
    day_of_week SMALLINT               NOT NULL,
    seller_id   INT REFERENCES "sellers" (user_id)
);

CREATE INDEX schedule_duration ON "schedules" (day_of_week, start_time, end_time);