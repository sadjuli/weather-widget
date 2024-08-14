import React from 'react'

import '../styles/styles.css'

function SearchBar({ city, mode, setCity, handleSearch, setMode }) {
    return (
        <div className='search'>
          <div className={'search-mode search-mode--location ' + (mode === 'location' ? 'search-mode--active' : '')} onClick={() => setMode('location')}></div>
          <input
                type="text"
                className={'search-input ' + (mode === 'search' ? 'search-input--active' : '')}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Введите город"
          />
          {city ? 
            <div className={'search-mode search-mode--search ' + (mode === 'search' ? 'search-mode--active' : '')} onClick={handleSearch}></div>
            : ''
          }  
        </div>
    )
}

export default SearchBar