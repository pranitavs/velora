import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  error,
  helperText,
  className = '',
  required = false,
  containerStyle,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && (
        <label htmlFor={inputId} className="ui-label">
          {label} {required && <span style={{ color: 'var(--color-accent)' }}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        required={required}
        style={{
          background: 'var(--color-ink-raised)',
          border: `1px solid ${error ? 'var(--color-negative)' : 'var(--color-ink-border)'}`,
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-cream)',
          padding: '12px 16px',
          fontSize: 'var(--text-body)',
          transition: 'border-color 0.2s ease',
          outline: 'none',
          width: '100%'
        }}
        className={`velora-input ${className}`}
        {...props}
      />
      {error && (
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-negative)' }} role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
          {helperText}
        </span>
      )}
    </div>
  );
}
