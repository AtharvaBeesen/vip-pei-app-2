import React from 'react';

const DownloadButton = ({ city, statistic, year }) => {
  const fileName = `${city}_blockgroup_${statistic}_${year}`;
  const s3BaseUrl = 'https://vip-censusdata.s3.us-east-2.amazonaws.com';
  const geojsonUrl = `${s3BaseUrl}/${fileName}.geojson`;

  return (
    <div className="download-buttons">
      <button onClick={() => window.open(csvUrl, '_blank')}>
        Download CSV
      </button>
      <button onClick={() => window.open(geojsonUrl, '_blank')}>
        Download GeoJSON
      </button>
    </div>
  );
};

export default DownloadButton;