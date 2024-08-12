import React from 'react'

import '../styles/styles.css'

function SearchBar({ city, mode, setCity, handleSearch, handleSetMode }) {
    return (
        <div className='search'>
          <div className={'search-mode search-mode--location ' + (mode === 'location' ? 'search-mode--active' : '')} onClick={() => handleSetMode('location')}></div>
          <input
                type="text"
                className='search-input'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Введите город"
          />
          {city ? 
            <div className={'search-mode search-mode--search'} onClick={handleSearch}></div>
            : ''
          }  
        </div>
    )
}

export default SearchBar