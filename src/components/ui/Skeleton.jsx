import React from 'react';

export default function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
  className = '',
  style = {}
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--color-ink-raised) 0%, var(--color-ink-border) 50%, var(--color-ink-raised) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite linear',
        ...style
      }}
      className={`skeleton-shimmer ${className}`}
      aria-hidden="true"
    />
  );
}
