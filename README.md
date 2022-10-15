# airbnb-investigator
Project 3 repository for University of Minnesota's Data Visualization & Analytics Coding Bootcamp

### Instructions:

#### Task 1. Clone the Repo
   1. From github, clone this `airbnb-investigator` as a local repo

#### Task 2. Open PostgreSQL software
   1. Open `PGAdmin` program, *while it loads move on to Task 3*

#### Task 3. Open a navigation terminal
   1. Open a `terminal` from the local repo if you are on a mac
    - *--OR--*
   1. Open a `gitbash` from the local repo if you are on a PC

#### Task 4. Activate a python environment
   1. Activate PythonData38 environment in your `terminal` *or* `gitbash`
 
#### Task 5. Open a web based interactive computing platform
   1. From `terminal` *or* `gitbash`, open a jupyter notebook
   2. Create a file named `config.py`
   3. Insert the following code and ***REPLACE your unique parameters*** where instructed:
    >username = "postgres"
    >password = "<-REPLACE WITH Your PGAdmin Password->"
    >dbase = "AirBnB"
    >port = "<- REPLACE WITH Your PGAdmin Port Number->"
    >owm_api_key = "<- REPLACE WITH Your Open Weather Map API Key->"
    >places_api_key = "<-REPLACE WITH Your Google Places API Key"
    4. Save your changes
    5. Leave jupyter notebook running in the background

#### Task 6. Create an empty database
   1. Using your unique password, log into `PGAdmin`
   2. Create a new database named `AirBnB`

#### Task 7. Open a query and run our schema code
   1. Open the Query Tool
   2. Navigate to and open the `erd.sql` file and run it in its entirety
   
   3. Close the Query tool
   
#### Task 8. Populate the schema with data
   1. In the jupyter notebook open `etl_workflow.ipynb` and run each cell in order
   2. Close
   

#### Task 9. Fire up the flask server
   1. In your `terminal` *or* `gitbash` get a new command prompt line
   2. run "python app.py"
   
#### Task 10. Open the application
   1. In a `chrome` browser go to address "http://127.0.0.1:5000"
    
#### Task 11. Explore

   *************WORKING HERE****************
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
    2. `erd.sql` is the postgreSQL file that creates the database schema

* In folder, `Resources`:
    1. `plain.jpg` is < describe contents >
    2. `selected.jpg` is < describe contents >

* In folder, `templates`/`static`/`css`:
    1. `reset.css` is style code file for resetting any changed style to a common start point
    2. `style.css` is style code file for changing the style for customized elements
    
* In folder, `templates`/`static`/`js`:
    1. `logic.js` is a Javascript that defines functions we call with our flask server
    2. 
    
* In folder, `templates`:
    1. `index.html` is the html code for the AirBnB landing page
    2. `about.html` is the html code for AirBnB's about page
---

### Observations:
* < List Observations Here >
* Special prioritization requirements for style.css are needed for elements that aren't working well togehter like !important
* Cache can cause problems in some browsers when using API calls, and there are tools that can prevent this
* Taking the time to design a thoughtful ERD can save tons of time later

---

### Credits and Special Thanks

* Thanks to simplmaps for providing United States Cities Database https://simplemaps.com/data/us-cities