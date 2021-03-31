let city="";

const cityInputEl = $("#city-input");
const searchButton = $("#search-button");
const clearButton = $("#clear-history");
const currentCity = $("#current-city");
const currentCondition = $('current-condition')
const currentTemp = $("#temperature");
const currentHumidity= $("#humidity");
const currentWind=$("#wind-speed");
const currentUVindex= $("#uv-index");
let sCity=[];

const APIKey="1876ed65ab3cdf8b7a272096e11fe561";

let formSubmitHandler = function(event) {
    event.preventDefault();
    let cityInput = cityInputEl.value.trim();

    if(city) {
        getWeather(city);


    }

}

function currentWeather(city) {
    let apiURL = "api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+APIKey;

    fetch(apiURL).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        })
    })

};