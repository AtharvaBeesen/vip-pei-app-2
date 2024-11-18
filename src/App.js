// src/App.js
import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import CitySelector from './components/CitySelector';
import DownloadButton from './components/DownloadButton';
import './App.css';

const App = () => {
  const [selectedCity, setSelectedCity] = useState('atlanta');
  const [selectedStatistic, setSelectedStatistic] = useState('IDI');
  const [selectedYear, setSelectedYear] = useState('2022');

  const cities = ['atlanta', 'new_york', 'los_angeles'];
  const statistics = ['IDI', 'PDI', 'CDI', 'LDI', 'PEI'];
  const years = ['2022', '2013'];

  return (
    <div className="App">
      <h1>VIP-SMUR-PEI Proof of Concept</h1>
      <div className="section">
        <CitySelector
          cities={cities}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          statistics={statistics}
          selectedStatistic={selectedStatistic}
          setSelectedStatistic={setSelectedStatistic}
          years={years}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <DownloadButton 
          city={selectedCity}
          statistic={selectedStatistic}
          year={selectedYear}
        />
      </div>
      <div className="section">
        <MapComponent
          city={selectedCity}
          statistic={selectedStatistic}
          year={selectedYear}
        />
      </div>
    </div>
  );
};

export default App;
