import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';

const MapComponent = ({ city, statistic, year }) => {
  const [geoData, setGeoData] = useState(null);
  // Check why we added this:
  const [isLoading, setIsLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0); // Force re-render

  const cityCoordinates = {
    Atlanta: [33.7490, -84.3880],
    NYC: [40.7128, -74.0060],
    Boston: [42.3742, -71.0371],
  };

  const coordinates = cityCoordinates[city] || [33.7490, -84.3880];

  const fetchGeoData = useCallback(async () => {
    const url = `https://vip-censusdata.s3.us-east-2.amazonaws.com/${city}_blockgroup_${statistic}_${year}.geojson`;
    try {
      console.log(`Fetching GeoJSON from: ${url}`);
      const response = await axios.get(url);
      console.log('GeoJSON data:', response.data);
      setGeoData(response.data); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching GeoJSON:', error);
      setGeoData(null); // Handle errors
    } finally {
      setIsLoading(false);
    }
  }, [city, statistic, year]);
  

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
    value > 0.95 ? '#006400'  // Dark Green
    : value > 0.9 ? '#228B22'  // Forest Green
    : value > 0.85 ? '#32CD32' // Lime Green
    : value > 0.8 ? '#7FFF00'  // Chartreuse
    : value > 0.7 ? '#ADFF2F' // Green-Yellow
    : value > 0.6 ? '#FFFF66'  // Light Yellow
    : value > 0.5 ? '#FFFF00'  // Bright Yellow
    : value > 0.4 ? '#FFD700'  // Gold
    : value > 0.3 ? '#FFA500'  // Orange
    : value > 0.2 ? '#FF4500'  // Orange-Red
    : value > 0.1 ? '#B22222'  // Firebrick
    : '#8B0000';               // Dark Red


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
