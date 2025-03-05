// import React, { useState } from 'react';
// import MapComponent from './components/MapComponent';
// import CitySelector from './components/CitySelector';
// import DownloadButton from './components/DownloadButton';
// import Navbar from './components/Navbar';
// import './App.css';

// const App = () => {
//   const [selectedCity, setSelectedCity] = useState('atlanta');
//   const [selectedStatistic, setSelectedStatistic] = useState('IDI');
//   const [selectedYear, setSelectedYear] = useState('2022');

//   const cities = ['atlanta', 'new_york', 'los_angeles'];
//   const statistics = ['IDI', 'PDI', 'CDI', 'LDI', 'PEI'];
//   const years = ['2022', '2013'];

//   return (
//     <div className="App">
//       <Navbar /> {/*Added Navbar*/}
//       <h1>VIP-SMUR-PEI Subindex Visualizer</h1>
//       <div className="section">
//         <CitySelector
//           cities={cities}
//           selectedCity={selectedCity}
//           setSelectedCity={setSelectedCity}
//           statistics={statistics}
//           selectedStatistic={selectedStatistic}
//           setSelectedStatistic={setSelectedStatistic}
//           years={years}
//           selectedYear={selectedYear}
//           setSelectedYear={setSelectedYear}
//         />
//         <DownloadButton 
//           city={selectedCity}
//           statistic={selectedStatistic}
//           year={selectedYear}
//         />
//       </div>
//       <div className="section">
//         <MapComponent
//           city={selectedCity}
//           statistic={selectedStatistic}
//           year={selectedYear}
//         />
//       </div>
//     </div>
//   );
// };

// export default App;
//-------new App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import CitySelector from './components/CitySelector';
import DownloadButton from './components/DownloadButton';
import Navbar from './components/Navbar';
import CityCompare from './components/CityCompare';
import './App.css';

//Home Component: current main page content
const Home = () => {
  const [selectedCity, setSelectedCity] = useState('atlanta');
  const [selectedStatistic, setSelectedStatistic] = useState('IDI');
  const [selectedYear, setSelectedYear] = useState('2022');

  const cities = ['atlanta', 'new_york', 'los_angeles'];
  const statistics = ['IDI', 'PDI', 'CDI', 'LDI', 'PEI'];
  const years = ['2022', '2013'];

  return (
    <div>
      <h1>VIP-SMUR-PEI Subindex Visualizer</h1>
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

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* NAV Bar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/city-compare" element={<CityCompare />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;