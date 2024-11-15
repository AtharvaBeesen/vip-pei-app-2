// src/components/DownloadButton.js
import React from 'react';

const DownloadButton = ({ city, statistic, year }) => {
  const fileName = `${city}_blockgroup_${statistic}_${year}`;
  const csvUrl = `${process.env.PUBLIC_URL}/censusdata/${fileName}.csv`;
  const geojsonUrl = `${process.env.PUBLIC_URL}/censusdata/${fileName}.geojson`;

  return (
    <div className="download-buttons">
      <h3>Download Data</h3>
      <div className="button-container">
        <a href={csvUrl} download={`${fileName}.csv`}>
          <button>Download CSV</button>
        </a>
        <a href={geojsonUrl} download={`${fileName}.geojson`}>
          <button>Download GeoJSON</button>
        </a>
      </div>
    </div>
  );
};

export default DownloadButton;
