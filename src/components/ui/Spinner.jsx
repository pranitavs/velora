import React from 'react';

export default function Spinner({
  size = 24,
  color = 'var(--color-accent)',
  className = '',
  style = {}
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid ${color}`,
        borderRightColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        display: 'inline-block',
        ...style
      }}
      className={`velora-spinner ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
