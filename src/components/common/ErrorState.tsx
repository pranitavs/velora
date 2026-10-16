import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => {
  return (
    <div className="state-container" style={{ borderColor: 'rgba(217, 96, 74, 0.4)' }}>
      <div style={{ color: 'var(--negative)' }}>
        <AlertCircle size={32} />
      </div>
      <h4 className="state-title" style={{ color: 'var(--negative)' }}>
        {title}
      </h4>
      <p className="state-desc">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="velora-btn btn-secondary btn-sm">
          Try Again
        </button>
      )}
    </div>
  );
};
