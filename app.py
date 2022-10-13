# import dependencies for flask
from cmath import log
from flask import Flask
from flask import render_template
from flask import jsonify
import requests

# import dependencies for sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

# import confidential information
from config import pg_username, pg_password, pg_port, pg_dbname, owm_api_key, places_api_key

# build the posgresql connection string
connection_string = f"postgresql://{pg_username}:{pg_password}@localhost:{pg_port}/{pg_dbname}"

# build the sqlalchemy engine
engine = create_engine(connection_string, pool_pre_ping=True)

# reflect the database schema
base = automap_base()
base.prepare(engine, reflect=True)

# instantiate the tables required
airbnb = base.classes.airbnbs
hosts = base.classes.room_types
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

# weather api call
@app.route("/weather_forecast/<lat_value>/<lon_value>/<unit_system>/")
def Weather_Forecast_API_Request(lat_value, lon_value, unit_system):
    
    # construct the api url
    weather_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat_value}&lon={lon_value}&appid={owm_api_key}&units={unit_system}&lang={owm_param_lang}"
    
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
    
    # run the api request
    try:
        return { "status": "ok", "response": requests.get(places_url).json() }
    except requests.exceptions.RequestException as e:
        return { "status": "not_ok", "response": e.strerror }
    
# get list of dictionaries from airbnbs table
@app.route("/airbnb")
def AirBnBRoute():

    session = Session(engine)
    results = session.query(airbnb.airbnb_id, airbnb.airbnb_name, airbnb.latitude, airbnb.longitude).all()
    session.close()

    airbnb_info = []
    for airbnb_id, airbnb_name, latitude, longitude in results:
        dict = {}
        dict["airbnb_id"] = airbnb_id
        dict["airbnb_name"] = airbnb_name
        dict["latitude"] = latitude
        dict["longitude"] = longitude
        airbnb_info.append(dict)
    return jsonify(airbnb_info)

# get list of dictionaries from airports table
# @app.route("/airports")
# def AirportRoute():
#     session = Session(engine)
#     results = session.query(airports.iata, airports.airport_name, airports.latitude, airports.longitude).all()
#     session.close()

#     airport_info = []
#     for iata, airport_name, latitude, longitude in results:
#         dict = {}
#         dict["iata"] = iata
#         dict["airport_name"] = airport_name
#         dict['latitude'] = latitude
#         dict['longitude'] = longitude
#         airport_info.append(dict)
#     return jsonify(airport_info) 

# get list of dictionaries from cities table
# @app.route("/cities")
# def CityRoute():

#     session = Session(engine)
#     results = session.query(cities.city_name, cities.latitude, cities.longitude).all()
#     session.close()

#     city_info = []
#     for city_name, latitude, longitude in results:
#         dict = {}
#         dict["city_name"] = city_name
#         dict["latitude"] = latitude
#         dict["longitude"] = longitude
#         city_info.append(dict)
#         print(city_info)
#     return jsonify(city_info)

# run the flask server
if __name__ == "__main__":
    app.run(debug = True)