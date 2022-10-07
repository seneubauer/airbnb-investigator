-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "airports" (
    "iata" varchar(4)   NOT NULL,
    "airport_name" varchar(255)   NULL,
    "city" varchar(255)   NULL,
    "state" varchar(2)   NULL,
    "latitude" decimal   NOT NULL,
    "longitude" decimal   NOT NULL,
    CONSTRAINT "pk_airports" PRIMARY KEY (
        "iata"
     )
);

CREATE TABLE "airbnbs" (
    "id" integer   NOT NULL,
    "airbnb_name" varchar(255)   NULL,
    "host_id" integer   NULL,
    "latitude" decimal   NULL,
    "longitude" decimal   NULL,
    "room_id" integer   NULL,
    "price" decimal   NULL,
    "minimum_nights" int   NULL,
    "number_of_reviews" int   NULL,
    "last_review" date   NULL,
    "reviews_per_month" decimal   NULL,
    "availability_365" integer  NULL,
    "city" varchar(255)   NULL,
    CONSTRAINT "pk_airbnbs" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "hosts" (
    "host_id" integer   NULL,
    "host_name" varchar(255)   NULL,
    "calculated_host_listings_count" integer NULL,
    CONSTRAINT "pk_hosts" PRIMARY KEY (
        "host_id"
     )
);

CREATE TABLE "room_types" (
    "room_id" serial   NOT NULL,
    "room_type" varchar(255)   NULL,
    CONSTRAINT "pk_room_types" PRIMARY KEY (
        "room_id"
     )
);

ALTER TABLE "airbnbs" ADD CONSTRAINT "fk_airbnbs_host_id" FOREIGN KEY("host_id")
REFERENCES "hosts" ("host_id");

ALTER TABLE "airbnbs" ADD CONSTRAINT "fk_airbnbs_room_id" FOREIGN KEY("room_id")
REFERENCES "room_types" ("room_id");

CREATE TABLE "stg_airbnbs" (
    "id" integer   NOT NULL,
    "name" varchar(255)   NULL,
    "host_id" integer   NULL,
	"host_name" varchar(255) NULL,
	"neighbourhood_group" varchar(255) NULL,
	"neighbourhood" varchar(255) NULL,
    "latitude" decimal   NULL,
    "longitude" decimal   NULL,
    "room_type" varchar(50)   NULL,
    "price" decimal   NULL,
    "minimum_nights" int   NULL,
    "number_of_reviews" int   NULL,
    "last_review" date   NULL,
    "reviews_per_month" decimal   NULL,
	"calculated_host_listings_count" int null,
    "availability_365" integer  NULL,
    "city" varchar(255)   NULL
    )

CREATE TABLE "stg_airports" (
    "iata" varchar(4)   NOT NULL,
    "airport" varchar(255)   NULL,
    "city" varchar(255)   NULL,
    "state" varchar(4)   NULL,
    "latitude" decimal   NOT NULL,
    "longitude" decimal   NOT NULL

     );

DROP TABLE IF EXISTS stg_airports;
