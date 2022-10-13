# import dependencies
from flask import Flask
from flask import render_template
from flask import jsonify
import requests

# Import the functions we need from SQL Alchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

# Import any remaining functions
import json

# Define the PostgreSQL connection parameters
username = 'postgres'
password = 'bootcamp'
database_name = 'AirBnB'
port_number = '5432'
connection_string = f'postgresql://{username}:{password}@localhost:{port_number}/{database_name}'

# Connect to the SQL database
engine = create_engine(connection_string, pool_pre_ping=True)
base = automap_base()
base.prepare(engine, reflect=True)

#Choose the SQL tables we wish to use.
airbnb = base.classes.airbnbs
hosts = base.classes.hosts
#cities = base.classes.us_cities

# Instantiate the Flask application.
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Disable page caching

# landing page
@app.route("/")
def IndexRoute():
    webpage = render_template("index.html")
    return webpage

@app.route("/airbnb")
def AirBnBRoute():

    session = Session(engine)
    results = session.query(airbnb.id, airbnb.airbnb_name, airbnb.latitude, airbnb.longitude).all()
    session.close()

    airbnb_info = []
    for id, airbnb_name, latitude, longitude in results:
        dict = {}
        dict["id"] = id
        dict["airbnb_name"] = airbnb_name
        dict["latitude"] = latitude
        dict["longitude"] = longitude
        airbnb_info.append(dict)
    
    return jsonify(airbnb_info)

@app.route("/hosts")
def HostRoute():

    session = Session(engine)
    results = session.query(hosts.host_id, hosts.host_name).all()
    session.close()

    host_info = []
    for host_id, host_name in results:
        dict = {}
        dict["host_id"] = host_id
        dict["host_name"] = host_name
        host_info.append(dict)
        print(host_info)
    return jsonify(host_info) 

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