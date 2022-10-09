// confirm logic.js is connected to index.html
console.log("logic.js is connected to index.html");

// open weather maps generic api parameters
let param_units = "imperial";
let param_language = "en";

// define the geographic center of contiguous mainlan United States
let usa_center = [39.833333, -98.583333];
let current_coordinates = usa_center;

// define the unit system dictionaries
let unit_systems = [
    {
        temp_name: "Kelvin",
        temp_units: "K"
    },
    {
        temp_name: "Celcius",
        temp_units: "°C"
    },
    {
        temp_name: "Fahrenheit",
        temp_units: "°F"
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

// identify HTML elements for later reference
let forecast_selector = d3.select("#weather_metric_selector");
let unit_system_selector = d3.select("#units_selector");
let metadata_name = d3.select("#selection_name");
let metadata_host = d3.select("#selection_host");
let metadata_price = d3.select("#selection_price");
let metadata_room_type = d3.select("#selection_room_type");
let metadata_city = d3.select("#selection_city");
let metadata_availability = d3.select("#selection_availability");
let metadata_minimum_nights = d3.select("#selection_minimum_nights");
let metadata_last_review = d3.select("#selection_last_review");
let metadata_number_of_reviews = d3.select("#selection_number_of_reviews");

// define HTML element events
forecast_selector.on("change", Forecast_Update);
unit_system_selector.on("change", Forecast_Update);

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

// run the initialization method
init(usa_center);

// initial configuration of the web page
function init(initial_coordinates)
{   
    // assemble the airbnb markers
    let airbnb_markers = [];
    for (let i = 0; i < airbnbs.length; i++)
    {
        airbnb_markers.push(L.marker(airbnbs[i].location)
            .bindPopup(`<h6 id="test">${airbnbs[i].name}</h6>`)
            .on("click", function() { Marker_Clicked(airbnbs[i].location[0], airbnbs[i].location[1])}));
    }

    // construct the airbnb marker layer
    let airbnb_markers_layer = L.layerGroup(airbnb_markers);

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
        AirBnBs: airbnb_markers_layer
    };
    
    // initialize the leaflet map
    let myMap = L.map("leaflet_map", {
        center: usa_center,
        zoom: 5,
        layers: [street_layer, airbnb_markers_layer]
    });

    // add the base and overlays
    L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);

    // set the initial value for the forecast selector
    forecast_selector.property("value", "0");

    // set the initial value for the unit system selector
    unit_system_selector.property("value", "2");

    // construct the OWM api call
    let weather_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${initial_coordinates[0]}&lon=${initial_coordinates[1]}&units=${param_units}&lang=${param_language}&appid=${owm_api_key}`;

    // retrieve the OWM JSON data
    d3.json(weather_url).then(function (data)
    {
        // retrieve the array of dates
        let dates = Object.values(data.list);
        
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

        // retrieve the selected forecast metric
        let forecast_metric = forecast_selector.property("value");

        // retrieve the selected unit system
        let unit_system = unit_systems[unit_system_selector.property("value")];

        // weather forecast trace data
        let forecast_trace = {
            x: date_arr,
            y: weather_data[forecast_metric]
        };
        let forecast_data = [forecast_trace];

        // weather forecast layout
        let forecast_layout = {
            showlegend: false,
            yaxis: {
                title: {
                    text: `${axis_titles[forecast_metric]} ${unit_system.temp_units}`
                }},
            margin: {
                l: 50,
                t: 50,
                r: 50,
                b: 50},
            paper_bgcolor: "rgba(0, 0, 0, 0)",
            plot_bgcolor: "rgba(0, 0, 0, 0)"
        };

        // build me an army worth of Mordor
        Plotly.newPlot("forecast_plot", forecast_data, forecast_layout);
    });
}

// update the display when a marker is clicked
function Marker_Clicked(param_lat, param_lon)
{
    // construct the OWM api call
    let weather_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${param_lat}&lon=${param_lon}&units=${param_units}&lang=${param_language}&appid=${owm_api_key}`;

    // save the clicked coordinates to the current coordinate variable
    current_coordinates = [param_lat, param_lon];

    // retrieve the OWM JSON data
    d3.json(weather_url).then(function (data)
    {
        // retrieve the array of dates
        let dates = Object.values(data.list);

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

        // retrieve the selected forecast metric
        let forecast_metric = forecast_selector.property("value");

        // retrieve the selected unit system
        let unit_system = unit_systems[unit_system_selector.property("value")];

        // build the update
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
    });
}

// update the forecast plot
function Forecast_Update()
{
    // construct the OWM api call
    let weather_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${current_coordinates[0]}&lon=${current_coordinates[1]}&units=${param_units}&lang=${param_language}&appid=${owm_api_key}`;

    // retrieve the OWM JSON data
    d3.json(weather_url).then(function (data)
    {
        // retrieve the array of dates
        let dates = Object.values(data.list);

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

        // retrieve the selected forecast metric
        let forecast_metric = forecast_selector.property("value");

        // retrieve the selected unit system
        let unit_system = unit_systems[unit_system_selector.property("value")];

        // build the update
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
    });
}