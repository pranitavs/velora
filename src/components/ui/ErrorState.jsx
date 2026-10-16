import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from './Button.jsx';

export default function ErrorState({
  title = 'Something went wrong',
  description = 'We encountered an error while loading your financial data.',
  onRetry,
  retryLabel = 'Try again',
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
        background: 'rgba(217, 96, 74, 0.05)',
        border: '1px solid rgba(217, 96, 74, 0.25)',
        borderRadius: 'var(--radius-lg)',
        ...style
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'rgba(217, 96, 74, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-negative)',
          marginBottom: 'var(--space-4)'
        }}
      >
        <AlertCircle size={24} strokeWidth={1.5} />
      </div>

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

      <p
        style={{
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-cream-dim)',
          maxWidth: '380px',
          lineHeight: 1.5,
          marginBottom: onRetry ? 'var(--space-6)' : 0
        }}
      >
        {description}
      </p>

      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
