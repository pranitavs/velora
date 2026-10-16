import React from 'react';
import Button from './Button.jsx';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  style = {}
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-12) var(--space-6)',
        textAlign: 'center',
        background: 'var(--color-ink-raised)',
        border: '1px dashed var(--color-ink-border)',
        borderRadius: 'var(--radius-lg)',
        ...style
      }}
      className={`velora-empty-state ${className}`}
    >
      {Icon && (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'var(--color-ink)',
            border: '1px solid var(--color-ink-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-cream-dim)',
            marginBottom: 'var(--space-4)'
          }}
        >
          <Icon size={24} strokeWidth={1.5} />
        </div>
      )}
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          color: 'var(--color-cream)',
          marginBottom: 'var(--space-2)'
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-cream-dim)',
            maxWidth: '380px',
            lineHeight: 1.5,
            marginBottom: actionLabel ? 'var(--space-6)' : 0
          }}
        >
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
