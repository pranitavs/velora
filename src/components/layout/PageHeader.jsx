import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  action,
  children
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: 'var(--space-8)',
        flexWrap: 'wrap'
      }}
    >
      <div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-heading-1)',
            color: 'var(--color-cream)',
            lineHeight: 1.2
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: 'var(--text-body)',
              color: 'var(--color-cream-dim)',
              marginTop: '4px',
              maxWidth: '600px'
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {(action || children) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {action}
          {children}
        </div>
      )}
    </div>
  );
}
