require("dotenv").config()
const apiKey = process.env.API_KEY;
const locButton = document.querySelector('.loc-button');
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const daysList = document.querySelector('.days-list');

// Mapping of weather conditions to codes to icon class names (Depending on openwweather API response)
const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
}

function fetchWeatherData(location) {
    // construct API url with location and API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=imperial`;

    // Fetch weather data from API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
            // Update UI with weather data from today
            console.log(apiUrl);
            const todayWeather= data.list[0].weather[0].description;
            const todayTemperature = `${Math.round(data.list[0].main.temp)}°F`;
            const todayWeatherIconCode = data.list[0].weather[0].icon;

            todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('en', { weekday: 'long'});
            todayInfo.querySelector('span').textContent = new Date().toLocaleTimeString('en', { day: 'numeric', month: 'long', year: 'numeric' });
            todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
            todayTemp.textContent = todayTemperature;

            // Update location and weather description in the "left-info" section

            const LocationElement = document.querySelector('.today-info > div > span');
            LocationElement.textContent = `${data.city.name}, ${data.city.country}`;

            const weatherDescriptionElement = document.querySelector('.today-weather > h3');
            weatherDescriptionElement.textContent = todayWeather;

            // update days list with weather data from today
            const todayPrecipitation = `${data.list[0].pop}%`;
            const todayHumidity = `${data.list[0].main.humidity}%`;
            const todayWindSpeed = `${data.list[0].wind.speed} mph`;

            const dayInfoContainer = document.querySelector('.day-info');
            dayInfoContainer.innerHTML = `
            
            <div>
            <span class="title">PRECIPITATION</span>
        <span class="value">${todayPrecipitation}</span>
            </div>
            <div>
            <span class="title">HUMIDITY</span>
        <span class="value">${todayHumidity}</span>
            </div>
            <div>
            <span class="title">WIND</span>
        <span class="value">${todayWindSpeed}</span>
            </div>
            `;

            // Update the next 4 days weather
            const today = new Date();
            const nextDaysData = data.list.slice(1);

            const uniqueDays = new Set();
            let count = 0;
            daysList.innerHTML = '';
            for(const dayData of nextDaysData) {
                const forecastDate = new Date(dayData.dt_txt);
                const dayAbbreviation = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
                const dayTemp = `${Math.round(dayData.main.temp)}°F`;
                const iconCode = dayData.weather[0];

                // Ensure the day isn't a duplicate
                if(!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()) {
                    uniqueDays.add(dayAbbreviation);
                    daysList.innerHTML += `
                    
                    <li>
                        <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                        <span>${dayAbbreviation}</span>
                        <span class="day-temp">${dayTemp}</span>
                    
                    </li>
                `;
                count++;
            }
            if (count === 4) break;

        };
    }).catch(error => {
        alert(`Error Fetching weather data: ${error}`);
    });
}

// Fetch weather data on document load for default location (Germany)

document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'New York';
    fetchWeatherData(defaultLocation);
});

locButton.addEventListener('click', () => {
    const location = prompt('Please enter a city name');
    if(!location) return;

    fetchWeatherData(location);
})