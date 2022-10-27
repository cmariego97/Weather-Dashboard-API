// API KEY
var API_KEY = "d91f911bcf2c0f925fb6535547a5ddc9";

// input search form variables
var inputBox = document.querySelector(".input-city-name");
var searchButton = document.querySelector(".search-btn");
var searchArray = JSON.parse(localStorage.getItem("History")) || [];
var searchHistoryButtonContainer = document.querySelector("#searchHx");

// input weather data variables
var currentDay = document.querySelector(".current-date-today");
var currentDate = document.querySelector(".date-today");
var currentImage = document.querySelector(".current-image");
var currentTemp = document.querySelector(".current-temp");
var currentWind = document.querySelector(".current-wind");
var currentHumidity = document.querySelector(".current-humidity");
var currentUv = document.querySelector(".current-uv");
var cardDeck = document.querySelector(".card-deck");

onLoad();

function onLoad() {
    if (searchArray) {
        historyBtn();
    }
}

// search history
function historyBtn() {
    searchHistoryButtonContainer.innerHTML = "";
    for (var i = searchArray.length - 1; i >= 0; i--) {
        var historyBtn = document.createElement("button");
        historyBtn.textContent = searchArray[i];
        historyBtn.setAttribute("class", 'historyBtn');
        historyBtn.setAttribute("value", searchArray[i]);
        historyBtn.onclick = historyBtnClick;
        searchHistoryButtonContainer.append(historyBtn);
    }
}

function historyBtnClick(e) {
    getCurrentWeatherData(e.target.value);
}

// input user search
function userInput() {
    var cityName = inputBox.value;
    getCurrentWeatherData(cityName);

    inputBox.value = "";
}

// displays weather data of city via search input
function getCurrentWeatherData(cityName) {
    console.log(cityName);
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=imperial`
    )
        .then((response) => response.json())
        .then((data) => {
        console.log(data);
        currentDate.innerText = `${cityName} ${timeConvert(data.dt)}`;
        currentImage.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        currentTemp.innerText = `${data.main.temp} °F`;
        currentWind.innerText = `${data.wind.speed} MPH`;
        currentHumidity.innerText = `${data.main.humidity} %`;
        futureForcast(data.coord.lat, data.coord.lon);
        searchHistory(cityName);
        });
}

// gathers data of 5-day forecast of city via search input
function futureForcast(lat, lon) {
    fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${API_KEY}`
    )
        .then((response) => response.json())
        .then((data) => {
        console.log(data);
        showWeather(data);
        });
}

// displays 5-day forecast
function showWeather(data) {
  //clears the upcoming 5-day cards
    cardDeck.innerHTML = "";
    //displays the UV for the current day
    currentUv.innerText = `UV index: ${data.daily[0].uvi}`;


    // UV index color changes depending on value
    document.getElementById("current-uv").style.color = "";
    if (data.daily[0].uvi > 8) {
        document.getElementById("current-uv").style.color = "red";
    } else if (2 < data.daily[0].uvi > 8) {
        document.getElementById("current-uv").style.color = "yellow";
    } else {
        document.getElementById("current-uv").style.color = "green";
    }

  //for loop + create weather card elements for the forecast data
    for (let i = 1; i < 6; i++) {
        var cardContainer = document.createElement("div");
        var cardDataContainer = document.createElement("div");
        var cardImgContainer = document.createElement("div");
        var cardDataInfo = document.createElement("div");
        var cardDate = document.createElement("h5");
        var cardImage = document.createElement("img");
        var cardTemp = document.createElement("p");
        var cardWind = document.createElement("p");
        var cardHumidity = document.createElement("p");

        // adds value to the elements
        cardDate.textContent = `${timeConvert(data.daily[i].dt)}`;
        cardImage.src = `https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`;
        cardTemp.textContent = `Temp: ${data.daily[i].temp.day} °F`;
        cardWind.textContent = `Wind speed: ${data.daily[i].wind_speed} MPH`;
        cardHumidity.textContent = `Humidity: ${data.daily[i].humidity} %`;

        // adds a class list to created elements
        cardContainer.classList.add("card", "card-body", "card-forecast");
        cardDataContainer.classList.add("card-data-container")
        cardImgContainer.classList.add("card-img-content");
        cardDataInfo.classList.add("card-data-info");
        
        // appends elements to children elements
        cardDataInfo.append(cardTemp, cardWind, cardHumidity);
        cardImgContainer.append(cardImage);
        cardDataContainer.append(cardImgContainer, cardDataInfo)
        cardContainer.append(cardDate, cardDataContainer)
        cardDeck.append(cardContainer);
    }
}

// converts the date from unix to our regular format
function timeConvert(date) {
  return new Date(date * 1000).toLocaleDateString("en-US");
}

//search history
function searchHistory(city) {
    if (searchArray.indexOf(city) === -1) {
        searchArray.push(city);
    }

    localStorage.setItem("History", JSON.stringify(searchArray));
    console.log(searchArray);
    historyBtn();
}

searchButton.addEventListener("click", userInput);