import React from 'react';

export default function MiniSparkline({
  points = [10, 15, 8, 22, 18, 25, 30],
  color = '#C9A84C',
  width = 100,
  height = 32
}) {
  if (!points || points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const step = width / (points.length - 1);
  const pathD = points
    .map((val, idx) => {
      const x = idx * step;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
