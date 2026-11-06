import React from 'react';

const CapacityBar = ({ label, current = 0, max = 100 }) => {
  const safeMax = max > 0 ? max : 100;
  const percentage = Math.min(Math.max((current / safeMax) * 100, 0), 100);

  let statusClass = 'capacity-normal';
  if (percentage > 80) {
    statusClass = 'capacity-critical';
  } else if (percentage > 50) {
    statusClass = 'capacity-warning';
  }

  return (
    <div className={`capacity-bar-container ${statusClass}`}>
      {label && (
        <div className="capacity-bar-header">
          <span className="capacity-bar-label">{label}</span>
          <span className="capacity-bar-values">
            {current} / {max} ({Math.round(percentage)}%)
          </span>
        </div>
      )}
      <div className="capacity-track">
        <div
          className={`capacity-fill ${statusClass}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default CapacityBar;
