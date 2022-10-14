-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/

-- DROP DATABASE IF EXISTS "AirBnB";

-- CREATE DATABASE "AirBnB"
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'C'
--     LC_CTYPE = 'C'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1
--     IS_TEMPLATE = False;

CREATE TABLE "airports" (
    "iata" varchar(4)   NOT NULL,
    "airport_name" varchar(255)   NULL,
    "city" varchar(255)   NULL,
    "state" varchar(4)   NULL,
    "latitude" float   NOT NULL,
    "longitude" float   NOT NULL,
    CONSTRAINT "pk_airports" PRIMARY KEY (
        "iata"
     )
);

CREATE TABLE airbnbs (airbnb_pk serial not null,
	airbnb_id int4 NOT NULL,
	airbnb_name varchar(255) NULL,
	host_id int4 NULL,
	latitude float NULL,
	longitude float NULL,
	room_id int4 NULL,
	price float NULL,
	minimum_nights int4 NULL,
	number_of_reviews int4 NULL,
	reviews_per_month float NULL,
	availability_365 int4 NULL,
	city varchar(255) NULL,
	CONSTRAINT pk_airbnbs PRIMARY KEY (airbnb_pk)
);
-- airbnbs foreign key(s)

CREATE TABLE "hosts" (
    "host_id" integer   not null,
    "airbnb_id" integer not null,
    "host_name" varchar(255)   null,
    CONSTRAINT "pk_hosts" PRIMARY KEY ("host_id", "airbnb_id"
     )
);

CREATE TABLE "room_types" (
    "room_id" serial   NOT NULL,
    "room_type" varchar(255)   NULL,
    CONSTRAINT "pk_room_types" PRIMARY KEY (
        "room_id"
     )
);

ALTER TABLE airbnbs
ADD CONSTRAINT fk_airbnbs_room_id FOREIGN KEY (room_id) REFERENCES room_types(room_id);

CREATE TABLE us_cities (
	city_pk serial NOT NULL,
	city_name varchar(255) NOT NULL,
	state varchar(4) NOT NULL,
	latitude float NOT NULL,
	longitude float NOT NULL,
	CONSTRAINT "pk_us_cities" PRIMARY KEY ("city_pk")
);

CREATE TABLE "stg_airbnbs" (
    "id" integer   NOT NULL,
    "name" varchar(255)   NULL,
    "host_id" integer   NULL,
	"host_name" varchar(255) NULL,
	"neighbourhood_group" varchar(255) NULL,
	"neighbourhood" varchar(255) NULL,
    "latitude" float   NULL,
    "longitude" float   NULL,
    "room_type" varchar(50)   NULL,
    "price" float   NULL,
    "minimum_nights" int   NULL,
    "number_of_reviews" int   NULL,
    "last_review" varchar(10)   NULL,
    "reviews_per_month" float   NULL,
	"calculated_host_listings_count" int null,
    "availability_365" integer  NULL,
    "city" varchar(255)   NULL
);
    
CREATE TABLE "stg_airports" (
    "iata" varchar(4)   NOT NULL,
    "airport" varchar(255)   NULL,
    "city" varchar(255)   NULL,
    "state" varchar(4)   NULL,
    "latitude" float   NOT NULL,
    "longitude" float   NOT NULL
);