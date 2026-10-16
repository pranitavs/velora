import React, { useState, useMemo } from 'react';
import { Plus, PieChart, AlertTriangle, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { useBudgets } from '../../hooks/useBudgets.js';
import { useTransactions } from '../../hooks/useTransactions.js';
import { useCurrency } from '../../contexts/CurrencyContext.jsx';
import { calculateBudgetUsage } from '../../lib/finance.js';

const BUDGET_CATEGORIES = [
  { value: 'Food & Dining', label: 'Food & Dining' },
  { value: 'Rent & Living', label: 'Rent & Living' },
  { value: 'Transport', label: 'Transport & Commute' },
  { value: 'Academic & Books', label: 'Academic & Books' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Health', label: 'Health & Fitness' },
  { value: 'Bills & Utilities', label: 'Bills & Utilities' },
  { value: 'Other Expense', label: 'Other Expense' }
];

export default function BudgetsPage() {
  const { currencySymbol } = useCurrency();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const { budgets, loading: budgetsLoading, setBudget, deleteBudget } = useBudgets(selectedMonth, selectedYear);
  const { transactions } = useTransactions();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Food & Dining');
  const [limitAmount, setLimitAmount] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Calculate budget usage using pure finance library
  const budgetUsage = useMemo(() => {
    return calculateBudgetUsage(transactions, budgets, selectedMonth, selectedYear);
  }, [transactions, budgets, selectedMonth, selectedYear]);

  // Aggregate totals
  const { totalBudgeted, totalSpent, totalRemaining } = useMemo(() => {
    let b = 0;
    let s = 0;
    for (const item of budgetUsage) {
      b += item.limit;
      s += item.spent;
    }
    return {
      totalBudgeted: b,
      totalSpent: s,
      totalRemaining: b - s
    };
  }, [budgetUsage]);

  const handleOpenAdd = (categoryToEdit = null, currentLimit = '') => {
    setSelectedCategory(categoryToEdit || 'Food & Dining');
    setLimitAmount(currentLimit ? String(currentLimit) : '');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    setModalError('');
    const amt = parseFloat(limitAmount);
    if (isNaN(amt) || amt <= 0) {
      setModalError('Please enter a monthly limit greater than 0.');
      return;
    }

    setModalLoading(true);
    try {
      await setBudget({ category: selectedCategory, amount: amt });
      setIsModalOpen(false);
    } catch (err) {
      setModalError(err.message || 'Failed to save budget.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category budget?')) {
      await deleteBudget(id);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div>
      <PageHeader
        title="Monthly Budgets"
        subtitle={`Spending constraints and limit trackers for ${monthNames[selectedMonth - 1]} ${selectedYear}.`}
        action={
          <Button variant="primary" onClick={() => handleOpenAdd()}>
            <Plus size={16} strokeWidth={1.5} /> Set Budget
          </Button>
        }
      >
        {/* Month & Year Selectors */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            style={{
              background: 'var(--color-ink-deep)',
              border: '1px solid var(--color-ink-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-cream)',
              padding: '6px 10px',
              fontSize: 'var(--text-body-sm)',
              outline: 'none'
            }}
          >
            {monthNames.map((m, idx) => (
              <option key={m} value={idx + 1}>{m}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{
              background: 'var(--color-ink-deep)',
              border: '1px solid var(--color-ink-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-cream)',
              padding: '6px 10px',
              fontSize: 'var(--text-body-sm)',
              outline: 'none'
            }}
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </PageHeader>

      {/* TOP SUMMARY ROW: Total Budgeted, Total Spent, Remaining */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 28
        }}
      >
        <Card>
          <span className="ui-label">Total Monthly Budget</span>
          <div
            className="tabular-nums"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.85rem',
              color: 'var(--color-cream)',
              marginTop: 4
            }}
          >
            <span style={{ fontFamily: 'var(--font-body)', marginRight: 2 }}>{currencySymbol}</span>{totalBudgeted.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)', marginTop: 2 }}>
            Across {budgets.length} category limit{budgets.length === 1 ? '' : 's'}
          </div>
        </Card>

        <Card>
          <span className="ui-label">Current Expenditure</span>
          <div
            className="tabular-nums"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.85rem',
              color: 'var(--color-negative)',
              marginTop: 4
            }}
          >
            <span style={{ fontFamily: 'var(--font-body)', marginRight: 2 }}>{currencySymbol}</span>{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)', marginTop: 2 }}>
            Total spent in {monthNames[selectedMonth - 1]}
          </div>
        </Card>

        <Card>
          <span className="ui-label">Remaining Safe Spend</span>
          <div
            className="tabular-nums"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.85rem',
              color: totalRemaining >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
              marginTop: 4
            }}
          >
            <span style={{ fontFamily: 'var(--font-body)', marginRight: 2 }}>{currencySymbol}</span>{totalRemaining.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)', marginTop: 2 }}>
            {totalRemaining >= 0 ? 'Within target constraints' : 'Over total allocated budgets'}
          </div>
        </Card>
      </div>

      {/* BUDGET CARDS GRID */}
      {budgetsLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          <Skeleton height="160px" />
          <Skeleton height="160px" />
        </div>
      ) : budgetUsage.length === 0 ? (
        <EmptyState
          icon={PieChart}
          title="No budgets configured for this month"
          description="Setting categorical limits brings peace of mind and prevents end-of-month budget shocks."
          actionLabel="Set your first budget"
          onAction={() => handleOpenAdd()}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 20
          }}
        >
          {budgetUsage.map((b) => {
            // Color thresholds: 0-70% positive, 70-90% warning, 90-100%+ negative
            let barColor = 'var(--color-positive)';
            let isOver = b.percentage >= 90;
            if (b.percentage >= 90) barColor = 'var(--color-negative)';
            else if (b.percentage >= 70) barColor = 'var(--color-warning)';

            return (
              <Card
                key={b.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                  border: isOver ? '1px solid var(--color-negative)' : '1px solid var(--color-ink-border)',
                  animation: isOver ? 'pulseBorder 2s infinite ease-in-out' : 'none'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
                        {b.category}
                      </h3>
                      <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)', marginTop: 2 }}>
                        Limit: {currencySymbol}{b.limit.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        type="button"
                        onClick={() => handleOpenAdd(b.category, b.limit)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-cream-dim)', cursor: 'pointer', padding: 4 }}
                        aria-label={`Edit ${b.category} budget`}
                      >
                        <Edit2 size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(b.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-negative)', cursor: 'pointer', padding: 4 }}
                        aria-label={`Delete ${b.category} budget`}
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      background: 'var(--color-ink)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                      margin: '12px 0 8px'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, b.percentage)}%`,
                        background: barColor,
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)'
                      }}
                    />
                  </div>

                  {/* Metrics Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 'var(--text-body-sm)' }}>
                    <span className="tabular-nums" style={{ color: 'var(--color-cream)', fontWeight: 600 }}>
                      Spent: {currencySymbol}{b.spent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="tabular-nums" style={{ color: barColor, fontWeight: 600, fontSize: 'var(--text-caption)' }}>
                      {b.percentage}% used
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-ink)',
                    border: '1px solid var(--color-ink-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 'var(--text-caption)'
                  }}
                >
                  <span style={{ color: 'var(--color-cream-dim)' }}>
                    {b.remaining >= 0 ? 'Remaining Capacity:' : 'Exceeded By:'}
                  </span>
                  <span
                    className="tabular-nums"
                    style={{
                      fontWeight: 600,
                      color: b.remaining >= 0 ? 'var(--color-cream)' : 'var(--color-negative)'
                    }}
                  >
                    {currencySymbol}{Math.abs(b.remaining).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Set/Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Configure Category Budget"
        subtitle={`Set monthly expenditure threshold for ${monthNames[selectedMonth - 1]} ${selectedYear}.`}
      >
        <form onSubmit={handleSaveBudget} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {modalError && (
            <div style={{ padding: '8px 12px', borderRadius: 6, background: 'rgba(217,96,74,0.1)', color: 'var(--color-negative)', fontSize: '0.875rem' }}>
              {modalError}
            </div>
          )}

          <Select
            label="Category"
            options={BUDGET_CATEGORIES}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          />

          <Input
            label={`Monthly Limit (${currencySymbol})`}
            type="number"
            step="0.01"
            placeholder="e.g. 5000"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            required
            autoFocus
            className="tabular-nums"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={modalLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={modalLoading}>
              Save Budget
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
