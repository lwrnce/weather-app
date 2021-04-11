let city = "san jose";

const searchButton = $("#search-button");
const userFormEl = $("#user-form");
const cityInputEl = $("#city-input");
const clearButton = $("#clear-history");
const wIcon = $("#current-weather");
const currentDate = $("#current-date");
const currentCity = $("#current-city");
const currentCondition = $("#current-condition");
const currentTemp = $("#temperature");
const currentHumidity= $("#humidity");
const currentWind=$("#wind-speed");
const currentUVIndex= $("#uv-index");

const APIKey="1876ed65ab3cdf8b7a272096e11fe561";

// create variable for array of searched cities
let searchedCity = [];

//simple for loop for checking if city has been searched already
const cityCheck = (c) => {
    for ( let i = 0; i < searchedCity.length; i++) {
        if (c.toUpperCase() === searchedCity[i]){
            return -1;
        }
    }
    return 1;
}

let formSubmitHandler = function(event) {
    event.preventDefault();
    if(cityInputEl.val().trim()!=="") {
        city = cityInputEl.val().trim();
        getWeatherData(city)
        forecast(city);
    }
};

// const currentWeather

// const forecastWeather

function getWeatherData() {
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&APPID="+APIKey;
    fetch(apiUrl).then(function(response) {
            response.json().then(function(data) {
                // console.log(data);
                $(currentCity).html(data.name);

                let today = new Date(data.dt*1000).toLocaleDateString();
                $(currentDate).html(today);

                let weatherIcon = data.weather[0].icon;
                let iconUrl = "https://openweathermap.org/img/wn/"+weatherIcon+"@2x.png";
                $(wIcon).html("<img src="+iconUrl+">");

                let currentWeather = data.weather[0].main;
                $(currentCondition).html(currentWeather);
                
                let windspeed = data.wind.speed;
                $(currentWind).html(windspeed+"MPH");

                let temperature = data.main.temp;
                $(currentTemp).html(`${Math.floor(temperature)}°F`);

                let humidity = data.main.humidity;
                $(currentHumidity).html(`${Math.floor(humidity)}%`);

                UVIndex(data.coord.lon, data.coord.lat);
                console.log(currentWeather, windspeed, iconUrl, temperature, today);
            })
        })
};

function UVIndex(ln, lt) {
    let uvUrl = "https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    fetch(uvUrl).then(function(response) {
        response.json().then(function(data){
            console.log(data.value);
            $(currentUVIndex).html(data.value);
        })
    })
};

function forecast() {
    let forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=imperial&appid="+APIKey;
    fetch(forecastUrl).then(function(response) {
        response.json().then(function(data){
            console.log(data);

            for (i = 0; i < 5; i++) {
                let date = new Date((data.list[((i + 1) * 8) - 1].dt * 1000)).toLocaleDateString();
                $("#forecastDate"+i).html(date);

                let forecastIcon = data.list[((i+1)*8-1)].weather[0].icon;
                let iconUrl = "https://openweathermap.org/img/wn/"+forecastIcon+"@2x.png";
                $("#forecastIcon"+i).html("<img src="+iconUrl+">");

                let temperature = data.list[((i + 1) * 8) - 1].main.temp;
                $("#forecastTemp"+i).html(`${Math.floor(temperature)}°F`);

                let humidity = data.list[((i + 1) * 8) - 1].main.humidity;
                $("#forecastHumidity"+i).html(`${Math.floor(humidity)}%`);

                console.log(date, forecastIcon, iconUrl, temperature, humidity);
            }
        })
    })
};

userFormEl[0].addEventListener("submit", formSubmitHandler);