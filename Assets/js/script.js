// require('dotenv').config();
// DOM OBJECTS &/or GLOBAL VARIABLES
// for user inputs
var userInputEl = document.querySelector("form.input-group.mb-3");
var userCityEl = document.querySelector("input#city-search");
var searchBtnEl = document.querySelector("button#search-button");
// current date
var currentDate = moment().format('MM/DD/YYYY');
var currentDay = moment().format('D');
// for city listing based on search history
var searchHistoryEl = document.querySelector("ul#city-list");
var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
// for current weather stats
var cityStatsEl = document.querySelector("div#city-stats");
var currentCityEl = document.querySelector("h3#city-date");
var currentTempEl = document.querySelector("h5#temp");
var currentHumidityEl = document.querySelector("h5#humidity");
var currentWindEl = document.querySelector("h5#wind");
var currentUvEl = document.querySelector("h5#uv");
// for 5-day forecast stats
var dayTitle = document.getElementsByClassName('day-date');
var dayIcon = document.getElementsByClassName('icon');
var dayTemp = document.getElementsByClassName('temp');
var dayHumidity = document.getElementsByClassName('humidity');
// END GLOBAL VARIABLES

// INPUT FUNCTION gets user input value from form and packages for https request
// add user not found error
var inputHandler = function (event) {
    // prevents browser default behavior of sending input data to URL
    event.preventDefault();

    // get current city search value and remove leading/trailing whitespace
    var userCity = userCityEl.value.trim();

    // check whether there is a value prior to sending https request and clear form value for subsequent searches
    if (userCity) {
        getWeather(userCity);
        saveCity(userCity);
        displayHistory();
        userCityEl.value = '';
    } else {
        alert("Please enter a city into the search form");
    }
};

// FETCH FUNCTION formats and sends api request
var getWeather = function (userCity) {
    // format api urls for both OpenWeather endpoints in order to make multiple api calls at once using promise.all() and array.map() methods learned from the following site: https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/
    var apiUrls = [
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&units=imperial&appid=e4c79656912e2022efd4f848cf4c49dc"),
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "&units=imperial&appid=e4c79656912e2022efd4f848cf4c49dc"),
    ];
    // submit https request
    Promise.all(apiUrls).then(function (responses) {
        // using map() method to get a response array of json objects, 
        return Promise.all(responses.map(function (response) {
            return response.json();
        }))
            .then(function (data) {
                cityStats = data[0];
                forecast = data[1];
                console.log(cityStats);
                console.log(forecast);

                displayCityStats(cityStats)
                displayForecast(forecast)
            })
            // catch alert to catch any network errors
            .catch(function (error) {
                console.log(error);
            });
    });
};

// DISPLAY FUNCTION to pull preserved city list from local storage and update 'searchHistory' array
var displayHistory = function () {
    // clear content
    searchHistoryEl.innerHTML = '';

    // maintain only the number of search history elements in use
    var cityList = 7;
    if (searchHistory.length < 6) {
        cityList = searchHistory.length;
    }

    // loop through 'searchHistory' array to create an element to display each saved city search 
    for (var i = 0; i < cityList; i++) {
        var listEl = document.createElement('li');
        listEl.setAttribute('class', 'list-group-item')
        listEl.textContent = searchHistory[i];
        listEl.onclick = function(event) {
            if (event.target.tagName === 'LI') {
                getWeather(event.target.textContent);
            }
        }
        searchHistoryEl.append(listEl);
    }
};
displayHistory()

// SAVE FUNCTION to preserve each city as item in 'searchHistory' array to local storage
var saveCity = function (userCity) {
    searchHistory.unshift(userCity);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// DISPLAY CITY WEATHER FUNCTION for user-selected city of interest
var displayCityStats = function (cityStats) {
    // clear old content
    currentCityEl.innerHTML = '';
    currentTempEl.innerHTML = '';
    currentHumidityEl.innerHTML = '';
    currentWindEl.innerHTML = '';
    currentUvEl.innerHTML = '';

    // populate container with city weather stats (and country to disambiguate)
    // display city, date and weather icon; guidance located at following site: https://stackoverflow.com/questions/44177417/how-to-display-openweathermap-weather-icon
    currentCity = cityStats.name + ", " + cityStats.sys.country;
    var weatherIcon = "https://openweathermap.org/img/wn/" + cityStats.weather[0].icon + "@2x.png";
    currentCityEl.innerHTML = "<span id='city-line'>" + currentCity + " (" + currentDate + ")"
        + "<img src=" + weatherIcon + " alt='weather icon' /></span>";

    // temp element
    currentTempEl.textContent = "Temperature: " + cityStats.main.temp + "℉";
    // humidity element
    currentHumidityEl.textContent = "Humidity: " + cityStats.main.humidity + "%";
    // wind-speed element
    currentWindEl.textContent = "Wind speed: " + cityStats.wind.speed + " miles/hour";
    // UV-index element; warning values based on information accessed at https://www.epa.gov/sunsafety/uv-index-scale-0
    fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + cityStats.coord.lat +
        "&lon=" + cityStats.coord.lon + "&appid=e4c79656912e2022efd4f848cf4c49dc")
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            uvIndex = parseFloat(response.value);
            if (uvIndex <= 2) {
                currentUvEl.innerHTML = "<span id='low'> UV Index: " + uvIndex + "</span>";
            }
            else if (uvIndex <= 8) {
                currentUvEl.innerHTML = "<span id='med-high'> UV Index: " + uvIndex + "</span>";
            }
            else {
                currentUvEl.innerHTML = "<span id='severe'> UV Index: " + uvIndex + "</span>";
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

// function needed to display 5-day forecast
var displayForecast = function (forecast) {
    // a loop to represent each of 5 days
    for (var i = 0; i < dayTitle.length; i++) {
        //clear old content
        dayTitle[i].textContent = '';
        dayIcon[i].textContent = '';
        dayTemp[i].textContent = '';
        dayHumidity[i].textContent = '';
        // looping through all 40 datapoints from the 5-day forecast data
        for (var j = 0; j < 40; j++) {
            day = parseInt(currentDay) + 1;
            hourDatum = forecast.list[j].dt_txt.substring(11)
            dayDatum = parseInt(forecast.list[j].dt_txt.substring(8, 10))
            // look for noontime data
            if (hourDatum === "12:00:00" && day + i === dayDatum) {
                // display date
                dayTitle[i].textContent = forecast.list[j].dt_txt.substring(0, 11);
                // display weather icon
                var fiveDayIcon = "https://openweathermap.org/img/wn/" + forecast.list[j].weather[0].icon + ".png";
                dayIcon[i].innerHTML = "<span id='5day-icon'><img src=" + fiveDayIcon + " alt='weather icon' /></span>";
                //display temperature
                dayTemp[i].textContent = "Temperature: " + forecast.list[j].main.temp + "℉";
                //display humidity
                dayHumidity[i].textContent = "Humidity: " + forecast.list[j].main.humidity + "%";
                break;
            }
        }
    }
}

// submit event listener on input form group
userInputEl.addEventListener("submit", inputHandler);