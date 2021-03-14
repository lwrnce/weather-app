let city="";

let search = $('#city-input');
let searchButton = $('#search-button');
let clearButton = $('#clear-button');
let currentCity = $('current-city');
let currentTemp = $('#temperature');
let currentHumidity = $('#humidity');
let currentWind = $('#wind-speed');
let currentUVindex = $('#uv-index');

let searchedCity = [];

let APIKey="a0aca8a89948154a4182dcecc780b513";

function displayWeather(e) {
    e.preventDefault();
    if(search.val().trim()!=='') {
        city=search.val().trim();
        currentWeather(city);
    }
};

function currentWeather(city) {
    let openweatherURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:openweatherURL,
        method:"GET",
    }).then(function(r) {
        console.log(r);
        let weatherIcon= r.weather[0].icon;
        let iconURL="https://openweathermap.org/img/wn/"+weatherIcon +"@2x.png";
        let date=new Date(r.dt*1000).toLocaleDateString();
        $(currentCity).html(r.name + "("+date+")" + "<img scr="+iconURL+">");

        let convertedTemp = (r.main.temp - 273.15) * 1.8 + 32;
        $(currentTemp).html((convertedTemp).toFixed(2)+"&#8457");
        $(currentHumidity).html(r.main.humidity+ "%");
        let ws = r.wind.speed;
        let windMPH = (ws * 2.237).toFixed(1);
        $(currentWind).html(windMPH + "MPH");
        currentUVindex(r.coord.lon, r.coord.lat);
        forecast(r.id);
        if(r.cod == 200) {
            searchedCity = JSON.parse(localStorage.getItem("city-name"));
            console.log(searchedCity);
            if (searchedCity == null) {
                searchedCity = [];
                searchedCity.push(city.toUpperCase());
                localStorage.setItem("city-name", JSON.stringify(searchedCity));
                addToList(city);
            }
        }
    });
}

function UVIndex(ln,lt){
    let uvURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvURL,
            method:"GET"
            }).then(function(r){
                $(currentUVindex).html(r.value);
            });
}

function forecast(thisCity) {
    let futureForecastURL = "https://api.openweathermap.org/data/2.5/forecast?id="+thisCity+"&appid="+APIKey;
    $.ajax({
        url: futureForecastURL,
        method: "GET"
    }).then(function(r) {
        for (i = 0; i < 5; i++) {
            let date = new Date((r.list[((i+1) * 8) - 1].dt) * 1000).toLocaleDateString();
            let iconCode = r.list[((i + 1) * 8) - 1].main.temp;
            let iconURL = "https://openweathermap.org/img/wn/"+iconCode+".png";
            let tempInK = r.list[((i + 1) * 8) - 1].main.temp;
            let tempInF = (((tempInK - 273.5) * 1.8) + 32).toFixed(2);
            let humidity = r.list[((i + 1) * 8) - 1].main.humidty;

            $("#date" + i).html(date);
            $("#weather-img" + i).html("<img src="+iconURL+">");
            $("#temp-index" + i).html(tempInF + "&#8457");
            $("#humidity-index" + i).html(humidity + "%");
        }
    });
}

function addToList(c) {
    let listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "listed-city-block");
    $(listEl).attr("date-value", c.toUpperCase());
    $(".listed-city").append(listEl);
}
