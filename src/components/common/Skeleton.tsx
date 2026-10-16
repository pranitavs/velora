import React from 'react';

interface SkeletonProps {
  type?: 'line' | 'card' | 'avatar';
  count?: number;
  height?: string;
  width?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  type = 'line',
  count = 1,
  height,
  width,
}) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map((_, i) => (
          <div
            key={i}
            className="skeleton-box"
            style={{
              height: height || '120px',
              width: width || '100%',
              padding: '1.25rem',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {items.map((_, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{
            height: height || '1rem',
            width: width || (i === items.length - 1 && count > 1 ? '60%' : '100%'),
          }}
        />
      ))}
    </div>
  );
};
