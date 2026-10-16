import React, { useMemo } from 'react';
import TransactionItem from './TransactionItem.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { ReceiptText } from 'lucide-react';
import { formatRelativeDate } from '../../lib/dates.js';

export default function TransactionList({
  transactions = [],
  currencySymbol = '₹',
  selectedIds = [],
  onToggleSelect,
  onEdit,
  onDelete,
  onAddNew
}) {
  // Group transactions by date descending
  const grouped = useMemo(() => {
    const map = new Map();
    for (const t of transactions) {
      const dateKey = t.date;
      if (!map.has(dateKey)) {
        map.set(dateKey, { date: dateKey, items: [], dayIncome: 0, dayExpense: 0 });
      }
      const entry = map.get(dateKey);
      entry.items.push(t);
      if (t.type === 'income') entry.dayIncome += Number(t.amount) || 0;
      if (t.type === 'expense') entry.dayExpense += Number(t.amount) || 0;
    }
    return Array.from(map.values());
  }, [transactions]);

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon={ReceiptText}
        title="No transactions found"
        description="Start recording your daily income and expenses to understand your financial flow."
        actionLabel={onAddNew ? "Add your first transaction" : undefined}
        onAction={onAddNew}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {grouped.map((group) => {
        const netDay = group.dayIncome - group.dayExpense;

        return (
          <div
            key={group.date}
            style={{
              background: 'var(--color-ink-raised)',
              border: '1px solid var(--color-ink-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden'
            }}
          >
            {/* Date Group Header */}
            <div
              style={{
                padding: '10px 16px',
                background: 'var(--color-ink-deep)',
                borderBottom: '1px solid var(--color-ink-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 600, fontSize: 'var(--text-body-sm)', color: 'var(--color-cream)' }}>
                  {formatRelativeDate(group.date)}
                </span>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
                  {group.date}
                </span>
              </div>

              {/* Day Net Total */}
              <div
                className="tabular-nums"
                style={{
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 600,
                  color: netDay >= 0 ? 'var(--color-positive)' : 'var(--color-negative)'
                }}
              >
                {netDay >= 0 ? '+' : ''}{currencySymbol}{netDay.toFixed(2)}
              </div>
            </div>

            {/* Transaction Items */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {group.items.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  currencySymbol={currencySymbol}
                  isSelected={selectedIds.includes(tx.id)}
                  onToggleSelect={onToggleSelect}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
