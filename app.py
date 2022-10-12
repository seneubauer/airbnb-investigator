# import dependencies
from flask import Flask, render_template
import requests
import json

# import the api keys
from config import owm_api_key, places_api_key

# set the static OWM api parameters
owm_param_lang = "en"

# initialize the flask server
app = Flask(__name__)

# disable page caching
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0


# landing page
@app.route("/")
def index():
    return render_template("index.html")

# get city names from PostgreSQL
@app.route("/query_city_names/")
def Get_City_Names():
    
    city_names = []
    
    return city_names


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

# run the flask server
if __name__ == "__main__":
    app.run(debug = True)