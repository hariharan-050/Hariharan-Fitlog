import React, { useState } from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';

const DomainChart = ({
  data = [],
  title = 'Biometric Telemetry Trends',
  metricKey = 'bodyWeightKg',
  dateKey = 'recordedDate',
  unit = 'kg',
}) => {
  const [chartType, setChartType] = useState('line');

  const validData = Array.isArray(data)
    ? data.filter((item) => item && typeof item[metricKey] === 'number')
    : [];

  if (validData.length === 0) {
    return (
      <div className="domain-chart-container page-card">
        <div className="chart-header">
          <div className="chart-title-group">
            <TrendingUp size={20} className="chart-title-icon text-accent" />
            <h3 className="chart-title">{title}</h3>
          </div>
        </div>
        <div className="chart-empty-state">
          <p className="text-muted">No metrics logged to chart trends yet.</p>
        </div>
      </div>
    );
  }

  const values = validData.map((d) => Number(d[metricKey]));
  const minVal = Math.min(...values) * 0.95;
  const maxVal = Math.max(...values) * 1.05;
  const range = maxVal - minVal || 1;

  const width = 600;
  const height = 220;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = validData.map((item, idx) => {
    const x =
      padding +
      (validData.length > 1
        ? (idx / (validData.length - 1)) * chartWidth
        : chartWidth / 2);
    const y =
      height -
      padding -
      ((Number(item[metricKey]) - minVal) / range) * chartHeight;
    return { x, y, value: item[metricKey], date: item[dateKey] };
  });

  const pathD = points.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : '';

  return (
    <div className="domain-chart-container page-card">
      <div className="chart-header">
        <div className="chart-title-group">
          <TrendingUp size={20} className="chart-title-icon text-accent" />
          <h3 className="chart-title">{title}</h3>
        </div>
        <div className="chart-controls">
          <button
            type="button"
            className={`btn-chart-toggle ${chartType === 'line' ? 'active' : ''}`}
            onClick={() => setChartType('line')}
            aria-label="Line chart"
          >
            Line
          </button>
          <button
            type="button"
            className={`btn-chart-toggle ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
            aria-label="Bar chart"
          >
            <BarChart2 size={14} /> Bar
          </button>
        </div>
      </div>

      <div className="chart-svg-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="responsive-svg-chart"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding + ratio * chartHeight;
            const val = (maxVal - ratio * range).toFixed(1);
            return (
              <g key={ratio}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding - 8}
                  y={y + 4}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {chartType === 'line' ? (
            <>
              <path d={areaD} fill="url(#chartGradient)" />
              <path
                d={pathD}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((pt, i) => (
                <g key={i} className="chart-data-point">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#1e293b"
                    stroke="#60a5fa"
                    strokeWidth="2"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    fill="#f8fafc"
                    fontSize="10"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {pt.value} {unit}
                  </text>
                </g>
              ))}
            </>
          ) : (
            points.map((pt, i) => {
              const barW = Math.max(chartWidth / (points.length * 2), 12);
              const barH = height - padding - pt.y;
              return (
                <g key={i}>
                  <rect
                    x={pt.x - barW / 2}
                    y={pt.y}
                    width={barW}
                    height={barH}
                    fill="#3b82f6"
                    rx="4"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 6}
                    fill="#f8fafc"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {pt.value}
                  </text>
                </g>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
};

export default DomainChart;
