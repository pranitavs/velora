import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
  padding?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverLift = true,
  className = '',
  padding,
  style,
  ...props
}) => {
  return (
    <div
      className={`velora-card ${hoverLift ? 'card-hover-lift' : ''} ${className}`.trim()}
      style={{ padding, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};
