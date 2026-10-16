import React from 'react';

export default function SavingsProgressChart({
  currentAmount = 0,
  targetAmount = 0,
  currencySymbol = '₹',
  color = '#C9A84C'
}) {
  const current = Number(currentAmount) || 0;
  const target = Number(targetAmount) || 1;
  const percentage = Math.min(100, Math.round((current / target) * 100));

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span className="tabular-nums" style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-cream)', fontWeight: 600 }}>
          {currencySymbol}{current.toLocaleString('en-IN')}
        </span>
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
          of {currencySymbol}{target.toLocaleString('en-IN')} ({percentage}%)
        </span>
      </div>

      <div
        style={{
          width: '100%',
          height: '8px',
          background: 'var(--color-ink-muted)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: color,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)'
          }}
        />
      </div>
    </div>
  );
}
