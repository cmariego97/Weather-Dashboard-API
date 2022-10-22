// OpenWeather One Call API key
// var owmAPIkey = "68c768c77ec3722ab224406a53e005ab";
// API key
var API_KEY = "68c768c77ec3722ab224406a53e005ab";

// when page loads
onPageLoad()

function onPageLoad() {
    if (searchArray) {
        historyBtn();
    }
}

// display date
function displayDate(data) {
    return new Date(date * 1000).toLocaleDateString("en-US");
}

// search form variables
var inputBox = document.getElementById('input-city-name');
var searchBtn = document.getElementById('search-btn');

// search city
function userInput() {
    var cityName = inputBox.value;
    getWeatherDataNow(cityName);
}

// creates search history button
var searchHistoryBtn = document.createElement("button");

function historyBtn() {
    searchHistoryBtnContainer.innerHTML= "";
    for (var i = searchArray.length - 1; i >= 0; i--) {
        searchHistoryBtn.textContent = searchArray[i];
        searchHistoryBtn.setAttribute = ("id", "search-hx-btn"); 
        searchHistoryBtn.setAttribute = ("class", "history-btn btn bg-primary");
        searchHistoryBtn.setAttribute = ("value", searchArray[i]);
        
        // on click - get weather data
        searchHistoryBtn.onClick = historyBtnClick;
        searchHistoryBtnContainer.append(searchHistoryBtn);
    }
}

function historyBtnClick(e) {
    getWeatherDataNow(e.target.value);
}

// displays search history
function citySearchHistory(city) {
    if (searchArray.indexOf(city) === -1) {
        searchArray.push(city);
    }

    // local storage
    localStorage.setItem("Search History", JSON.stringify(searchArray));
    console.log(searchArray);
    searchHistoryBtn();
}

// search button event listeners
searchBtn.addEventListener("click", userInput);

// weather data variables
var dateToday = document.getElementById('current-date');
var imgEl = document.getElementById('current-date');
var tempNow = document.getElementById('current-temp');
var windNow = document.getElementById('current-wind');
var humidityNow = document.getElementById('current-humidity');

// display weather data from city search
function getWeatherDataNow(cityName) {
    console.log(cityName);
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=imperial`
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            dateToday.innerText = `${cityName} ${displayDate(data.dt)})`;
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
    var weatherCardDeck = document.getElementById('weather-forecast-deck');
    weatherCardDeck.innerHTML = "";

    // displays UV index
    uvNow.innerText = `UV index: ${data.daily[0].uvi}`;

    // colors based on UV index no.
    document.getElementById('current-uv').style.color = "";
    if (data.daily[0].uvi > 8) {
        document.getElementById('current-uv').style.color = "red";
    } else if (2 < data.daily[0].uvi > 8) {
        document.getElementById('current-uv').style.color = "yellow";
    } else {
        document.getElementById('current-uv').style.color = "green";
    }

    // create weather card for HTML
    for (let i = 1; i <6; i++) {

        // create weather card HTML variables 
        var weatherCardContainer = document.createElement("div");
        var weatherCardDate = document.createElement("h5");
        var weatherCardImg = document.createElement("img");
        var weatherCardTemp = document.createElement("p");
        var weatherCardWind = document.createElement("p");
        var weatherCardHumidity = document.createElement("p");

        // create text content for weather card
        weatherCardDate.textContent = `Date: ${displayDate(data.daily[i].dt)}`;
        weatherCardImg.src = `https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`;
        weatherCardTemp.textContent = `Temp: ${data.daily[i].temp.day} °F`;
        weatherCardWind.textContent = `Wind Speed: ${data.daily[i].wind_speed} MPH`;
        weatherCardHumidity.textContent = `Humidity: ${data.daily[i].humidity} %`;

        weatherCardContainer.classList.add("card", "card-body");

        // append text content to container
        weatherCardContainer.append(weatherCardDate, weatherCardImg, weatherCardTemp, weatherCardWind, weatherCardHumidity);

        weatherCardDeck.append(weatherCardContainer);
    }
}