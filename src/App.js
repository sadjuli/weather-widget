import React, { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import WeatherWidget from './components/WeatherWidget'
import ForecastWidget from './components/ForecastWidget'

import './styles/styles.css'

const API_KEY = '0dcc45bdb290c3adc4f75f9225ee0f4b'

function App() {
    const [city, setCity] = useState('')
    const [state, setState] = useState('today')
    const [mode, setMode] = useState('location')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    
    const [weatherData, setWeatherData] = useState(null)
    const [forecastData, setForecastData] = useState(null)

    const fetchGeoWeather = () => {
        if (state === 'today') {
            handleTodayGeoWeather()
        } else {
            handleForecastGeoWeather()
        }
    }
    const fetchWeather = () => {
        if (!city) {
            return
        }
        if (state === 'today') {
            fetchTodayWeather(city)
        } else {
            fetchForecastWeather(city)
        }
    }

    const fetchTodayWeather = async (city) => {
        setError('')
        setLoading(true)
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
            )
            const data = await response.json()
            if (data.cod == 200) {                
                setWeatherData(data)
            } else if (data.cod == 404) {
                setWeatherData(null)
                setError('Город не найден')
            } else {
                setWeatherData(null)
                setError('Произошла ошибка при получении прогноза на сегодня')
            }
            setLoading(false)
        } catch (error) {
            console.error('Ошибка при получении прогноза на сегодня:', error)
            setLoading(false)
        }
    };
    const fetchForecastWeather = async (city) => {
        setError('')
        setLoading(true)
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
            );
            const data = await response.json()
            if (data.cod == 200) {
                setForecastData(data)
            } else if (data.cod == 404) {
                setForecastData(null)
                setError('Город не найден')
            } else {
                setForecastData(null)
                setError('Произошла ошибка при получении прогноза на 5 дней')
            }
            setLoading(false)
        } catch (error) {
            console.error('Ошибка при получении прогноза на 5 дней:', error)
            setLoading(false)
        }
    };

    const handleTodayGeoWeather = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                await fetchTodayGeoWeather(latitude, longitude)
            }, (error) => {
                console.error('Ошибка при получении геолокации:', error)
            });
        } else {
            console.error('Геолокация не поддерживается вашим браузером')
        }
    }
    const handleForecastGeoWeather = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords
                await fetchForecastGeoWeather(latitude, longitude)
            }, (error) => {
                console.error('Ошибка при получении геолокации:', error)
            });
        } else {
            console.error('Геолокация не поддерживается вашим браузером')
        }
    }
    const fetchTodayGeoWeather = async (latitude, longitude) => {
        setError('')
        setLoading(true)
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`
            )
            const data = await response.json()
            if (data.cod == 200) {
                setWeatherData(data)
            } else {
                setError('Произошла ошибка при получении прогноза по геолокации')
            }
            setLoading(false)
        } catch (error) {
            console.error('Ошибка при получении прогноза по геолокации:', error)
            setLoading(false)
        }
    };
    const fetchForecastGeoWeather = async (latitude, longitude) => {
        setError('')
        setLoading(true)
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`
            )
            const data = await response.json()
            if (data.cod == 200) {
                setForecastData(data)
            } else {
                setError('Произошла ошибка при получении прогноза по геолокации')
            }
            setLoading(false)
        } catch (error) {
            console.error('Ошибка при получении прогноза по геолокации:', error)
            setLoading(false)
        }
    };

    const handleSearch = async () => {
        if (!city) {
            setMode('location')
        } else {
            handleSetMode('search')
        }
    }

    const handleSetMode = (value) => {
        if (value === mode) {
            fetchWeather()
        } else {
            setMode(value)
        }
    }

    useEffect(() => {
        fetchGeoWeather()
    }, [])

    useEffect(() => {
        if (mode === 'location') {
            fetchGeoWeather()
          } else {
            fetchWeather()
          }
    }, [state])

    useEffect(() => {
        if (mode === 'location') {
            setCity('')
            fetchGeoWeather()
        } else {
            fetchWeather()
        }
    }, [mode])

    return (
        <div className='weather'>
          
            <div className="weather-modes">
              <div className={'weather-mode weather-mode--today ' + (state === 'today' ? 'weather-mode--active' : '') } onClick={() => setState('today')}>На сегодня</div>
              <div className={'weather-mode weather-mode--forecast ' + (state === 'today' ? '' : 'weather-mode--active')} onClick={() => setState('forecast')}>Прогноз на 5 дней</div>
            </div>
            
            <SearchBar
                city={city}
                mode={mode}
                setCity={setCity}
                handleSearch={handleSearch}
                setMode={setMode}
            />
            {loading && (
                <div className='loader'></div>
            )}
            {weatherData && state === 'today' && (
                <WeatherWidget data={weatherData} />
            )}
            {forecastData && state === 'forecast' && (
                <ForecastWidget data={forecastData} />
            )}
            {error && (
                <div className='error-message'>{error}</div>
            )}
        </div>
    )
}

export default App