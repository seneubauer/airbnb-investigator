// confirm logic.js is connected to index.html
console.log("logic.js is connected to index.html");

// open weather maps generic api parameters
let param_units = "imperial";
let param_language = "en";

// define the geographic center of contiguous mainlan United States
let usa_center = [39.833333, -98.583333];
let current_coordinates = usa_center;

// identify HTML elements for later reference
let forecast_selector = d3.select("#weather_metric_selector");

// define HTML element events
forecast_selector.on("change", Forecast_Update);

// sample airbnb data
let airbnbs = [
    {
        name: "French Chic Loft",
        location: [35.59779, -82.5554]
    }
];

// run the initialization method
init(usa_center);

// initial configuration of the web page
function init(initial_coordinates)
{
    // initialize the leaflet map
    let myMap = L.map("leaflet_map", {
        center: usa_center,
        zoom: 5
    });
    
    // add the background tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // construct the airbnb markers
    for (let i = 0; i < airbnbs.length; i++)
    {
        L.marker(airbnbs[i].location)
            .bindPopup(`<h5 id="test">${airbnbs[i].name}</h5>`)
            .addTo(myMap)
            .on("click", Marker_Clicked(airbnbs[i].location[0], airbnbs[i].location[1]));
    }

    // set the initial value for the forecast selector
    forecast_selector.property("value", "0");

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

        // weather forecast trace data
        let forecast_trace = {
            x: date_arr,
            y: weather_data[forecast_metric]
        };
        let forecast_data = [forecast_trace];
        
        // weather forecast layout
        let forecast_layout = {
            showlegend: false,
            margin: {
                l: 50,
                t: 50,
                r: 50,
                b: 50},
            paper_bgcolor: "rgba(0, 0, 0, 0)",
            plot_bgcolor: "rgba(0, 0, 0, 0)"
        };

        // build me an army worth of Mordor
        Plotly.newPlot("temp_plot", forecast_data, forecast_layout);
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
        
        // update the forecast plot
        Plotly.restyle("temp_plot", "x", [date_arr]);
        Plotly.restyle("temp_plot", "y", [weather_data[forecast_metric]]);
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
        
        Plotly.restyle("temp_plot", "x", [date_arr]);
        Plotly.restyle("temp_plot", "y", [weather_data[forecast_metric]]);
    });
}

// convert unix timestamps to JS date objects
function time_converter(unix_time)
{
    return new Date(unix_time * 1000);
}