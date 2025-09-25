//------- App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import CitySelector from './components/CitySelector';
import Navbar from './components/Navbar';
import CityCompare from './components/CityCompare';
import MetricSliders from './components/MetricSliders';
import './App.css';

// Home Component: main page content
const Home = () => {
  const [selectedCity, setSelectedCity] = useState('atlanta');
  const [selectedYear, setSelectedYear] = useState('2022');
  const [metricWeights, setMetricWeights] = useState({
    IDI: 25,
    LDI: 25,
    PDI: 25,
    CDI: 25,
  });

  const years = ['2022', '2013'];

  return (
    <div className="map-fullscreen">
      <MapComponent
        city={selectedCity}
        year={selectedYear}
        metricWeights={metricWeights}
      />

      {/* Right-side stacked panels */}
      <div className="sidebar-stack" aria-label="Right sidebar panels">
        <div className="sidebar-overlay" role="complementary" aria-label="Map controls">
          <div className="sidebar-section-title">Selection</div>
          <div className="sidebar-group">
            <div className="city-display">
              <div className="city-name">Atlanta</div>
              <div className="city-subtitle">(more cities to come)</div>
            </div>
            <div className="year-selector">
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
        </div>

        {/* New sliders panel */}
        <MetricSliders 
          values={metricWeights}
          onChange={setMetricWeights}
        />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/city-compare" element={<CityCompare />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
