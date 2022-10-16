// confirm logic.js is connected to index.html
console.log("logic.js is connected to index.html");


/* ----- global declarations ----- */

// define the geographic center of contiguous mainland United States
let usa_center = [39.833333, -98.583333];
let current_coordinates = usa_center;

// define places search state
let places_search_state = false;

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

// define HTML elements for later reference
let forecast_selector = d3.select("#weather_metric_selector");
let unit_system_selector = d3.select("#units_selector");
let search_command_button = d3.select("#search_command");
let reset_command_button = d3.select("#reset_command");
let search_terms_input = d3.select("#search_terms");
let search_radius_input = d3.select("#search_radius");

// define HTML element events
forecast_selector.on("change", function() { Forecast_Update(current_coordinates[0], current_coordinates[1]); });
unit_system_selector.on("change", function() { Forecast_Update(current_coordinates[0], current_coordinates[1]); });

// run the initialization routine
init(usa_center);


/* ----- method definitions ----- */

// initial configuration of the web page
function init(initial_coordinates)
{
    /* ----- setting of initial HTML element values ----- */

    // set the forecast metric to Max Temperature
    forecast_selector.property("value", "0");

    // set the unit system to imperial
    unit_system_selector.property("value", "2");

    // set the search radius to 5000 meters
    search_radius_input.property("value", "10000");


    /* ----- retrieve HTML element values ----- */
    
    // retrieve the selected forecast metric
    let forecast_metric = forecast_selector.property("value");

    // retrieve the selected unit system
    let unit_system = unit_systems[unit_system_selector.property("value")];

    /* ----- leaflet map generation ----- */

    // construct the street layer
    let street_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // construct the topographic layer
    let topo_layer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    
    // create base layers object
    let baseMaps = {
        Street: street_layer,
        Topography: topo_layer
    };

    // create overlay layers object
    let overlayMaps = {};

    // initialize and configure the leaflet map
    let leaflet_map = L.map("leaflet_map", {
        center: usa_center,
        zoom: 5,
        layers: [street_layer]
    });

    // add the base and initial overlay layers
    let leaflet_control = L.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(leaflet_map);

    // add overlay layers
    Add_AirBnB_Layer(leaflet_control);
    Add_Airport_Layer(leaflet_control);

    // connect search event
    search_command_button.on("click", function() { Add_Search_Layer(leaflet_control); } );

    /* ----- initial construction of weather forecast plot ----- */

    // weather forecast placeholder trace data
    let forecast_trace = {
        x: [],
        y: []
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
    d3.json("get_all_city_data/").then(function (data)
    {
        // construct a string array from the query result
        var availableTags = [];
        for (let i = 0; i < data.length; i++)
        {
            availableTags.push( { label: `${data[i].city}, ${data[i].state}`, value: { lat: data[i].lat, lon: data[i].lon, map: leaflet_map } } );
        }
        
        // populate the dropdown with availableTags
        $("#tags").autocomplete({
                    source: availableTags,
                    delay: 50,
                    minLength: 3,
                    select: function(event, ui) {
                        let selected_values = ui.item.value;
                        current_coordinates[0] = selected_values.lat;
                        current_coordinates[1] = selected_values.lon;
                        let leaflet_coordinates = L.latLng(selected_values.lat, selected_values.lon);
                        selected_values.map.flyTo(leaflet_coordinates, 12);
                        event.preventDefault();
                        $("#tags").val(ui.item.label);
                    }
        });
    });


    /* ----- update forecast plot with real data ----- */

    // run the Forecast_Update method
    Forecast_Update(initial_coordinates[0], initial_coordinates[1]);
}

// add airbnb layer to leaflet
function Add_AirBnB_Layer(leaflet_control)
{
    // https://www.flaticon.com/free-icon/home_25694?term=house&page=1&position=1&page=1&position=1&related_id=25694&origin=search
    //<a href="https://www.flaticon.com/free-icons/home" title="home icons">Home icons created by Dave Gandy - Flaticon</a>
    let custom_icon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/1659/1659305.png",
        iconSize: [25, 25],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0]
    });

    d3.json("get_all_airbnbs/").then(function (data)
    {
        // ensure the response is ok
        if (data.length > 0)
        {
            // initialize the marker cluster group
            let markers = L.markerClusterGroup();

            // populate the marker array
            for (let i = 0; i < data.length; i++)
            {
                markers.addLayer(L.marker([data[i].latitude, data[i].longitude], { icon: custom_icon })
                                    .on("click", function() { AirBnB_Clicked(data[i].latitude, data[i].longitude) }));
            }

            // add marker layer to the map
            leaflet_control.addOverlay(markers, "AirBnBs");
        }
        else
        {
            console.log("Error within Flask route or database query.");
        }
    });
}

// add airport layer to leaflet
function Add_Airport_Layer(leaflet_control)
{
    // https://www.flaticon.com/free-icon/airplane_31069?term=airplane&page=1&position=1&page=1&position=1&related_id=31069&origin=tag
    //<a href="https://www.flaticon.com/free-icons/plane" title="plane icons">Plane icons created by Freepik - Flaticon</a>
    let custom_icon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/31/31069.png",
        iconSize: [25, 25],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0]
    });

    d3.json("get_all_airports/").then(function (data)
    {
        // ensure the response is ok
        if (data.length > 0)
        {
            // initialize the marker array
            let airport_markers = [];

            // populate the marker array
            for (let i = 0; i < data.length; i++)
            {
                airport_markers.push(L.marker([data[i].latitude, data[i].longitude], { icon: custom_icon })
                    .bindPopup(`
                    <div class="border rounded bg-light p-2">
                        <table class="table table-hover">
                            <thead>
                                <th scope="col" colspan="2"><strong>Airport Details</strong></th>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">IATA</th>
                                    <td>${data[i].iata}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Name</th>
                                    <td>${data[i].airport_name}</td>
                                </tr>
                            </tbody>
                    </table>  
                </div>`));
            }

            // add marker layer to the map
            leaflet_control.addOverlay(L.layerGroup(airport_markers), "Airports");
        }
        else
        {
            console.log("Error within Flask route or database query.");
        }
    });
}

// add search layer to leaflet
function Add_Search_Layer(leaflet_control)
{
    // exit the function if the places search is already in place
    if (places_search_state) { return; }

    // https://www.flaticon.com/free-icon/search_149852?term=search&page=1&position=3&page=1&position=3&related_id=149852&origin=search
    // <a href="https://www.flaticon.com/free-icons/search" title="search icons">Search icons created by Smashicons - Flaticon</a>
    let custom_icon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149852.png",
        iconSize: [25, 25],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0]
    });

    // set the search state flag to true
    places_search_state = true;
    
    // retrieve the search parameters
    let search_terms = search_terms_input.property("value");
    let search_radius = search_radius_input.property("value");
    
    if (search_terms == "") { search_terms = "None"; }

    // construct the api query
    let route = `nearby_search/${current_coordinates[0]}/${current_coordinates[1]}/${search_radius}/${search_terms}/`;
    
    // get the places api result
    d3.json(route).then(function (data)
    {
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
                
                places_markers.push(L.marker([lat, lon], { icon: custom_icon })
                    .bindPopup(`
                        <div class="border rounded bg-light p-2">
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

            // build the layer group
            let places_markers_layer = L.layerGroup(places_markers);

            // add marker layer to the map
            leaflet_control.addOverlay(places_markers_layer, "Places");
            
            // connect reset event
            reset_command_button.on("click", function() { Remove_Search_Layer(leaflet_control, places_markers_layer); });
        }
        else if (data.status == "not_ok")
        {
            console.log("Error with Places api call.");
            console.log(data.response);
        }
    });
}

// remove search layer from leaflet
function Remove_Search_Layer(leaflet_control, places_markers_layer)
{
    places_markers_layer.clearLayers();
    leaflet_control.removeLayer(places_markers_layer);
    search_terms_input.property("value", "");
    places_search_state = false;
}

// handle the airbnb marker clicked event
function AirBnB_Clicked(lat_value, lon_value)
{
    // update the current coordinates
    current_coordinates[0] = lat_value;
    current_coordinates[1] = lon_value;

    // update the airbnb details table
    AirBnB_Details_Update(lat_value, lon_value);

    // update the weather forecast
    Forecast_Update(lat_value, lon_value);
}

// retrieve the current airbnb details
function AirBnB_Details_Update(lat_value, lon_value)
{
    // construct the query route
    let route = `get_airbnb_details/${lat_value}/${lon_value}/`

    // query the flask server
    d3.json(route).then(function (data)
    {
        // check if the request was successful
        if (data.status == "ok")
        {
            d3.select("#selection_name").text(data.response.airbnb_name);
            d3.select("#selection_host").text(data.response.host_name);
            d3.select("#selection_price").text(data.response.price);
            d3.select("#selection_room_type").text(data.response.room_type);
            d3.select("#selection_city").text(data.response.city);
            d3.select("#selection_availability").text(data.response.availability_365);
            d3.select("#selection_minimum_nights").text(data.response.minimum_nights);
            d3.select("#selection_reviews_per_month").text(data.response.reviews_per_month);
            d3.select("#selection_number_of_reviews").text(data.response.number_of_reviews);
        }
        else if (data.status == "not_ok")
        {
            console.log(data.response);
        }
        else
        {
            console.log("Error within JavaScript file.");
        }
    });
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