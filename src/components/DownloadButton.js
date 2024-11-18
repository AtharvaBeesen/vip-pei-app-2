// src/components/DownloadButton.js
import React from 'react';

const DownloadButton = ({ city, statistic, year }) => {
  const fileName = `${city}_blockgroup_${statistic}_${year}`;
  const s3BaseUrl = 'https://vip-censusdata.s3.us-east-2.amazonaws.com'; // Replace with your actual S3 bucket URL
  const csvUrl = `${s3BaseUrl}/${fileName}.csv`;
  const geojsonUrl = `${s3BaseUrl}/${fileName}.geojson`;

  return (
    <div className="download-buttons">
      <h3>Download Data</h3>
      <div className="button-container">
        <a href={csvUrl} target="_blank" rel="noopener noreferrer" download={`${fileName}.csv`}>
          <button>Download CSV</button>
        </a>
        <a href={geojsonUrl} target="_blank" rel="noopener noreferrer" download={`${fileName}.geojson`}>
          <button>Download GeoJSON</button>
        </a>
      </div>
    </div>
  );
};

export default DownloadButton;
