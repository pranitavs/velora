import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (string | SelectOption)[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`form-select ${className}`}
        style={{ borderColor: error ? 'var(--negative)' : undefined }}
        {...props}
      >
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const text = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={val} value={val} style={{ backgroundColor: 'var(--ink-raised)', color: 'var(--cream)' }}>
              {text}
            </option>
          );
        })}
      </select>
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
