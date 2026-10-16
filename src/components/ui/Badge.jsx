import React from 'react';

export default function Badge({
  children,
  variant = 'neutral', // 'positive' | 'negative' | 'warning' | 'accent' | 'neutral'
  size = 'md',
  style = {}
}) {
  const getColors = () => {
    switch (variant) {
      case 'positive':
        return {
          bg: 'rgba(76, 175, 130, 0.12)',
          text: 'var(--color-positive)',
          border: 'rgba(76, 175, 130, 0.3)'
        };
      case 'negative':
        return {
          bg: 'rgba(217, 96, 74, 0.12)',
          text: 'var(--color-negative)',
          border: 'rgba(217, 96, 74, 0.3)'
        };
      case 'warning':
        return {
          bg: 'rgba(232, 168, 56, 0.12)',
          text: 'var(--color-warning)',
          border: 'rgba(232, 168, 56, 0.3)'
        };
      case 'accent':
        return {
          bg: 'var(--color-accent-glow)',
          text: 'var(--color-accent)',
          border: 'rgba(201, 168, 76, 0.4)'
        };
      case 'neutral':
      default:
        return {
          bg: 'var(--color-ink-muted)',
          text: 'var(--color-cream-dim)',
          border: 'var(--color-ink-border)'
        };
    }
  };

  const { bg, text, border } = getColors();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        borderRadius: 'var(--radius-sm)',
        background: bg,
        color: text,
        border: `1px solid ${border}`,
        fontSize: size === 'sm' ? 'var(--text-caption)' : 'var(--text-body-sm)',
        fontWeight: 500,
        letterSpacing: '0.02em',
        userSelect: 'none',
        ...style
      }}
    >
      {children}
    </span>
  );
}
