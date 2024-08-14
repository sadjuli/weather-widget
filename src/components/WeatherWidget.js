import React from 'react'

import '../styles/styles.css'

function WeatherWidget({ data }) {
    return (
        <div className='data'>
            <div>
                <h2 className='data-title'>Погода на сегодня в {data.name}</h2>
                <div className='data-item'>Температура: {data.main.temp}°C</div>
                <div className='data-item'>Описание: {data.weather[0].description}</div>
                <div className='data-item'>Давление: {data.main.pressure} гПа</div>
                <div className='data-item'>Влажность: {data.main.humidity}%</div>
                <div className='data-item'>Скорость ветра: {data.wind.speed} м/с</div>
                <div className='data-item'>Восход: {new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</div>
                <div className='data-item'>Закат: {new Date(data.sys.sunset * 1000).toLocaleTimeString()}</div>
            </div>
        </div>
    )
}

export default WeatherWidget