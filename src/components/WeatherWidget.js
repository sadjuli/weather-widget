import React from 'react'

import '../styles/styles.css'

function WeatherWidget({ data, forecastMode }) {

    const groupByDate = (list) => {
        if (!list) {
            return []
        }
        return list.reduce((acc, forecast) => {
            const date = new Date(forecast.dt * 1000).toLocaleDateString()
            if (!acc[date]) {
                acc[date] = []
            }
            acc[date].push(forecast)
            return acc
        }, {})
    };

    const groupedData = groupByDate(data.list)

    return (
        <div className='data'>
            {forecastMode === 'today' ? (
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
            ) : (
                <div>
                    <h2 className='data-title'>Прогноз на 5 дней для {data.name}</h2>
                    {Object.keys(groupedData).map((date, index) => (
                        <div key={index} className='forecast-day'>
                            <h3 className='data-forecast-date'>{date}</h3>
                            <div className='data-forecast-day'>
                                {groupedData[date].map((forecast, idx) => (
                                    <span key={idx} className='data-forecast-item'>
                                        <span>
                                        {new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span>{forecast.main.temp}°C</span>
                                    </span>
                                )).reduce((prev, curr) => [prev, '', curr])}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default WeatherWidget