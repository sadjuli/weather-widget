import React, { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import WeatherWidget from './components/WeatherWidget'

import './styles/styles.css'

const API_KEY = '0dcc45bdb290c3adc4f75f9225ee0f4b'

function App() {
    const [city, setCity] = useState('')
    const [state, setState] = useState('today')
    const [mode, setMode] = useState('location')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    
    const [weatherData, setWeatherData] = useState(null)

    const handleState = (value) => {
        setState(value)
        if (mode === 'location') {
          fetchGeoWeather()
        } else {
          fetchWeather()
        }
    }

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

        console.log('state', state)
        if (state === 'today') {
            fetchTodayWeather(city)
        } else {
            fetchForecastWeather(city)
        }
    }

    useEffect(() => {
        fetchGeoWeather()
    }, [])

    const fetchTodayWeather = async (city) => {
        setError('')
        setLoading(true)
        setWeatherData(null)
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
            )
            const data = await response.json()
            if (data.cod == 200) {
                setWeatherData(data)
            } else if (data.cod == 404) {
                setError('Город не найден')
            } else {
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
        setWeatherData(null)
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
            );
            const data = await response.json()
            if (data.cod == 200) {
                setWeatherData(data)
            } else if (data.cod == 404) {
                setError('Город не найден')
            } else {
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
        setWeatherData(null)
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
        setWeatherData(null)
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`
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

    const handleSearch = async () => {
        setWeatherData(null)
        if (city) {
            fetchWeather()
        }
    };

    const handleSetMode = (value) => {
        if (value === 'location') {
            setCity('')
            fetchGeoWeather()
        } else {
            fetchWeather()
        }
        setMode(value)
    }
    
    const handleSetCity = (value) => {
        if (value) {
            setMode('search')
        } else {
            setMode('location')
        }
        setCity(value)
    }

    return (
        <div className='weather'>
          
            <div className="weather-modes">
              <div className={'weather-mode weather-mode--today ' + (state === 'today' ? 'weather-mode--active' : '') } onClick={() => handleState('today')}>На сегодня</div>
              <div className={'weather-mode weather-mode--forecast ' + (state === 'today' ? '' : 'weather-mode--active')} onClick={() => handleState('forecast')}>Прогноз на 5 дней</div>
            </div>
            
            <SearchBar
                city={city}
                mode={mode}
                setCity={handleSetCity}
                handleSearch={handleSearch}
                handleSetMode={handleSetMode}
            />
            {weatherData && (
                <WeatherWidget data={weatherData} state={state} />
            )}
            {loading && (
                <div className='loader'></div>
            )}
            {error && (
                <div className='error-message'>{error}</div>
            )}
        </div>
    )
}

export default App