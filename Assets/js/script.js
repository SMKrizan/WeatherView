// set-up and text linkages between html/js/style

// determine and TEST endpoint for API calls to openWeather
    // openWeatherAPI_key: e4c79656912e2022efd4f848cf4c49dc
    // ex: https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=YOUR_API_KEY
    // 5-day ex: api.openweathermap.org/data/2.5/forecast?q={city name},{state code}&appid={API key}
    
// develop getWeather = function fetch API request in the form of JSON data - TEST
    // set up request to take user input (getWeather - function(userCity)) - TEST
    // be sure to include user not found error
    // include catch alert for any network errors

// use input to display data to page -TEST

// include error handling

// create global variables to reference input group div, input element, submit button

// searchSubmitHandler = function(event) - to be executed upon input submission
    // get value from input element and send to get weather function - TEST

// add submit event listener at bottom of page on input group div element TEST

// check the container ids for the gathered inputs to be displayed within (citySearch, 5-day, history)
    // create global variables to reference the dynamic content elements

// develop function/s that will take in location data as a parameter

// create function to display weather displayWeather = function(queryInput, searchTerms)
    // be sure to clear old content - TEST

// function needed to display city of interest
    // loop through each desired data object to display (city name, date, weather conditions icon, temperature, humidity, wind speed, UV index)
    // use else/if statements to color-code UV index to favorable/moderate/severe

// function needed to display 5-day forecast
    // 5-day forcast presents date, weather conditions icon, temperature, humidity

// function needed to preserve cities in local storage(?) and display within history
    // convert(?) stored city names to a list of http requests using for-loop
    // create <a> containers w. href for each city name saved to local storage
    // use query parameter to extract the needed search string for forming the http request, possibly using split() method e.g. string.split('=') plus the index of resulting info

// error handling - be sure to include this for all display functions above
    // to handle empty string
    // to handle incorrectly spelled location
    

