import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Edit2, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

export default function TransactionItem({
  transaction,
  currencySymbol = '₹',
  isSelected = false,
  onToggleSelect,
  onEdit,
  onDelete
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isIncome = transaction.type === 'income';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: isSelected ? 'var(--color-accent-glow)' : 'var(--color-ink-raised)',
        borderBottom: '1px solid var(--color-ink-border)',
        transition: 'background 0.15s ease',
        position: 'relative',
        gap: '12px'
      }}
    >
      {/* Left side: Checkbox + Icon + Details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
        {onToggleSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(transaction.id)}
            style={{ accentColor: 'var(--color-accent)', width: 16, height: 16, cursor: 'pointer' }}
            aria-label={`Select transaction ${transaction.description}`}
          />
        )}

        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: isIncome ? 'rgba(76, 175, 130, 0.12)' : 'rgba(217, 96, 74, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isIncome ? 'var(--color-positive)' : 'var(--color-negative)',
            flexShrink: 0
          }}
        >
          {isIncome ? <ArrowDownLeft size={18} strokeWidth={1.5} /> : <ArrowUpRight size={18} strokeWidth={1.5} />}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 'var(--text-body)',
              color: 'var(--color-cream)',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {transaction.description}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
            <Badge variant="neutral" size="sm">
              {transaction.category}
            </Badge>
            {transaction.payment_method && (
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
                {transaction.payment_method}
              </span>
            )}
            {transaction.notes && (
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-faint)', fontStyle: 'italic' }}>
                • {transaction.notes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Amount + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <div
          className="tabular-nums"
          style={{
            fontSize: 'var(--text-body)',
            fontWeight: 600,
            color: isIncome ? 'var(--color-positive)' : 'var(--color-negative)',
            textAlign: 'right'
          }}
        >
          {isIncome ? '+' : '-'}{currencySymbol}{Number(transaction.amount).toFixed(2)}
        </div>

        {/* Hover action buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.15s ease'
          }}
        >
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(transaction)}
              aria-label={`Edit ${transaction.description}`}
              title="Edit transaction"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-cream-dim)',
                cursor: 'pointer',
                padding: 6,
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Edit2 size={16} strokeWidth={1.5} />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(transaction.id)}
              aria-label={`Delete ${transaction.description}`}
              title="Delete transaction"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-negative)',
                cursor: 'pointer',
                padding: 6,
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
