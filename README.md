# airbnb-investigator
Project 3 repository for University of Minnesota's Data Visualization & Analytics Coding Bootcamp

### Instructions:

#### Task 1. Clone the Repo
   1. From github, clone this `airbnb-investigator` as a local repo

#### Task 2. Open PostgreSQL software
   1. Open `PGAdmin` program, *while it loads move on to Task 3*

#### Task 3. Open a navigation terminal
   1. From the local repo, open a `terminal` if on mac ***OR*** open a `gitbash` if PC

#### Task 4. Activate a python environment
   1. Activate PythonData38 environment in your `terminal` *or* `gitbash`
 
#### Task 5. Open a web based interactive computing platform
   1. From `terminal` *or* `gitbash`, open a jupyter notebook
   2. Create a new file and name it `config.py`
   3. Insert the following code and ***REPLACE unique parameters*** where instructed:
>username = "postgres"\
password = "<-REPLACE WITH Your PGAdmin Password->"\
dbase = "AirBnB"\
port = "<- REPLACE WITH Your PGAdmin Port Number->"\
owm_api_key = "<- REPLACE WITH Your Open Weather Map API Key->"\
places_api_key = "<-REPLACE WITH Your Google Places API Key->"
   4. Save your changes
   5. Close your file, but leave jupyter notebook open in the background

#### Task 6. Create an empty database
   1. Using your unique password, log into `PGAdmin`
   2. Create a new database named ***"AirBnB"***

#### Task 7. Open a query and run our schema code
   1. Open the Query Tool
   2. Navigate to and open the `erd.sql` file and run it in its entirety
   3. Close the Query tool
   
#### Task 8. Populate the schema with data
   1. In the jupyter notebook open `etl_workflow.ipynb` and run each cell in order
   2. Close the file and the notebook
   
#### Task 9. Fire up the flask server
   1. In your `terminal` *or* `gitbash` get a new command prompt line
   2. In a new command line, run ***"python app.py"***
   
#### Task 10. Open the application
   1. In a `chrome` browser go to local host address "http://127.0.0.1:5000"
    
#### Task 11. Explore and enjoy the AirBnB Investigator App
---

### Overview:

##### Description:
An interactive map that provides interactive metadata and visualizations from AirBnb data, customizable weather charts by region, airports, and more, all based on end user selections, geographically relevant coordinates, and current time parameters.

##### Authors:
* Tom Lenzmeier (tlenzmeier58)
* Scott Neubauer (seneubauer)
* Maryam Osman (maryamosman20)
* John Torgerson (JohnTorgerson)
---

##### Tools & Supplies:
* Air BnB database
* Airports database
* US Cities database

* Python 
* Pandas
* PostgreSQL
* SQLAlchemy
* HTML
* Flask
* JavaScript
* Leaflet
* Plotly
---

##### Repo Contents:
* `app_py.ipynb` is a notebook we used to create and test queries
* `app.py` is the python file that runs the flask server for the app
* `config.py` You will need to create this for your passwords/API keys
* `etl_workflow.ipynb` is the notebook used for cleaning data and populating the database
* `Proposal.md` is the initial work proposal for this project
* `README.md` is the instruction and guide that you are currently viewing for this repository
    
* In folder, `Data`:
    1. `AB_US_2020.csv` is the raw data used to retrieve all US AirBnB data
    2. `airports.csv` is the raw data used to locate all the US airports
    3. `uscities.csv` is the raw data used to retrieve coordinates for the list of all US cities

* In folder, `ERD`:
    1. `erd.png` is database schema design for the relationships of tables
    2. `erd.sql` is the postgreSQL file that creates the database schema

* In folder, `Resources`:
    1. `layout.jpg` is a 1st draft sketch of a layout for functions on the landing page
    2. `plain.jpg` is 1st draft sketch of our landing page map with dropdown for locations
    3. `selected.jpg` is 1st draft sketch of what could happen if a location is selected

* In folder, `static`/`css`:
    1. `reset.css` is style code file for resetting any changed style to a common start point
    2. `style.css` is style code file for changing the style for customized elements
    
* In folder, `static`/`js`:
    1. `logic.js` is a Javascript that defines functions we call with our flask server

* In folder, `templates`:
    1. `about.html` is the html code for AirBnB's about page
    2. `index.html` is the html code for the AirBnB landing page
---

### Observations:
* There is no such thing as "clean data"
* Special prioritization requirements for style.css are needed for elements that aren't working well togehter like "!important" in our css.style sheet
* Cache can cause problems in some browsers when using API calls, and there are tools that can prevent this
* Taking the time to design a thoughtful ERD can save tons of time later

---

### Credits and Special Thanks
* Thanks to Kaggle for AirBnB data https://www.kaggle.com/
* Thanks to Simplemaps for US cities data https://simplemaps.com/data/us-cities
* Thanks to Data Hub for US airports data https://datahub.io/core/airport-codes#resource-airport-codes
* Thanks to GooglePlaces for search data https://developers.google.com/maps/documentation/places/web-service/overview
* Thanks to Open Weather for weather forecast data https://openweathermap.org/
* Thanks to Leaflet for the functional mapping library https://leafletjs.com/
* Thanks to JQuery for the functional autocomplete dropdown JS library https://jqueryui.com/about/
* Thanks to freepikcompany for the flaticons https://www.flaticon.com/