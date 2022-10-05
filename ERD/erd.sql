-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "airports" (
    "iata" varchar(4)   NOT NULL,
    "airport_name" varchar(255)   NOT NULL,
    "city" varchar(255)   NOT NULL,
    "state" varchar(2)   NOT NULL,
    "latitude" decimal   NOT NULL,
    "longitude" decimal   NOT NULL,
    CONSTRAINT "pk_airports" PRIMARY KEY (
        "iata"
     )
);

CREATE TABLE "airbnbs" (
    "id" integer   NOT NULL,
    "airbnb_name" varchar(255)   NOT NULL,
    "host_id" integer   NOT NULL,
    "latitude" decimal   NOT NULL,
    "longitude" decimal   NOT NULL,
    "room_id" integer   NOT NULL,
    "price" decimal   NOT NULL,
    "minimum_nights" int   NOT NULL,
    "number_of_reviews" int   NOT NULL,
    "last_review" date   NOT NULL,
    "reviews_per_month" decimal   NOT NULL,
    "availability_365" integer   NOT NULL,
    "city" varchar(255)   NOT NULL,
    CONSTRAINT "pk_airbnbs" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "hosts" (
    "host_id" integer   NOT NULL,
    "host_name" varchar(255)   NOT NULL,
    "calculated_host_listings_count" integer   NOT NULL,
    CONSTRAINT "pk_hosts" PRIMARY KEY (
        "host_id"
     )
);

CREATE TABLE "room_types" (
    "room_id" serial   NOT NULL,
    "room_type" varchar(255)   NOT NULL,
    CONSTRAINT "pk_room_types" PRIMARY KEY (
        "room_id"
     )
);

ALTER TABLE "airbnbs" ADD CONSTRAINT "fk_airbnbs_host_id" FOREIGN KEY("host_id")
REFERENCES "hosts" ("host_id");

ALTER TABLE "airbnbs" ADD CONSTRAINT "fk_airbnbs_room_id" FOREIGN KEY("room_id")
REFERENCES "room_types" ("room_id");

