import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="state-container">
      {icon && (
        <div style={{ color: 'var(--cream-dim)', display: 'flex', justifyContent: 'center' }}>
          {icon}
        </div>
      )}
      <h4 className="state-title">{title}</h4>
      <p className="state-desc">{description}</p>
      {action && (
        <button onClick={action.onClick} className="velora-btn btn-primary btn-sm">
          {action.label}
        </button>
      )}
    </div>
  );
};
