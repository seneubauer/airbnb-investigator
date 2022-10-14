// sample airbnb data
let airbnbs = [
    {
        name: "Charming Victorian home - twin beds + breakfast",
        host: "Evelyne",
        price: 60,
        room_type: "Private Room",
        city: "Asheville",
        availability: 0,
        minimum_nights: 1,
        last_review: "16/02/20",
        number_of_reviews: 138,
        location: [35.65146, -82.62792]
    },
    {
        name: "French Chic Loft",
        host: "Celeste",
        price: 470,
        room_type: "Private Room",
        city: "Asheville",
        availability: 288,
        minimum_nights: 1,
        last_review: "07/09/20",
        number_of_reviews: 114,
        location: [35.59779, -82.5554]
    }
];

// confirm logic.js is connected to index.html
console.log("logic.js is connected to index.html");

// define the geographic center of contiguous mainlan United States
let usa_center = [39.833333, -98.583333];
let current_coordinates = usa_center;

// define the unit system dictionaries
let unit_systems = [
    {
        temp_name: "Kelvin",
        temp_units: "K",
        owm_id: "standard"
    },
    {
        temp_name: "Celsius",
        temp_units: "°C",
        owm_id: "metric"
    },
    {
        temp_name: "Fahrenheit",
        temp_units: "°F",
        owm_id: "imperial"
    }
];

// define the axis titles
let axis_titles = [
    "Temperature",
    "Temperature",
    "Temperature",
    "Humidity",
    "Cloudiness",
    "Wind Speed"
];

// define the city dictionary
let cities = {};

// identify HTML elements for later reference
let city_selector = d3.select("#tags");
let forecast_selector = d3.select("#weather_metric_selector");
let unit_system_selector = d3.select("#units_selector");
let search_command_button = d3.select("#search_command");
let reset_command_button = d3.select("#reset_command");
let search_terms_input = d3.select("#search_terms");
let search_radius_input = d3.select("#search_radius");
let metadata_name = d3.select("#selection_name");
let metadata_host = d3.select("#selection_host");
let metadata_price = d3.select("#selection_price");
let metadata_room_type = d3.select("#selection_room_type");
let metadata_city = d3.select("#selection_city");
let metadata_availability = d3.select("#selection_availability");
let metadata_minimum_nights = d3.select("#selection_minimum_nights");
let metadata_last_review = d3.select("#selection_last_review");
let metadata_number_of_reviews = d3.select("#selection_number_of_reviews");

// define the layer groups globally
let airbnb_markers_layer = new L.layerGroup();
let places_markers_layer = new L.layerGroup();

// define HTML element events
$("#tags").on("autocompleteselect", AutoCompleteSelectHandler);
forecast_selector.on("change", function() { Forecast_Update(current_coordinates[0], current_coordinates[1]); });
unit_system_selector.on("change", function() { Forecast_Update(current_coordinates[0], current_coordinates[1]); });
search_command_button.on("click", Places_Search);
reset_command_button.on("click", Places_Reset);

// run the initialization method
init(usa_center);



/* ----- leaflet map generation ----- */

// assemble the airbnb markers
let airbnb_markers = [];


d3.json("airbnb/").then(function (data)
{
    console.log(data);
});



for (let i = 0; i < airbnbs.length; i++)
{
    airbnb_markers.push(L.marker(airbnbs[i].location)
        .bindPopup(`<h6 id="test">${airbnbs[i].name}</h6>`)
        .on("click", function() { Forecast_Update(airbnbs[i].location[0], airbnbs[i].location[1])}));
}

// construct the airbnb marker layer
airbnb_markers_layer = L.layerGroup(airbnb_markers);

// construct the street layer
let street_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// construct the topographic layer
let topo_layer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// specify the base layers
let baseMaps = {
    Street: street_layer,
    Topography: topo_layer
};

// specify the overlays
let overlayMaps = {
    AirBnBs: airbnb_markers_layer,
    Search: places_markers_layer
};

// initialize the leaflet map
let myMap = L.map("leaflet_map", {
    center: usa_center,
    zoom: 5,
    layers: [street_layer, airbnb_markers_layer, places_markers_layer]
});

// add the base and overlays
let myControl = L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);




// initial configuration of the web page
function init(initial_coordinates)
{
    /* ----- setting of initial HTML element values ----- */

    // set the forecast metric to Max Temperature
    forecast_selector.property("value", "0");

    // set the unit system to imperial
    unit_system_selector.property("value", "2");

    // set the search radius to 5000 meters
    search_radius_input.property("value", "2500");



    /* ----- retrieve HTML element values ----- */
    
    // retrieve the selected forecast metric
    let forecast_metric = forecast_selector.property("value");

    // retrieve the selected unit system
    let unit_system = unit_systems[unit_system_selector.property("value")];
    


    /* ----- initial construction of weather forecast plot ----- */

    // weather forecast placeholder trace data
    let forecast_trace = {
        x: [0, 1, 2, 3, 4],
        y: [0, 1, 2, 3, 4]
    };
    let forecast_data = [forecast_trace];

    // weather forecast layout
    let forecast_layout = {
        showlegend: false,
        yaxis: {
            title: {
                text: `${axis_titles[forecast_metric]} ${unit_system.temp_units}`
            }},
        height: 200,
        margin: {
            l: 50,
            t: 20,
            r: 50,
            b: 0},
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        plot_bgcolor: "rgba(0, 0, 0, 0)"
    };

    // build the initial weather forcast plot
    Plotly.newPlot("forecast_plot", forecast_data, forecast_layout);



    /* ----- populate the autocomplete dropdown ----- */

    // query the database for all cities
    d3.json("get_cities/").then(function (data)
    {
        // construct a string array from the query result
        var availableTags = [];
        for (let i = 0; i < data.length; i++)
        {
            availableTags.push(`${data[i].city}, ${data[i].state}`);
            cities[availableTags[i]] = { lat: data[i].latitude, lon: data[i].longitude };
        }
        
        // populate the dropdown with availableTags
        $("#tags").autocomplete({
                    source: availableTags
        });
    });


    
    /* ----- update the plot with real data ----- */

    // run the Forecast_Update method
    Forecast_Update(initial_coordinates[0], initial_coordinates[1]);
}

// handle the city clicked event
function AutoCompleteSelectHandler(event, ui)
{               
    var selectedObj = ui.item;
    console.log(cities[selectedObj.value]);

    let coords = L.latLng(cities[selectedObj.value].lat, cities[selectedObj.value].lon);

    myMap.flyTo(coords);
}

// update the forecast plot
function Forecast_Update(lat_value, lon_value)
{
    // get the current unit system
    let unit_system = unit_systems[unit_system_selector.property("value")];
    
    // get the forecast metric
    let forecast_metric = forecast_selector.property("value");

    // construct the query route
    let route = `weather_forecast/${lat_value}/${lon_value}/${unit_system.owm_id}/`;

    // query the flask server
    d3.json(route).then(function (data)
    {
        // check if the owm request was successful
        if (data.status == "ok")
        {
            // retrieve the array of dates
            let dates = Object.values(data.response.list);

            // initialize the data arrays
            let weather_data = [[], [], [], [], [], []];
            let date_arr = [];

            // iterate through the array and assign relevant data to arrays
            for (let i = 0; i < dates.length; i++)
            {
                weather_data[0].push(dates[i].main.temp_max);
                weather_data[1].push(dates[i].main.temp_min);
                weather_data[2].push(dates[i].main.feels_like);
                weather_data[3].push(dates[i].main.humidity);
                weather_data[4].push(dates[i].clouds.all);
                weather_data[5].push(dates[i].wind.speed);
                date_arr.push(dates[i].dt_txt);
            }

            // build the update objects
            let update_trace = {
                x: [date_arr],
                y: [weather_data[forecast_metric]]  
            };
            let update_layout = {
                yaxis: {
                    title: {
                        text: `${axis_titles[forecast_metric]} ${unit_system.temp_units}`
                    }
                }
            };
            
            // update the forecast plot
            Plotly.restyle("forecast_plot", update_trace, [0]);
            Plotly.relayout("forecast_plot", update_layout, [0]);
        }
        else if (data.status == "not_ok")
        {
            console.log("Error with OpenWeatherMaps api call.");
            console.log(data.response);
        }
    });
}

// perform the Google Places request
function Places_Search()
{
    // retrieve the search parameters
    let search_terms = search_terms_input.property("value");
    let search_radius = search_radius_input.property("value");
    
    if (search_terms == "") { search_terms = "None"; }

    // construct the api query
    let route = `nearby_search/${current_coordinates[0]}/${current_coordinates[1]}/${search_radius}/${search_terms}/`;
    
    // get the places api result
    d3.json(route).then(function (data)
    {
        console.log(data);
        // check if the places call was successful
        if (data.status == "ok")
        {
            // retrieve the array of businesses
            businesses = Object.values(data.response.results);

            // initialize the content arrays
            let places_markers = [];

            let business_name = "";
            let lat = 0.0;
            let lon = 0.0;
            let rating = 0.0;
            let price_level = 0.0;
            let total_ratings = 0;

            // iterate through the businesses
            for (let i = 0; i < businesses.length; i++)
            {
                if ("name" in businesses[i]) { business_name = businesses[i].name; } else { business_name = "undefined"; }
                if ("geometry" in businesses[i]) { lat = businesses[i].geometry.location.lat; } else { lat = usa_center[0]; }
                if ("geometry" in businesses[i]) { lon = businesses[i].geometry.location.lng; } else { lon = usa_center[1]; }
                if ("rating" in businesses[i]) { rating = businesses[i].rating; } else { rating = 0; }
                if ("price_level" in businesses[i]) { price_level = businesses[i].price_level; } else { price_level = 0; }
                if ("user_ratings_total" in businesses[i]) {total_ratings = businesses[i].user_ratings_total; } else { total_ratings = 0; }

                places_markers.push(L.marker([lat, lon])
                    .bindPopup(`
                        <div class="border rounded bg-light m-2 p-2">
                            <table class="table table-hover">
                                <thead>
                                    <th scope="col" colspan="2"><strong>Place Details</strong></th>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">Name</th>
                                        <td>${business_name}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Price Level</th>
                                        <td>${price_level}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Rating</th>
                                        <td>${rating}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Total Ratings</th>
                                        <td>${total_ratings}</td>
                                    </tr>
                                </tbody>
                        </table>  
                    </div>`));
            }

            // populate the markers layer group
            places_markers_layer = L.layerGroup(places_markers);
        }
        else if (data.status == "not_ok")
        {
            console.log("Error with Places api call.");
            console.log(data.response);
        }
    });
}

// perform the Google Places reset
function Places_Reset()
{
    places_markers_layer = L.layerGroup([]);
}