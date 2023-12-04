const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const currentWeather = document.getElementById("current-weather");
const forcastContainer = document.getElementById("current-weather");
const searchHistory = document.getElementById("search-history");

const apiKey = "96bc4821258c087bd7536d7ca06abf57"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}"


let searchHistoryList = JSON.parse(localStorage.getItem ("search-history") || [] );

searchButton.addEventListener("click",function() {
    const cityName = cityInput.value.trim();

    if(cityName) {
        //fetch weather data and forcast
    } fetchWeather(cityName);
});

function fetchWeather(cityName) {
fetch("(`${apiUrl}/weather?q=${cityName}&appid=${apiKey}&units=metric`)")
.then(response => response.JSON())
.then (data => { 
    renderForcastData(data);

    addToSearchHistory(cityName);
})
.catch(error => console.error("Error fetching weather data:",error));
}

