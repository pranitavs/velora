import React from 'react';
import { Plus, Flame, Sparkles } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { CURRENCY_MAP } from '../../lib/finance.js';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenAddTransaction?: () => void;
  streakCount?: number;
  currency?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenAddTransaction,
  streakCount = 0,
  currency = 'INR',
}) => {
  const currencyInfo = (CURRENCY_MAP as any)[currency] || CURRENCY_MAP.INR;

  return (
    <header className="top-bar">
      <div>
        <h1 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.75rem', color: 'var(--cream-dim)' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Streak Indicator */}
        <div
          title={`${streakCount} day streak`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(201, 168, 76, 0.1)',
            border: '1px solid rgba(201, 168, 76, 0.25)',
            fontSize: '0.75rem',
            color: 'var(--accent)',
            fontWeight: 600,
          }}
        >
          <Flame size={14} />
          <span>{streakCount}d</span>
        </div>

        {/* Currency badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--ink-raised)',
            border: '1px solid var(--ink-border)',
            fontSize: '0.75rem',
            color: 'var(--cream-dim)',
          }}
        >
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{currencyInfo.symbol}</span>
          <span>{currency}</span>
        </div>

        {onOpenAddTransaction && (
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddTransaction}
            icon={<Plus size={15} />}
          >
            Add Entry
          </Button>
        )}
      </div>
    </header>
  );
};
