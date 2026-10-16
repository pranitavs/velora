import React from 'react';

interface SpinnerProps {
  size?: number;
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = 'var(--accent)',
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        className="spinner-icon"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: `2px solid ${color}`,
          borderTopColor: 'transparent',
          borderRadius: '50%',
          display: 'inline-block',
        }}
        aria-label="Loading"
      />
    </div>
  );
};
