# airbnb-investigator
Project 3 repository for University of Minnesota's Data Visualization & Analytics Coding Bootcamp

### Instructions:
Create file `config.py` to pass your user name, password, and port number into variables
This code will not run unless you first configure the following variables:

* pg_username = "postgres"
* pg_password = "bootcamp"
* pg_dbname = "AirBnB"
* pg_port = 5432 # or whatever else your postgresql port is
* places_api_key = "api_key_here" # api key for Places API
* owm_api_key = "api_key_here_for_openweather"

"< more repo instructions HERE >"
"< How to use repo etc. >"
---

### Overview:

##### Description:
An interactive map that provides custom data and visualizations from AirBnb data, weather forecasts, and airports, based on end user selections, geographically relevant coordinates, and time parameters.

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

* Python, Pandas, PostgreSQL, html, javascript, leaflet, plotly,  < edit or append here as needed>
---

##### Repo Contents:

* `config.py` is a security and customization file for hidden and/or unique data for using this repo
* `uscities.ipynb` is python code that pares down the list of us cities and coordinates
* `working_tom.ipynb` is < describe contents >
* `Proposal.md` is the initial work proposal
* `ReadME.md` is the instruction and guide that you are currently viewing for this repository
    
* In folder, `Data`:
    1. `AB_US_2020.csv` is the raw data used to retrieve all US AirBnB data
    2. `airports.csv` is the raw data used to locate all the US airports
    3. `uscities.csv` is the raw data used to retrieve coordinates for the list of all US cities

* In folder, `ERD`:
    1. `erd.png` is < describe contents >
    2. `erd.sql` is < describe contents >

* In folder, `Resources`:
    1. `plain.jpg` is < describe contents >
    2. `selected.jpg` is < describe contents >

* In folder, `templates`/`static`/`css`:
    1. `reset.css` is < describe contents >
    2. `style.css` is < describe contents >
    
* In folder, `templates`/`static`/`js`:
    1. `logic.js` is < describe contents >
    2. 
    
* In folder, `templates`:
    1. `index.html` is the html code for the AirBnB landing page
    2.
---

### Observations:
* < List Observations Here >
* Special prioritization requirements for style.css are needed for elements that aren't working well togehter like !important
* Cache can cause problems in some browsers when using API calls, and there are tools that can prevent this
* Taking the time to design a thoughtful ERD can save tons of time later

---

### Credits and Special Thanks

* Thanks to simplmaps for providing United States Cities Database https://simplemaps.com/data/us-cities