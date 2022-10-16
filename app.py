# import dependencies for flask
from flask import Flask, render_template, jsonify

# import dependencies for api calls
import requests

# import dependencies for sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

# import confidential information
from config import username, password, port, dbase, owm_api_key, places_api_key

# build the posgresql connection string
connection_string = f"postgresql://{username}:{password}@localhost:{port}/{dbase}"

# build the sqlalchemy engine
engine = create_engine(connection_string, pool_pre_ping=True)

# reflect the database schema
base = automap_base()
base.prepare(engine, reflect=True)

# instantiate the tables required
airbnb = base.classes.airbnbs
hosts = base.classes.hosts
rooms = base.classes.room_types
airports = base.classes.airports
cities = base.classes.us_cities

# initialize the flask app
app = Flask(__name__)

# disable page caching
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# landing page
@app.route("/")
def IndexRoute():
    webpage = render_template("index.html")
    return webpage

@app.route("/about")
def AboutRoute():
    aboutpage = render_template("about.html")
    return aboutpage

@app.route("/home")
def HomeRoute():
    backHome = render_template("index.html")
    return backHome

# weather api call
@app.route("/weather_forecast/<lat_value>/<lon_value>/<unit_system>/")
def Weather_Forecast_API_Request(lat_value, lon_value, unit_system):
    
    # construct the api url
    weather_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat_value}&lon={lon_value}&appid={owm_api_key}&units={unit_system}&lang=en"
    
    # run the api request
    try:
        return { "status": "ok", "response": requests.get(weather_url).json() }
    except requests.exceptions.RequestException as e:
        return { "status": "not_ok", "response": e.strerror }

# places api call
@app.route("/nearby_search/<lat_value>/<lon_value>/<search_radius>/<search_terms>/")
def Nearby_Places_API_Request(lat_value, lon_value, search_radius, search_terms):
    
    # construct the api url
    places_url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat_value},{lon_value}&radius={search_radius}&type={search_terms}&key={places_api_key}"
    
    # retool api request for when there is no parameter for type
    if search_terms == "None":
        places_url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat_value},{lon_value}&radius={search_radius}&key={places_api_key}"
    
    # run the api request
    try:
        return { "status": "ok", "response": requests.get(places_url).json() }
    except requests.exceptions.RequestException as e:
        return { "status": "not_ok", "response": e.strerror }

# get list of dictionaries from airbnbs table
@app.route("/get_all_airbnbs/")
def AirBnBRoute():
 
    session = Session(engine)
    results = session.query(airbnb.airbnb_name, hosts.host_name, rooms.room_type, airbnb.latitude, airbnb.longitude, airbnb.city, airbnb.price, airbnb.minimum_nights, airbnb.number_of_reviews, airbnb.reviews_per_month, airbnb.availability_365)\
                            .join(hosts,(hosts.host_id == airbnb.host_id) & (hosts.airbnb_id == airbnb.airbnb_id))\
                            .join(rooms, (rooms.room_id == airbnb.room_id)).all()
    # End session
    session.close()
 
    # return the results
    if results is None:
        return { "status": "not_ok" }
    else:
        airbnb_info = []
        for airbnb_name, host_name, room_type, latitude,  longitude, city, price, minimum_nights, number_of_reviews, reviews_per_month, availability_365 in results:
            airbnb_info.append({ "airbnb_name": airbnb_name,
                                 "host_name": host_name,
                                 "room_type": room_type,
                                 "latitude": latitude,
                                 "longitude": longitude,
                                 "city": city,
                                 "price": price,
                                 "minimum_nights": minimum_nights,
                                 "number_of_reviews": number_of_reviews,
                                 "reviews_per_month": reviews_per_month,
                                 "availability_365": availability_365 })
        
        return jsonify(airbnb_info)

# get list of dictionaries from airports table
@app.route("/get_all_airports/")
def All_Airport_Data_Route():
    
    # start the session
    session = Session(engine)
    
    # query the database
    results = session.query(airports.iata, airports.airport_name, airports.latitude, airports.longitude).all()
    
    # end the session
    session.close()

    # return the results
    if results is None:
        return { "status": "not_ok" }
    else:
        airport_info = []
        for iata, airport_name, latitude, longitude in results:
            airport_info.append({ "iata": iata,
                                  "airport_name": airport_name,
                                  "latitude": latitude,
                                  "longitude": longitude })
        
        return jsonify(airport_info)

# get list of dictionaries of all city data
@app.route("/get_all_city_data/")
def All_City_Data_Route():

    # start database session
    session = Session(engine)
    
    # query the database
    results = session.query(cities.city_name, cities.state, cities.latitude, cities.longitude).all()
    
    # end database session
    session.close()
    
    # return the results
    if results is None:
        return { "status": "not_ok" }
    else:
        city_info = []
        for city_name, state, latitude, longitude in results:
            city_info.append({ "city": city_name,
                               "state": state,
                               "lat": latitude,
                               "lon": longitude })
            
        return jsonify(city_info)

# get a dictionary of airbnb details by coordinates
@app.route("/get_airbnb_details/<lat_value>/<lon_value>/")
def Get_AirBnB_Details(lat_value, lon_value):
    
    # start database session
    session = Session(engine)
    
    # query the database
    result = session.query(airbnb.airbnb_name, hosts.host_name, airbnb.price, rooms.room_type, airbnb.city, airbnb.availability_365, airbnb.minimum_nights, airbnb.reviews_per_month, airbnb.number_of_reviews)\
                            .join(hosts,(hosts.host_id == airbnb.host_id) & (hosts.airbnb_id == airbnb.airbnb_id))\
                            .join(rooms, (rooms.room_id == airbnb.room_id))\
                            .filter(airbnb.latitude == lat_value)\
                            .filter(airbnb.longitude == lon_value).first()
    
    # end database session
    session.close()
    
    # return the result
    if result is None:
        return { "status": "not_ok", "response": "Error within Flask server or database query." }
    else:
        return { "status": "ok", "response": { "airbnb_name": result[0],
                                               "host_name": result[1],
                                               "price": result[2],
                                               "room_type": result[3],
                                               "city": result[4],
                                               "availability_365": result[5],
                                               "minimum_nights": result[6],
                                               "reviews_per_month": result[7],
                                               "number_of_reviews": result[8] }}

# run the flask server
if __name__ == "__main__":
    app.run(debug = True)