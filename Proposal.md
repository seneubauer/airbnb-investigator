# AirBnB Investigator

## Group Info
* Group #1

## Group Members
* Tom Lenzmeier
* Scott Neubauer
* Maryam Osman
* John Torgerson

## Topic
This project will use information from an AirBnB dataset along with API queries to build an interactive website for users to make informed decision on which AirBnB site is suitable for their needs.

## Overview
A map which has a central focus around AirBnB hosts and their data, which uses their latitude and longitude to animate pins as informational metadata boxes. Users will land on a map of the mainland United States where they can select from clustered pins of AirBnB locations. Once an individual AirBnB location is selected, location specific data will populate accompanying charts to display relevant information (weather and local attractions).

## Data Sources
* OpenWeatherMap API
* Google Maps Platform API
* [List of US Airports](https://www.kaggle.com/datasets/aravindram11/list-of-us-airports?select=airports.csv)
    * Size: 22.69 kB
    * Record Count: 341
    * Columns
        * iata
        * airport
        * city
        * state
        * country
        * latitude
        * longitude
* [U.S. AirBnB Open Data](https://www.kaggle.com/datasets/kritikseth/us-airbnb-open-data)
    * Size: 36.08 MB
    * Record Count: 35,534
    * Columns
        * id
        * name
        * host_id
        * host_name
        * neighbourhood_group
        * neighborhood
        * latitude
        * longitude
        * room_type
        * price
        * minimum_nights
        * number_of_reviews
        * last_review
        * reviews_per_month
        * calculated_host_listings_count
        * availability_365
        * city

## Work Breakdown
1. Gather and clean data starting with primary data source.
    1. Trim out unnecessary columns.
1. Design ERD for PostgreSQL database.
1. Build HTML landing page for primary endpoint.
    1. Define page events.
    1. Assign JS logic to page events.
1. Build an HTML 'About' page.
1. Construct Leaflet map.
    1. National map of USA with Clustered Markers for AirBnB locations.
    1. Define and implement the design logic for pins.
1. Construct Plotly graphics.
    1. Link plots with JS to selected markers.
1. Document database recreation instructions for theoretical collegues.

## Plain Overview
![Image_1](/Resources/plain.jpg "Plain")

## Selected Overview
![Image_2](/Resources/selected.jpg "Selected")
