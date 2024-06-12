document.addEventListener('DOMContentLoaded', () => {
    const weatherForm = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const weatherResult = document.getElementById('weather-result');
    const weatherIcon = document.getElementById('weather-icon');
    const pressure = document.getElementById('pressure');
    const visibility = document.getElementById('visibility');
    const uvIndex = document.getElementById('uv-index');
    const addFavoriteButton = document.getElementById('add-favorite');
    const favoritesList = document.getElementById('favorites-list');
	const forecastResult = document.getElementById('forecast-result');

    const apiKey = 'ebcda15349a2ff963f2be8e8cd6cd0a9';

    const getWeather = async (city) => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        return data;
    };
	
	const getForecast = async (city) => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        return data;
    };
	
	const displayWeather = (data) => {
        if (data.cod === "404") {
            weatherResult.innerHTML = `<p>City not found</p>`;
            forecastResult.innerHTML = '';
            weatherIcon.classList.add('hidden');
        } else {
            weatherResult.innerHTML = `
                <h3>${data.name}</h3>
				<img id="weather-icon" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
                <p>${data.weather[0].description}</p>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind speed: ${data.wind.speed} m/s</p>
				<p>Pressure: ${data.main.pressure} hPa</p>
                <p>Visibility: ${data.visibility || 'N/A'} meters</p>
                <p>UV Index: ${data.uvi || 'N/A'}</p>
            `;

            addFavoriteButton.onclick = () => addFavorite(data.name);
        }
    };
	
	const displayForecast = (data) => {
        if (data.cod === "404") {
            forecastResult.innerHTML = '';
        } else {
            let forecastHTML = '';
            for (let i = 0; i < data.list.length; i += 8) {
                const forecast = data.list[i];
                forecastHTML += `
                    <div class="forecast-day">
                        <p>${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                        <p>${forecast.weather[0].description}</p>
                        <p>Temp: ${forecast.main.temp}°C</p>
                        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather icon">
                    </div>
                `;
            }
            forecastResult.innerHTML = forecastHTML;
        }
    };
	
	weatherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = cityInput.value;
        const weatherData = await getWeather(city);
        displayWeather(weatherData);
		const forecastData = await getForecast(city);
        displayForecast(forecastData);
    });
	
	    window.addFavorite = (city) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.includes(city)) {
            favorites.push(city);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            displayFavorites();
        }
    };

    window.deleteFavorite = (city) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(fav => fav !== city);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    };

    const displayFavorites = () => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesList.innerHTML = '';
        favorites.forEach(city => {
            let li = document.createElement('li');
            li.innerHTML = `${city} <button class="delete-btn" onclick="deleteFavorite('${city}')">x</button>`;
            li.onclick = () => {
                cityInput.value = city;
                weatherForm.dispatchEvent(new Event('submit'));
            };
            favoritesList.appendChild(li);
        });
    };
	
	displayFavorites();
	
});