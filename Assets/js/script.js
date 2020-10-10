// DOM OBJECTS &/or GLOBAL VARIABLES
// for user inputs
var userInputEl = document.querySelector("form.input-group.mb-3");
var userCityEl = document.querySelector("input#city-search");
var searchBtnEl = document.querySelector("button#search-button");
// current date
var currentDate = moment().format('MM/DD/YYYY');
// for city listing based on search history
var searchHistoryEl = document.querySelector("ul#city-list");
var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
// for city weather stats
var cityStatsEl = document.querySelector("div#city-stats");
var currentCityEl = document.querySelector("h3#city-date");
var currentTempEl = document.querySelector("h4#temp");
var currentHumidityEl = document.querySelector("h5#humidity");
var currentWindEl = document.querySelector("h5#wind");
var currentUvEl = document.querySelector("h5#uv");
// for 5-day forecast stats
var currentForecastEl = document.querySelector("div#forecast");
var day1 = document.querySelector("div#day1");
var day2 = document.querySelector("div#day2");
var day3 = document.querySelector("div#day3");
var day4 = document.querySelector("div#day4");
var day5 = document.querySelector("div#day5");
// END GLOBAL VARIABLES

// INPUT FUNCTION gets user input value from form and packages for http request
// be sure to include user not found error
var inputHandler = function (event) {
    // prevents browser default behavior of sending input data to URL
    event.preventDefault();

    // get current city search value and remove leading/trailing whitespace
    var userCity = userCityEl.value.trim();

    // check whether there is a value prior to sending http request and clear form value for subsequent searches
    if (userCity) {
        getWeather(userCity);
        saveCity(userCity);
        displayHistory();
        userCityEl.value = '';
    } else {
        alert("Please enter a city into the search form");
    }

    // saveCity(userCity)
};

// FETCH FUNCTION formats and sends api request
// include catch alert for any network errors
var getWeather = function (userCity) {
    // format api urls for both OpenWeather endpoints in order to make multiple api calls at once using promise.all() and array.map() methods learned from the following site: https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/
    var apiUrls = [
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&units=imperial&appid=e4c79656912e2022efd4f848cf4c49dc"),
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "&units=imperial&appid=e4c79656912e2022efd4f848cf4c49dc"),
    ];
    // submit http request
    Promise.all(apiUrls).then(function (responses) {
        // using map() method to get a response array of json objects, 
        return Promise.all(responses.map(function (response) {
            return response.json();
        }))
            .then(function (data) {
                cityStats = data[0];
                forecast = data[1];

                displayCityStats(cityStats)
                displayForecast(forecast)
                console.log(forecast);
            })
            .catch(function (error) {
                console.log(error);
            });
    });
};

// DISPLAY FUNCTION to pull preserved city list from local storage and update 'searchHistory' array
// function needed to preserve cities in local storage and display using links or buttons
// create <a> containers w. href for each city name saved to local storage
// use query parameter to extract the needed search string for forming the http request, possibly using split() method e.g. string.split('=') plus the index of resulting info
var displayHistory = function () {
    // clear content
    searchHistoryEl.innerHTML = '';

    // maintain only the number of search history elements in use
    var loopLength = 13;
    if (searchHistory.length < 12) {
        loopLength = searchHistory.length;
    }

    // loop through 'searchHistory' array to create an element to display each saved city search 
    for (var i = 0; i < loopLength; i++) {
        var listEl = document.createElement('li');
        listEl.setAttribute('class', 'list-group-item')
        listEl.textContent = searchHistory[i];
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
    var weatherIcon = "http://openweathermap.org/img/wn/" + cityStats.weather[0].icon + "@2x.png";
    currentCityEl.innerHTML = "<span id='city-line'>" + currentCity + " (" + currentDate + ")"
        + "<img src=" + weatherIcon + " alt='weather icon' /></span>";

    // temp element
    currentTempEl.textContent = "Temperature: " + cityStats.main.temp + "℉";

    // humidity element
    currentHumidityEl.textContent = "Humidity: " + cityStats.main.humidity + "%";

    // wind-speed element
    currentWindEl.textContent = "Wind speed: " + cityStats.wind.speed + " miles/hour";

    // UV-index element; warning values based on information accessed at https://www.epa.gov/sunsafety/uv-index-scale-0
    fetch("http://api.openweathermap.org/data/2.5/uvi?lat=" + cityStats.coord.lat +
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
// 5-day forcast presents date, icon, temperature, humidity
var displayForecast = function (forecast) {
    //clear old content
    day1.innerHTML = '';
    day2.innerHTML = '';
    day3.innerHTML = '';
    day4.innerHTML = '';
    day5.innerHTML = '';

    // display day 1 forecast
    day1date = forecast.list[0].dt_txt.substring(0, 11);
    day1.



    console.log();

}

// create global variables to reference input group div, input element, submit button

// error handling - be sure to include this for all display functions above
// to handle empty string
// to handle incorrectly spelled location

// submit event listener on input form group
userInputEl.addEventListener("submit", inputHandler);
// searchBtnEl.addEventListener("click", inputHandler);


