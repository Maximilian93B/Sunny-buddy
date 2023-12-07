const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const currentWeather = document.getElementById("current-weather");
const forecastContainer = document.getElementById("forecast-container");
const searchHistory = document.getElementById("search-history");

const apiKey = "903bc0063493c0df8066d1942fcacc8f2";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=903bc0063493c0df8066d1942fcacc8f2"; 

let searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];

searchButton.addEventListener("click", function () {
    const cityName = cityInput.value.trim();

    if (cityName) {
        fetchWeather(cityName);
    }
});

searchHistory.addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
        const cityName = event.target.textContent;
        fetchWeather(cityName);
    }
});

function fetchWeather(cityName) {
    fetch(`${apiUrl}?q=${cityName}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            renderWeatherData(data);
            return fetch(`${apiUrl}/forecast?q=${cityName}&appid=${apiKey}&units=metric`);
        })
        .then(response => response.json())
        .then(data => {
            renderForecastData(data);
            addToSearchHistory(cityName);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function renderWeatherData(weatherData) {
    const cityNameElement = document.getElementById("city-name");
    const dateElement = document.getElementById("date");
    const weatherInfoElement = document.getElementById("weather-info");

    cityNameElement.textContent = weatherData.name;

    const currentDate = new Date()
    dateElement.textContent = currentDate.toDateString();
    
    weatherInfoElement.innerHTML = 
    "<p>Temperature: ${weatherData.main.temp}°C</p>"
    "<p>Humidity: ${weatherData.main.humidity}%</p>"
    "<p>Wind Speed: ${weatherData.wind.speed} m/s</p>"
}

    
    
    // Implement the rendering of current weather data




function renderForecastData(forecastData) {
    const renderForecastData = document.getElementById 
    // Implement the rendering of forecast data
}

function addToSearchHistory(cityName) {
    // Implement adding to search history
}
