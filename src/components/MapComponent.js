// src/components/MapComponent.js
import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';

const MapComponent = ({ city, statistic, year }) => {
  const [geoData, setGeoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0); // Force re-render

  const cityCoordinates = {
    atlanta: [33.7490, -84.3880],
    new_york: [40.7128, -74.0060],
    los_angeles: [34.0522, -118.2437],
  };

  const coordinates = cityCoordinates[city] || [33.7490, -84.3880];

  // Fetch geo data with useCallback
  const fetchGeoData = useCallback(async () => {
    try {
      console.log(`Fetching data for ${city}, ${statistic}, ${year}...`);
      const response = await axios.get(
        `${process.env.PUBLIC_URL}/censusdata/${city}_blockgroup_${statistic}_${year}.geojson`
      );
      console.log('GeoJSON data:', response.data);
      setGeoData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching GeoJSON:', error);
      setIsLoading(false);
    }
  }, [city, statistic, year]); // Dependencies of fetchGeoData

  useEffect(() => {
    setIsLoading(true);
    setRenderKey((prev) => prev + 1);
    fetchGeoData();
  }, [fetchGeoData]); // Trigger when fetchGeoData changes

  const MapSetView = ({ coordinates }) => {
    const map = useMap();

    useEffect(() => {
      if (map && coordinates) {
        map.setView(coordinates, map.getZoom()); // Retain the zoom level
        map.invalidateSize(); // Ensure layout updates
      }
    }, [map, coordinates]);

    return null;
  };

  const getColor = (value) =>
    value > 0.8 ? '#00441b'
    : value > 0.6 ? '#238b45'
    : value > 0.4 ? '#41ab5d'
    : value > 0.2 ? '#74c476'
    : value > 0.1 ? '#a1d99b'
    : '#c7e9c0';

  const style = (feature) => ({
    fillColor: getColor(feature.properties[statistic] || 0),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  });

  const onEachFeature = (feature, layer) => {
    layer.bindTooltip(
      `<div>
        <strong>Block Group ID:</strong> ${feature.properties.GEOID || 'N/A'}<br/>
        <strong>${statistic} Score:</strong> ${(feature.properties[statistic]?.toFixed(2)) || 'N/A'}
      </div>`,
      { sticky: true }
    );

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  };

  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });
  };

  const resetHighlight = (e) => {
    const layer = e.target;
    layer.setStyle(style(layer.feature));
  };

  return (
    <MapContainer
      key={renderKey}
      center={coordinates}
      zoom={12}
      style={{ height: '600px', width: '100%' }}
      crs={L.CRS.EPSG3857} // Ensure CRS matches the tile layer
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
        noWrap={true} // Prevents world wrapping
      />
      <MapSetView coordinates={coordinates} /> {/* Correctly set map view */}
      {isLoading ? (
        <p>Loading map data...</p>
      ) : geoData ? (
        <GeoJSON
          key={`${city}-${statistic}-${year}`}
          data={geoData}
          style={style}
          onEachFeature={onEachFeature}
        />
      ) : (
        <p>No data available for this selection.</p>
      )}
    </MapContainer>
  );
};

export default MapComponent;
