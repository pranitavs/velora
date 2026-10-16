import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'destructive'
  size = 'md', // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: 'transparent',
          color: 'var(--color-cream)',
          border: '1px solid var(--color-ink-border)'
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--color-cream-dim)',
          border: 'none'
        };
      case 'destructive':
        return {
          background: 'transparent',
          color: 'var(--color-negative)',
          border: '1px solid var(--color-negative)'
        };
      case 'primary':
      default:
        return {
          background: 'var(--color-accent)',
          color: 'var(--color-ink)',
          border: 'none',
          fontWeight: 600
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '8px 14px', fontSize: 'var(--text-body-sm)' };
      case 'lg':
        return { padding: '14px 28px', fontSize: 'var(--text-body-lg)' };
      case 'md':
      default:
        return { padding: '12px 24px', fontSize: 'var(--text-body)' };
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        borderRadius: 'var(--radius-md)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.1s ease',
        userSelect: 'none'
      }}
      className={`btn-${variant} ${className}`}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: 16,
            height: 16,
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.6s linear infinite'
          }}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  );
}
