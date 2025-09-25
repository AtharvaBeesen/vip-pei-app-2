import React, { useState, useEffect, useRef } from 'react';

const DownloadButton = ({ city, year, metricWeights }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const s3BaseUrl = 'https://vip-censusdata.s3.us-east-2.amazonaws.com';
  
  const metrics = ['IDI', 'LDI', 'PDI', 'CDI'];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleDownload = (metric) => {
    const fileName = `${city}_blockgroup_${metric}_${year}`;
    const geojsonUrl = `${s3BaseUrl}/${fileName}.geojson`;
    window.open(geojsonUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="download-dropdown" ref={dropdownRef}>
      <button 
        className="download-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Download Data ▼
      </button>
      {isOpen && (
        <div className="download-menu">
          {metrics.map(metric => (
            <button 
              key={metric}
              onClick={() => handleDownload(metric)}
              className="download-option"
            >
              {metric} GeoJSON
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadButton;