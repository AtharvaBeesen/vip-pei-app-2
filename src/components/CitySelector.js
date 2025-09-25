import React from 'react';

const CitySelector = ({
  cities,
  selectedCity,
  setSelectedCity,
  years,
  selectedYear,
  setSelectedYear,
}) => (
  <div className="city-selector">
    <div>
      <label htmlFor="city">City</label>
      <select
        id="city"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        {cities.map((city, index) => (
          <option key={index} value={city}>
            {city
              .split('_') // Split the city name by underscores
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
              .join(' ')} {/* Rejoin with spaces */}
          </option>
        ))}
      </select>
    </div>


    <div>
      <label htmlFor="year">Year</label>
      <select
        id="year"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {years.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default CitySelector;
