// OpenWeather One Call API key
// var owmAPIkey = "68c768c77ec3722ab224406a53e005ab";
// API key
var API_KEY = "d91f911bcf2c0f925fb6535547a5ddc9";

// search form variables
var inputBox = document.getElementById('input-city-name');
var searchBtn = document.getElementById('search-btn');

// search city
function userInput() {
    var cityName = inputBox.value;
    getWeatherData(cityName);
}

// weather data variables
var dateToday = document.getElementById('current-date');
var imgEl = document.getElementById('current-date');
var tempNow = document.getElementById('current-temp');
var windNow = document.getElementById('current-wind');
var humidityNow = document.getElementById('current-humidity');

// display weather data from city search
function getWeatherData(cityName) {
    console.log(cityName);
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=imperial`
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            dateToday.innerText = `${cityName} ${timeConvert(data.dt)})`;
            imgEl.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            tempNow.innerText = `${data.main.temp} °F`;
            windNow.innerText = `${data.wind.speed} MPH`;
            humidityNow.innerText = `${data.main.humidity} %`;
            
            weatherForecast(data.coord.lat, data.coord.lon);
            searchHistory(cityName);
        });
}

// collect future forecast data for the rest of the week
function weatherForecast(lat, lon) {
    fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${API_KEY}`
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            showForecast(data);
        });
}

// display forecast data
function showForecast(data) {
    // empty cards
    cardDeck.innerHTML = "";

    // displays UV index
    uvNow.innerText = `UV index: ${data.daily[0].uvi}`;

    // colors based on UV index no.
    if (data.daily[0].uvi > 8) {
        document.getElementById('current-uv')
    }
}