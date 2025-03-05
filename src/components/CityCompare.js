import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';

const CityCompare = () => {
  //Curr Options
  const cities = ['atlanta', 'new_york', 'los_angeles'];
  const statistics = ['IDI', 'PDI', 'CDI', 'LDI', 'PEI'];
  const years = ['2022', '2013'];

  //Component state
  const [selectedCity, setSelectedCity] = useState('atlanta');
  const [selectedStatistic, setSelectedStatistic] = useState('IDI');
  const [yearBefore, setYearBefore] = useState('2013');
  const [yearAfter, setYearAfter] = useState('2022');
  const [diffData, setDiffData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  //Fetch a GeoJSON file for a given year
  const fetchGeoData = async (year) => {
    const url = `https://vip-censusdata.s3.us-east-2.amazonaws.com/${selectedCity}_blockgroup_${selectedStatistic}_${year}.geojson`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data for year ${year}:`, error);
      return null;
    }
  };

  // // Compute the percentage difference for each blockgroup based on GEOID
  // const computeDiff = (beforeGeo, afterGeo) => {
  //   if (!beforeGeo || !afterGeo) return null;

  //   // Create a lookup map for the before data
  //   const beforeLookup = {};
  //   beforeGeo.features.forEach((feature) => {
  //     beforeLookup[feature.properties.GEOID] = feature;
  //   });

  //   // Iterate over after features and compute percent difference
  //   const diffFeatures = afterGeo.features.map((feature) => {
  //     const id = feature.properties.GEOID;
  //     const beforeFeature = beforeLookup[id];
  //     let percentDiff = 0;
  //     if (beforeFeature) {
  //       const beforeVal = parseFloat(beforeFeature.properties[selectedStatistic]);
  //       const afterVal = parseFloat(feature.properties[selectedStatistic]);
  //       if (!isNaN(beforeVal) && !isNaN(afterVal)) {
  //         // If both values are zero, then the difference is 0.
  //         if (beforeVal === 0 && afterVal === 0) {
  //           percentDiff = 0;
  //         } else if (beforeVal !== 0) {
  //           percentDiff = Number(((afterVal - beforeVal) / beforeVal * 100).toFixed(2));
  //         }
  //       }
  //     }
  //     feature.properties.percentDiff = percentDiff;
  //     return feature;
  //   });
  //   return { ...afterGeo, features: diffFeatures };
  // };

//-----------NEW , DELETE LATER---------

  //Compute the percentage difference for each blockgroup based on GEOID ------------ NEW , DELETE LATER
  const computeDiff = (beforeGeo, afterGeo) => {
    if (!beforeGeo || !afterGeo) return null;

    let diffFeatures = [];

    //Temp fix for LDI: if the subindex is LDI, pair features by array index.
    //Remove this block once your LDI files include a proper GEOID.
    if (selectedStatistic === "LDI") {
      diffFeatures = afterGeo.features.map((feature, index) => {
        let percentDiff = 0;
        const beforeFeature = beforeGeo.features[index];
        if (beforeFeature) {
          const beforeVal = parseFloat(beforeFeature.properties[selectedStatistic]);
          const afterVal = parseFloat(feature.properties[selectedStatistic]);
          if (!isNaN(beforeVal) && !isNaN(afterVal)) {
            if (beforeVal === 0 && afterVal === 0) {
              percentDiff = 0;
            } else if (beforeVal !== 0) {
              percentDiff = Number(((afterVal - beforeVal) / beforeVal * 100).toFixed(2));
            }
          }
        }
        feature.properties.percentDiff = percentDiff;
        return feature;
      });
    } else {
      //Normal pairing logic using GEOID (assumes GEOID exists in both datasets)
      const beforeLookup = {};
      beforeGeo.features.forEach((feature) => {
        beforeLookup[feature.properties.GEOID] = feature;
      });
      diffFeatures = afterGeo.features.map((feature) => {
        const id = feature.properties.GEOID;
        let percentDiff = 0;
        const beforeFeature = beforeLookup[id];
        if (beforeFeature) {
          const beforeVal = parseFloat(beforeFeature.properties[selectedStatistic]);
          const afterVal = parseFloat(feature.properties[selectedStatistic]);
          if (!isNaN(beforeVal) && !isNaN(afterVal)) {
            if (beforeVal === 0 && afterVal === 0) {
              percentDiff = 0;
            } else if (beforeVal !== 0) {
              percentDiff = Number(((afterVal - beforeVal) / beforeVal * 100).toFixed(2));
            }
          }
        }
        feature.properties.percentDiff = percentDiff;
        return feature;
      });
    }
    
    return { ...afterGeo, features: diffFeatures };
  };


  //Fetch both years’ data when any selection changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setRenderKey((prev) => prev + 1);
      const [dataBefore, dataAfter] = await Promise.all([
        fetchGeoData(yearBefore),
        fetchGeoData(yearAfter)
      ]);
      const diff = computeDiff(dataBefore, dataAfter);
      setDiffData(diff);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedCity, selectedStatistic, yearBefore, yearAfter]);

  //helper component to update the map view on changes
  const MapSetView = ({ coordinates }) => {
    const map = useMap();
    useEffect(() => {
      if (map && coordinates) {
        map.setView(coordinates, map.getZoom());
        map.invalidateSize();
      }
    }, [map, coordinates]);
    return null;
  };

  //Def city coordinates for centering the map
  const cityCoordinates = {
    atlanta: [33.7490, -84.3880],
    new_york: [40.7128, -74.0060],
    los_angeles: [34.0522, -118.2437],
  };
  const coordinates = cityCoordinates[selectedCity] || [33.7490, -84.3880];

  // Color scale for the percentage difference
  const getColor = (d) => {
    return d > 50 ? '#006d2c' :
           d > 20 ? '#31a354' :
           d > 0  ? '#74c476' :
           d === 0 ? '#ffffcc' :
           d > -20 ? '#fc9272' :
           d > -50 ? '#de2d26' :
                     '#a50f15';
  };

  // GeoJSON style function
  const style = (feature) => ({
    fillColor: getColor(feature.properties.percentDiff),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  });


  const onEachFeature = (feature, layer) => {
    //Explicit check to display 0 when percentDiff is zero.
    const diffValue = feature.properties.percentDiff;
    const diffDisplay = (diffValue !== null && diffValue !== undefined)
      ? diffValue.toFixed(2)
      : 'N/A';

    layer.bindTooltip(
      `<div>
         <strong>Block Group ID:</strong> ${feature.properties.GEOID || 'N/A'}<br/>
         <strong>% Change:</strong> ${diffDisplay}%
       </div>`,
      { sticky: true }
    );
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7,
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(style(layer.feature));
      },
    });
  };

  return (
    <div className="city-compare-page">
      {/* Title outside the section container */}
      <h1>City Comparison Tool MVP</h1>
      
      {/* Controls Section */}
      <div className="section">
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
                  {city.split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="statistic">Statistic</label>
            <select
              id="statistic"
              value={selectedStatistic}
              onChange={(e) => setSelectedStatistic(e.target.value)}
            >
              {statistics.map((stat, index) => (
                <option key={index} value={stat}>
                  {stat.charAt(0).toUpperCase() + stat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="yearBefore">Before Year</label>
            <select
              id="yearBefore"
              value={yearBefore}
              onChange={(e) => setYearBefore(e.target.value)}
            >
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="yearAfter">After Year</label>
            <select
              id="yearAfter"
              value={yearAfter}
              onChange={(e) => setYearAfter(e.target.value)}
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

      {/* Map Section */}
      <div className="section">
        {isLoading ? (
          <p>Loading map data...</p>
        ) : diffData ? (
          <MapContainer
            key={renderKey}
            center={coordinates}
            zoom={12}
            style={{ height: '600px', width: '100%' }}
            crs={L.CRS.EPSG3857}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
              noWrap={true}
            />
            <MapSetView coordinates={coordinates} />
            <GeoJSON data={diffData} style={style} onEachFeature={onEachFeature} />
          </MapContainer>
        ) : (
          <p>No data available for this selection.</p>
        )}
      </div>
    </div>
  );
};

export default CityCompare;
