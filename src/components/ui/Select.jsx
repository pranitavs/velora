import React from 'react';

export default function Select({
  label,
  id,
  options = [],
  value,
  onChange,
  error,
  required = false,
  className = '',
  containerStyle,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && (
        <label htmlFor={selectId} className="ui-label">
          {label} {required && <span style={{ color: 'var(--color-accent)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            background: 'var(--color-ink-raised)',
            border: `1px solid ${error ? 'var(--color-negative)' : 'var(--color-ink-border)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-cream)',
            padding: '12px 16px',
            fontSize: 'var(--text-body)',
            outline: 'none',
            width: '100%',
            appearance: 'none',
            cursor: 'pointer'
          }}
          className={`velora-select ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: 'var(--color-ink-deep)', color: 'var(--color-cream)' }}>
              {opt.label}
            </option>
          ))}
        </select>
        <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-cream-dim)' }}>
          ▼
        </div>
      </div>
      {error && (
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-negative)' }} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
