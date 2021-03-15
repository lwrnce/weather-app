var city="";

var search = $("#city-input");
var searchButton = $("#search-button");
var currentCity = $("current-city");
var todaysTemp = $("#temperature");
var todaysHumidity = $("#humidity");
var todaysWind = $("#wind-speed");
var todaysUVindex = $("#uv-index");
var searchedCity = [];

var APIKey="1876ed65ab3cdf8b7a272096e11fe561";

function find(cityName){
    for (var i = 0; i < searchedCity.length; i++) {
        if(cityName.toUpperCase() === searchedCity[i]) {
            return -1;
        }
    }
    return 1;
}

function display(e) {
    e.preventDefault();
    if(search.val() !== "") {
        city = search.val();
        todaysWeather(city);
    }
};

function todaysWeather(city) {
    var currentWeatherAPI= "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+APIKey;
    $.ajax({
        url: currentWeatherAPI,
        method:"GET",
    }).then(function(response) {
        console.log(response);
        var weatherIcon= response.weather[0].icon;
        var iconURL="http://openweathermap.org/img/wn/"+weatherIcon+"@2x.png";
        var date=new Date(response.dt*1000).toLocaleDateString();
        $(currentCity).html(response.name + "("+date+")" + "<img scr="+iconURL+">");

        // convert K to F temperature
        var convertedTemp = (response.main.temp - 273.15) * 1.8 + 32;
        $(todaysTemp).html((convertedTemp).toFixed(1)+"&#8457");
        $(todaysHumidity).html(response.main.humidity+ "%");
        var ws = response.wind.speed;
        var windMPH = (ws * 2.237).toFixed(1);
        $(todaysWind).html(windMPH + "MPH");
        
        UVIndex(response.coord.lon, response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            searchedCity=JSON.parse(localStorage.getItem("cityname"));
            console.log(searchedCity);
            if (searchedCity==null){
                searchedCity=[];
                searchedCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(searchedCity));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    searchedCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(searchedCity));
                    addToList(city);
                }
            }
        }
    });
}

function UVIndex(lon, lat){
    var uvAPIURL="https://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat="+lat+"&lon="+lon;
    $.ajax({
            url: uvAPIURL,
            method:"GET"
            }).then(function(response) {
                $(todaysUVindex).html(response.value);
            });
}

function forecast(cityid) {
    var forecastAPIURL = "https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url: forecastAPIURL,
        method: "GET"
    }).then(function(response) {
        for (i = 0; i < 5; i++) {
            var date = new Date((r.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
            var iconCode = response.list[((i + 1) * 8) - 1].weather[0].icon;
            var iconURL = "https://openweathermap.org/img/wn/"+iconCode+"@2x.png";
            var tempInK = response.list[((i + 1) * 8) - 1].main.temp;
            var tempInF = (((tempInK - 273.5) * 1.8) + 32).toFixed(1);
            var humidity = response.list[((i + 1) * 8) - 1].main.humidty;

            $("#date"+i).html(date);
            $("#weatherImg"+i).html("<img src="+iconURL+">");
            $("#tempIndex"+i).html(tempInF + "&#8457");
            $("#humidityIndex"+i).html(humidity + "%");
        }
    });
}

function addToList(cityName) {
    var listEl = $("<li>" + cityName.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", cityName.toUpperCase());
    $(".list-group").append(listEl);
}

function previousCity(e) {
    var liEl = e.target;
    if (e.target.matches("li")) {
        city = liEl.textContent;
        todaysWeather(city);
    }
}

function loadCity() {
    $("ul").empty();
    var searchedCity = JSON.parse(localStorage.getItem("cityname"));
    if (searchedCity !== null) {
        searchedCity = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < searchedCity.length; i++) {
            addToList(searchedCity[i]);
        }
        city = searchedCity[i - 1];
        todaysWeather(city);
    }
}

//button handlers
$("#search-button").on("click",todaysWeather);
$(document).on("click", previousCity);
$(window).on("load", loadCity);
