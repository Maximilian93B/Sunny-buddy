const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const currentWeather = document.getElementById("current-weather");
const forecastContainer = document.getElementById("forecast-container");
const searchHistory = document.getElementById("search-history");


const apiKey = "03bc0063493c0df8066d1942fcacc8f2";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast";
const iconUrl = `https://openweathermap.org/img/wn/10d@2x.png`;


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
    fetch(`${weatherApiUrl}?q=${cityName}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            console.log("Current Weather Data (JSON):", JSON.stringify(data, null, 2)); 
            renderWeatherData(data);
            return fetch(`${forecastApiUrl}?q=${cityName}&appid=${apiKey}&units=metric`);
        })
        .then(response => response.json())
        .then(data => {
            console.log("5 Day Weather Data (JSON):", JSON.stringify(data, null, 2)); 
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
    const currentDate = new Date();
    dateElement.textContent = currentDate.toDateString();

    weatherInfoElement.innerHTML = 
        `<p>Temperature: ${weatherData.main.temp}°C</p>` +
        `<p>Humidity: ${weatherData.main.humidity}%</p>` +
        `<p>Wind Speed: ${weatherData.wind.speed} m/s</p>`;
}

function renderForecastData(forecastData) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; // Clear previous forecast data

    // Object to hold the first forecast of each day
    const dailyForecast = {};

    forecastData.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
        const iconUrl = `http://openweathermap.org/img/wn/{forecast.weather[0].icon}.png`;

        // If this day hasn't been processed use this forecast as the day's representative
        if (!dailyForecast[day]) {
            dailyForecast[day] = forecast;
        }
    });

    // Limit to 5 days
    const days = Object.keys(dailyForecast).slice(0, 5);

    // Create a card for each of the first 5 days
    days.forEach(day => {
        const forecast = dailyForecast[day];
        const forecastElement = document.createElement('div');
        forecastElement.className = 'forecast-card';

        forecastElement.innerHTML = `
            <div class="card">
                <div class="card-body">
                <img src="${iconUrl}" alt="Weather Icon" class="weather-icon">

                    <h5 class="card-title">${new Date(forecast.dt * 1000).toDateString()}</h5>
                    <p class="card-text">Temperature: ${forecast.main.temp}°C</p>
                    <p class="card-text">Humidity: ${forecast.main.humidity}%</p>
                    <p class="card-text">Wind: ${forecast.wind.speed} m/s</p>
                    <!-- Add more weather details as needed -->
                </div>
            </div>
        `;

        forecastContainer.appendChild(forecastElement);
    });
}


function addToSearchHistory(cityName) {
    if (!searchHistoryList.includes(cityName)) {
        searchHistoryList.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistoryList));
        updateSearchHistoryUI();
    }
}

function updateSearchHistoryUI() {
    const searchHistoryContainer = document.getElementById('search-history');
    searchHistoryContainer.innerHTML = ''; // Clear existing items

    searchHistoryList.forEach(city => {
        const cityElement = document.createElement('li');
        cityElement.textContent = city;
        searchHistoryContainer.appendChild(cityElement);
    });
}

function loadSearchHistory() {
    searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];
    updateSearchHistoryUI();
}

// Call this function when the page loads
loadSearchHistory();
