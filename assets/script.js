const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const currentWeather = document.getElementById("current-weather");
const forecastContainer = document.getElementById("forecast-container");
const searchHistory = document.getElementById("search-history");

const apiKey = "03bc0063493c0df8066d1942fcacc8f2";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast";

// local storage for saved ctities
let searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];

searchButton.addEventListener("click", function () {
    const cityName = cityInput.value.trim();
         if (cityName) {
            fetchWeather(cityName);
    }
});

searchHistory.addEventListener('click', function (event) {
    if (event.target.tagName === 'Li') {
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

function renderForecastData(forecastData) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; // Clear previous forecast data

    const dailyForecast = {};
    
    // Genereate forcast data 
    
    forecastData.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
        
        if (!dailyForecast[day]) {
            dailyForecast[day] = {
                temps: [],
                humidity: [],
                windSpeeds: [],
                icon: forecast.weather[0].icon
            };
        }

        dailyForecast[day].temps.push(forecast.main.temp);
        dailyForecast[day].humidity.push(forecast.main.humidity);
        dailyForecast[day].windSpeeds.push(forecast.wind.speed);
    });
            
            // only for 5 days 
    const days = Object.keys(dailyForecast).slice(0, 5);

     // Data for each day 
    days.forEach(day => {
        const dayData = dailyForecast[day];
        const avgTemp = calculateAverage(dayData.temps);
        const avgHumidity = calculateAverage(dayData.humidity);
        const avgWindSpeed = calculateAverage(dayData.windSpeeds);
        const iconUrl = `http://openweathermap.org/img/wn/${dayData.icon}.png`;

        const forecastElement = document.createElement('div');
        forecastElement.className = 'forecast-card';
    
        //display data 
    
        forecastElement.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <img src="${iconUrl}" alt="Weather Icon" class="weather-icon">
                    <h5 class="card-title">${new Date(day).toDateString()}</h5>
                    <p class="card-text">Avg. Temperature: ${avgTemp.toFixed(1)}°C</p>
                    <p class="card-text">Avg. Humidity: ${avgHumidity.toFixed(1)}%</p>
                    <p class="card-text">Avg. Wind Speed: ${avgWindSpeed.toFixed(1)} m/s</p>
                </div>
            </div>
        `;

        forecastContainer.appendChild(forecastElement);
    });
}


// formula to calcualte average of each varaivble (const)
function calculateAverage(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function addToSearchHistory(cityName) {
    if (!searchHistoryList.includes(cityName)) {
        searchHistoryList.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistoryList));
        updateSearchHistoryUI();
    }
}


 // Render displayed data onto cards. Probably could have put into one function but wanted to seperate.
function renderWeatherData(weatherData) {
   
    const currentWeatherContainer = document.getElementById('current-weather');
    currentWeatherContainer.innerHTML = `
        <h2>${weatherData.name}</h2>
        <p><strong>Temperature:</strong> ${weatherData.main.temp}°C</p>
        <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${weatherData.wind.speed} m/s</p>
        <p><strong>Weather Condition:</strong> ${weatherData.weather[0].main}</p>
    `;
    
}


 // Update search history for new input 

 function updateSearchHistoryUI() {
    const searchHistoryContainer = document.getElementById('search-history');
    searchHistoryContainer.innerHTML = ''; // Clear existing items

    searchHistoryList.forEach(city => {
        const cityElement = document.createElement('li');
        cityElement.textContent = city;
        searchHistoryContainer.appendChild(cityElement);
    });
}

 // load search history from local storage when page loads 

 function loadSearchHistory() {
    searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];
    updateSearchHistoryUI();
}

loadSearchHistory();

 // Modal 

 // Get the modal
var modal = document.getElementById("welcomeModal");
var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    modal.style.display = "none";
}

// Open the modal when the page loads
window.onload = function() {
    modal.style.display = "block";
}

// Close the modal 
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


