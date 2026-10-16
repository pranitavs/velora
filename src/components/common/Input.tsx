import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftAddon,
  rightAddon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftAddon && (
          <div
            style={{
              position: 'absolute',
              left: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--cream-dim)',
              pointerEvents: 'none',
            }}
          >
            {leftAddon}
          </div>
        )}
        <input
          id={inputId}
          className={`form-input ${className}`}
          style={{
            paddingLeft: leftAddon ? '2.5rem' : '0.9rem',
            paddingRight: rightAddon ? '2.5rem' : '0.9rem',
            borderColor: error ? 'var(--negative)' : undefined,
          }}
          {...props}
        />
        {rightAddon && (
          <div
            style={{
              position: 'absolute',
              right: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--cream-dim)',
            }}
          >
            {rightAddon}
          </div>
        )}
      </div>
      {error ? (
        <p className="form-error-msg">{error}</p>
      ) : helperText ? (
        <p style={{ fontSize: '0.75rem', color: 'var(--cream-subtle)', marginTop: '0.25rem' }}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
