import React, { useState } from 'react';

export default function Tooltip({ content, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-ink-deep)',
            border: '1px solid var(--color-ink-border)',
            color: 'var(--color-cream)',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-caption)',
            whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-elevated)',
            zIndex: 100,
            pointerEvents: 'none'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
