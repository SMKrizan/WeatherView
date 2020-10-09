// DOM OBJECTS &/or GLOBAL VARIABLES
var userInputEl = document.querySelector("form.input-group.mb-3");
var userCityEl = document.querySelector("input#city-search");
var searchBtnEl = document.querySelector("button#search-button");

var searchHistoryEl = document.querySelector("ul#city-list");
// var searchHistory = [];
var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

var currentDate = moment().format('MM/DD/YYYY');

var cityStatsEl = document.querySelector("div#city-stats");
var currentCityEl = document.querySelector("h3#city-date");

var currentForecastEl = document.querySelector("div#forecast");
var forecastDay1El = document.querySelector("div#day1");
var forecastDay2El = document.querySelector("div#day2");
var forecastDay3El = document.querySelector("div#day3");
var forecastDay4El = document.querySelector("div#day4");
var forecastDay5El = document.querySelector("div#day5");

// INPUT FUNCTION gets user input value from form and packages for http request
    // be sure to include user not found error
var inputHandler = function(event) {
    // prevents browser default behavior of sending input data to URL
    event.preventDefault();

    // get current city search value and remove leading/trailing whitespace
    var userCity = userCityEl.value.trim();

    // check whether there is a value prior to sending http request and clear form value for subsequent searches
    if (userCity) {
        getWeather(userCity);
        saveCity(userCity);
        userCityEl.value = '';
    } else {
        alert("Please enter a city into the search form");
    }

    saveCity(userCity)
};
    
// FETCH FUNCTION formats and sends api request
    // include catch alert for any network errors
var getWeather = function(userCity) {
    // format api urls for both OpenWeather endpoints in order to make multiple api calls at once using promise.all() and array.map() methods learned from the following site: https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/
    var apiUrls = [
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&units=imperial&appid=e4c79656912e2022efd4f848cf4c49dc"),
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "&units=imperial&appid=e4c79656912e2022efd4f848cf4c49dc")
    ];
    // submit http request
    Promise.all(apiUrls).then(function(responses) {
        // using map() method to get a response array of json objects, 
        return Promise.all(responses.map(function(response) {
            return response.json();
        }))
        .then(function(data) {
            displayCityStats(data, userCity)
            displayForecast(data, userCity)
            console.log(data);
        }) 
        .catch(function(error) {
            console.log(error);
        });
    });

};

// use input to display data to page -TEST
// be sure to clear old content - TEST

// DISPLAY FUNCTION to pull preserved city list from local storage and update 'searchHistory' array
var displayHistory = function() {
    // loop through 'searchHistory' array to create an element for each saved city search 
    for (var i=0; i<searchHistory.length; i=i+2) {
        var listEl = document.createElement('li');
        listEl.textContent = searchHistory[i];
        searchHistoryEl.append(listEl);
    }


};
displayHistory()

// SAVE FUNCTION to preserve each city as item in 'searchHistory' array to local storage
var saveCity = function(userCity) {  
    searchHistory.push(userCity);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// function needed to preserve cities in local storage and display using links or buttons
    // convert(?) stored city names to a list of http requests using for-loop
    // create <a> containers w. href for each city name saved to local storage
    // use query parameter to extract the needed search string for forming the http request, possibly using split() method e.g. string.split('=') plus the index of resulting info
var displaySearchHistory = function(searchHistory) {
    
    console.log(searchHistory);
}

// function needed to display city of interest
    // loop through each desired data object to display (city name, date, weather conditions icon, temperature, humidity, wind speed, UV index)
    // use else/if statements to color-code UV index to favorable/moderate/severe
var displayCityStats = function(cityWeather, userCity) {

    //clear old content
    currentCityEl.textContent = '';

        }

// function needed to display 5-day forecast
    // 5-day forcast presents date, weather conditions icon, temperature, humidity
var displayForecast = function(city5day, userCity) {
    
    //clear old content
    forecastDay1El.innerHTML = '';
    forecastDay2El.innerHTML = '';
    forecastDay3El.innerHTML = '';
    forecastDay4El.innerHTML = '';
    forecastDay5El.innerHTML = '';

    console.log(city5day);
    console.log(userCity);
}

// create global variables to reference input group div, input element, submit button

// error handling - be sure to include this for all display functions above
    // to handle empty string
    // to handle incorrectly spelled location

// submit event listener on input form group
userInputEl.addEventListener("submit", inputHandler);
// searchBtnEl.addEventListener("click", inputHandler);
    

