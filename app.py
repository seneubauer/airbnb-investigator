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
rooms = base.classes.room_types
airports = base.classes.airports
cities = base.classes.us_cities

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
    results = session.query(airbnb, hosts, rooms)\
            .join(airbnb, airbnb.host_id == hosts.host_id)\
            .join(airbnb, airbnb.room_id == rooms.room_id)
            
    for row in results.all():
        print("(")
        for item in row:
            print(" ", item)
        print(")")

# @app.route("/airbnb")
# def AirBnBRoute():

#     session = Session(engine)
#     results = session.query(airbnb.id, airbnb.airbnb_name, airbnb.latitude, airbnb.longitude).all()
#     session.close()

#     airbnb_info = []
#     for id, airbnb_name, latitude, longitude in results:
#         dict = {}
#         dict["id"] = id
#         dict["airbnb_name"] = airbnb_name
#         dict["latitude"] = latitude
#         dict["longitude"] = longitude
#         airbnb_info.append(dict)
    
    # run the api request
    try:
        return { "status": "ok", "response": requests.get(places_url).json() }
    except requests.exceptions.RequestException as e:
        return { "status": "not_ok", "response": e.strerror }
    
# get list of dictionaries from airbnbs table
@app.route("/airbnb")
def AirBnBRoute():
 
    session = Session(engine)
    results = session.query(airbnb.airbnb_id, airbnb.airbnb_name, hosts.host_name, rooms.room_type, airbnb.latitude, airbnb.longitude, airbnb.city)\
        .join(hosts,(hosts.host_id == airbnb.host_id) & (hosts.airbnb_id == airbnb.airbnb_id))\
        .join(rooms, (rooms.room_id == airbnb.room_id))#.filter(airbnb.city == 'Asheville')
 
    session.close()
 
    airbnb_info = []
    for airbnb_id, airbnb_name, host_name, room_type, latitude,  longitude, city in results:
        dict = {}
        dict["airbnb_id"] = airbnb_id
        dict["airbnb_name"] = airbnb_name
        dict["host_name"] = host_name
        dict["room_type"] = room_type
        dict["latitude"] = latitude
        dict["longitude"] = longitude
        dict["city"] = city
        airbnb_info.append(dict)
   
    return jsonify(airbnb_info)

# get list of dictionaries from airports table
@app.route("/airports")
def AirportRoute():
    session = Session(engine)
    results = session.query(airports.iata, airports.airport_name, airports.latitude, airports.longitude).all()
    session.close()

#     airport_info = []
#     for iata, airport_name, latitude, longitude in results:
#         dict = {}
#         dict["iata"] = iata
#         dict["airport_name"] = airport_name
#         dict['latitude'] = latitude
#         dict['longitude'] = longitude
#         airport_info.append(dict)
#     return jsonify(airport_info) 

def CityRoute():

    session = Session(engine)
    results = session.query(cities.city_name, cities.state, cities.latitude, cities.longitude).all()
    session.close()

    city_info = []
    for city_name, state, latitude, longitude in results:
        dict = {}
        dict["city_name"] = city_name
        dict["city"] = city_name
        dict["latitude"] = latitude
        dict["longitude"] = longitude
        city_info.append(dict)
        print(city_info)
    return jsonify(city_info)

# run the flask server
if __name__ == "__main__":
    app.run(debug = True)
# # import dependencies
# from flask import Flask
# from flask import render_template
# from flask import jsonify
# import requests

# # Import the functions we need from SQL Alchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine

# # Import any remaining functions
# import json

# # Define the PostgreSQL connection parameters
# username = 'postgres'
# password = 'bootcamp'
# database_name = 'AirBnB'
# port_number = '5432'
# connection_string = f'postgresql://{username}:{password}@localhost:{port_number}/{database_name}'

# # Connect to the SQL database
# engine = create_engine(connection_string, pool_pre_ping=True)
# base = automap_base()
# base.prepare(engine, reflect=True)

# #Choose the SQL tables we wish to use.
# airbnb = base.classes.airbnbs
# hosts = base.classes.hosts
# #cities = base.classes.us_cities

# # Instantiate the Flask application.
# app = Flask(__name__)
# app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Disable page caching

# # landing page
# @app.route("/")
# def IndexRoute():
#     webpage = render_template("index.html")
#     return webpage

# @app.route("/airbnb")
# def AirBnBRoute():

#     session = Session(engine)
#     results = session.query(airbnb.id, airbnb.airbnb_name, airbnb.latitude, airbnb.longitude).all()
#     session.close()

#     airbnb_info = []
#     for id, airbnb_name, latitude, longitude in results:
#         dict = {}
#         dict["id"] = id
#         dict["airbnb_name"] = airbnb_name
#         dict["latitude"] = latitude
#         dict["longitude"] = longitude
#         airbnb_info.append(dict)
    
#     return jsonify(airbnb_info)

# @app.route("/hosts")
# def HostRoute():

#     session = Session(engine)
#     results = session.query(hosts.host_id, hosts.host_name).all()
#     session.close()

#     host_info = []
#     for host_id, host_name in results:
#         dict = {}
#         dict["host_id"] = host_id
#         dict["host_name"] = host_name
#         host_info.append(dict)
#         print(host_info)
#     return jsonify(host_info)

# # @app.route("/cities")
# # def CityRoute():

# #     session = Session(engine)
# #     results = session.query(cities.city_name, cities.latitude, cities.longitude).all()
# #     session.close()

# #     city_info = []
# #     for city_name, latitude, longitude in results:
# #         dict = {}
# #         dict["city_name"] = city_name
# #         dict["latitude"] = latitude
# #         dict["longitude"] = longitude
# #         city_info.append(dict)
# #         print(city_info)
# #     return jsonify(city_info)

# # run the flask server
# if __name__ == "__main__":
#     app.run(debug = True)