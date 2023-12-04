const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const currentWeather = document.getElementById("current-weather");
const forcastContainer = document.getElementById("current-weather");
const searchHistory = document.getElementById("search-history");

const apiKey = "96bc4821258c087bd7536d7ca06abf57"
const apiUrl = "https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}"

let searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];


searchButton.addEventListener("click",function() {
    const cityName = cityInput.value.trim();

    if(cityName) {
        //fetch weather data and forcast
    } fetchWeather(cityName);
});

searchHistory.addEventListener('click', function (event) {
    if (event.target.tagName === 'li') {
        const cityName = event.target.textContent;
        fetchWeather(cityName);
    }
});



function fetchWeather(cityName) {
fetch("(`${apiUrl}/weather?q=${cityName}&appid=${apiKey}&units=metric`)")
.then(response => response.JSON())
.then (data => { 
    renderForcastData(data);

    return fetch(`${apiUrl}/forecast?q=${cityName}&appid=${apiKey}&units=metric`);
})

.then(response => response.json())
        .then(data => {
            // Process the forecast data
            renderForecastData(data);
            // Add the city to the search history
            addToSearchHistory(cityName);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}





/*
function renderWeatherData(weatherData) {

    const cityNameElement = document.getElementById("city-name");
    const dateElement = document.getElementById("date");
    const weatherInfoElement = document.getElementById("weather-info"); 

    cityNameElement.textContent = weatherData.name; 

    const currentDate = new Date();
    dateElement.textContent = currentDate.toDateString();

    weatherInfoElement.innerHTML = `
        <p>Temperature: ${weatherData.main.temp}°C</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>
        <p>Wind Speed: ${weatherData.wind.speed} m/s</p>
    `;
}

function renderForcastData(){
const forcastContainer = document.getElementById ("forcast")

// Make loop to run throufh forcast data --> create elemnts for each day ( 5 days )
}


// search history 

function addToSearchHistory() {

    let searchHistoryList = JSON.parse(localStorage.getItem("searchHistory")) || [];


}
*/