// src/components/CitySelector.js
import React from 'react';

const CitySelector = ({
  cities,
  selectedCity,
  setSelectedCity,
  statistics,
  selectedStatistic,
  setSelectedStatistic,
  years,
  selectedYear,
  setSelectedYear,
}) => (
  <div className="city-selector">
    <select
      value={selectedCity}
      onChange={(e) => setSelectedCity(e.target.value)}
    >
      {cities.map((city, index) => (
        <option key={index} value={city}>
          {city.charAt(0).toUpperCase() + city.slice(1).replace(/_/g, ' ')}
        </option>
      ))}
    </select>

    <select
      value={selectedStatistic}
      onChange={(e) => setSelectedStatistic(e.target.value)}
    >
      {statistics.map((stat, index) => (
        <option key={index} value={stat}>
          {stat.charAt(0).toUpperCase() + stat.slice(1).replace(/_/g, ' ')}
        </option>
      ))}
    </select>

    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
      {years.map((year, index) => (
        <option key={index} value={year}>
          {year}
        </option>
      ))}
    </select>
  </div>
);

export default CitySelector;
