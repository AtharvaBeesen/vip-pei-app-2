import React from 'react';

const MetricSliders = ({ values, onChange }) => {
  const handleChange = (key) => (e) => {
    onChange((prev) => ({ ...prev, [key]: Number(e.target.value) }));
  };

  return (
    <div className="sidebar-overlay slider-panel" role="complementary" aria-label="Metric sliders">
      <div className="sidebar-section-title">Adjust Metrics</div>

      {['IDI', 'LDI', 'PDI', 'CDI'].map((k) => (
        <div className="slider-row" key={k}>
          <div className="slider-header">
            <div className="slider-label">{k}</div>
            <div className="slider-value">{values[k]}%</div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={values[k]}
            onChange={handleChange(k)}
            aria-label={`${k} percentile`}
          />
        </div>
      ))}
    </div>
  );
};

export default MetricSliders;
