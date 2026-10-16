import React from 'react';

export default function Card({
  children,
  className = '',
  highlight = false,
  style = {},
  ...props
}) {
  return (
    <div
      style={{
        background: highlight ? 'var(--color-accent-glow)' : 'var(--color-ink-raised)',
        border: `1px solid ${highlight ? 'rgba(201, 168, 76, 0.35)' : 'var(--color-ink-border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        ...style
      }}
      className={`velora-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
