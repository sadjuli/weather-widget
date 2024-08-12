import React, { useState } from 'react'
import SearchBar from './components/SearchBar'
import WeatherWidget from './components/WeatherWidget'

import './styles/styles.css'

const API_KEY = '0dcc45bdb290c3adc4f75f9225ee0f4b'

function App() {
    const [city, setCity] = useState('')
    const [mode, setMode] = useState('search')
    const [forecastMode, setForecastMode] = useState('today')
    const [weatherData, setWeatherData] = useState(null)

    const handleSearch = async () => {
      setWeatherData(null)
        if (city) {
            if (forecastMode === 'today') {
                await fetchTodayWeather(city)
            } else {
                await fetchFiveDayForecast(city)
            }
        }
    };

    const fetchTodayWeather = async (city) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
            )
            const data = await response.json()
            setWeatherData(data)
        } catch (error) {
            console.error('Ошибка при получении прогноза на сегодня:', error)
        }
    };

    const fetchFiveDayForecast = async (city) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
            );
            const data = await response.json()
            setWeatherData(data)
        } catch (error) {
            console.error('Ошибка при получении прогноза на 5 дней:', error)
        }
    };

    const handleForecastModeChange = (value) => {
        setForecastMode(value)
        if (mode === 'location') {
          handleGeolocationWeather()
        } else {
          handleGeolocationForecast()
        }
        console.log('forecastMode', forecastMode)
    };

    const handleGeolocationWeather = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherByGeolocation(latitude, longitude)
        }, (error) => {
            console.error('Ошибка при получении геолокации:', error)
        });
        } else {
            console.error('Геолокация не поддерживается вашим браузером')
        }
    }
    const handleGeolocationForecast = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords
            await fetchForecastByGeolocation(latitude, longitude)
        }, (error) => {
            console.error('Ошибка при получении геолокации:', error)
        });
        } else {
            console.error('Геолокация не поддерживается вашим браузером')
        }
    }

    const fetchWeatherByGeolocation = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`
            )
            const data = await response.json()
            setWeatherData(data)
        } catch (error) {
            console.error('Ошибка при получении прогноза по геолокации:', error)
        }
    };
    const fetchForecastByGeolocation = async (latitude, longitude) => {
      try {
          const response = await fetch(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`
          )
          const data = await response.json()
          setWeatherData(data)
      } catch (error) {
          console.error('Ошибка при получении прогноза по геолокации:', error)
      }
  };

  const handleSetMode = (value) => {
    if (value === 'location') {
      setMode(value)
    } else {
      setMode('search')
    }
  }

  const handleSetCity = (value) => {
    if (value) {
      setMode('search')
    }
    setCity(value)
  }

    return (
        <div className='weather'>
          
            <div className="weather-modes">
              <div className={'weather-mode weather-mode--today ' + (forecastMode === 'today' ? 'weather-mode--active' : '') } onClick={() => handleForecastModeChange('today')}>На сегодня</div>
              <div className={'weather-mode weather-mode--forecast ' + (forecastMode === 'today' ? '' : 'weather-mode--active')} onClick={() => handleForecastModeChange('5-day')}>Прогноз на 5 дней</div>
            </div>
            
            <SearchBar
                city={city}
                mode={mode}
                setCity={handleSetCity}
                handleSearch={handleSearch}
                handleSetMode={handleSetMode}
            />
            {weatherData && (
                <WeatherWidget data={weatherData} forecastMode={forecastMode} />
            )}
        </div>
    )
}

export default App