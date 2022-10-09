console.log("logic.js is connected to index.html");

let param_lat = 35.65146;
let param_lon = -82.62792;
let param_units = "imperial";
let param_language = "en";

let weather_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${param_lat}&lon=${param_lon}&units=${param_units}&lang=${param_language}&appid=${owm_api_key_current}`;

// sample airbnb data
let airbnbs = [
    {
        name: "Charming Victorian home - twin beds + breakfast",
        location: [35.65146, -82.62792]
    },
    {
        name: "French Chic Loft",
        location: [35.59779, -82.5554]
    },
    {
        name: "Walk to stores/parks/downtown. Fenced yard/Pets OK",
        location: [35.6067, -82.55563]
    }
];

// initialize the Leaflet map
let myMap = L.map("leaflet_map", {
    center: [param_lat, param_lon],
    zoom: 4
});

// construct the airbnb markers
for (let i = 0; i < airbnbs.length; i++)
{
    L.marker(airbnbs[i].location)
        .bindPopup(`<h5 id="test">${airbnbs[i].name}</h5>`)
        .addTo(myMap)
        .on("click", RetrieveWeatherData);
}

function RetrieveWeatherData()
{
    d3.json(weather_url).then(function (data)
    {
        // log the data for confirmation
        console.log(data);
        
        // retrieve the array of dates
        let dates = Object.values(data.list);

        // initialize the data arrays
        let tmax_arr = [];
        let tmin_arr = [];
        let date_arr = [];

        // iterate through the array and assign relevant data to arrays
        for (let i = 0; i < dates.length; i++)
        {
            tmax_arr.push(dates[i].main.temp_max);
            tmin_arr.push(dates[i].main.temp_min);
            date_arr.push(dates[i].dt);
        }

        console.log(tmax_arr);

        Plotly.restyle("temp_plot", "x", [date_arr]);
        Plotly.restyle("temp_plot", "y", [tmax_arr]);
    });
}

let trace1 = {
    x: [0, 1, 2],
    y: [0, 1, 2]
};
let layout = {
    title: "yo"
};
Plotly.newPlot("temp_plot", [trace1], layout);

// add the background tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);












function time_converter(unix_time)
{
    return new Date(unix_time * 1000);
}