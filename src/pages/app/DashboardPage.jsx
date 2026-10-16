import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Percent,
  Plus,
  Flame,
  ArrowRight,
  ReceiptText,
  Target
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import SpendingLineChart from '../../components/charts/SpendingLineChart.jsx';
import CategoryPieChart from '../../components/charts/CategoryPieChart.jsx';
import SavingsProgressChart from '../../components/charts/SavingsProgressChart.jsx';
import TransactionItem from '../../components/transactions/TransactionItem.jsx';
import TransactionForm from '../../components/transactions/TransactionForm.jsx';
import GoalForm from '../../components/goals/GoalForm.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useTransactions } from '../../hooks/useTransactions.js';
import { useSavingsGoals } from '../../hooks/useSavingsGoals.js';
import { useStreak } from '../../hooks/useStreak.js';
import { usePeriod } from '../../hooks/usePeriod.js';
import { useCurrency } from '../../contexts/CurrencyContext.jsx';
import {
  calculateBalance,
  calculateCategoryTotals,
  calculateSavingsRate
} from '../../lib/finance.js';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { currencySymbol } = useCurrency();
  const { transactions, loading: txLoading, addTransaction, deleteTransaction } = useTransactions();
  const { goals, loading: goalsLoading, addGoal } = useSavingsGoals();
  const { streakCount, completedToday } = useStreak();

  const { period, setPeriod, dateFilter } = usePeriod('month');

  // Modals
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);

  // GSAP animated stat numbers
  const balRef = useRef(null);
  const incRef = useRef(null);
  const expRef = useRef(null);
  const savRef = useRef(null);

  // Filter transactions by selected period
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    if (!dateFilter.start || !dateFilter.end) return transactions;
    return transactions.filter(t => t.date >= dateFilter.start && t.date <= dateFilter.end);
  }, [transactions, dateFilter]);

  // Derived financial computations using pure finance functions
  const { income, expenses, balance } = useMemo(() => {
    return calculateBalance(filteredTransactions);
  }, [filteredTransactions]);

  const categoryTotals = useMemo(() => {
    return calculateCategoryTotals(filteredTransactions, 'expense');
  }, [filteredTransactions]);

  const savingsRate = useMemo(() => {
    return calculateSavingsRate(income, expenses);
  }, [income, expenses]);

  // Recent transactions (last 10)
  const recentTransactions = useMemo(() => {
    let list = [...filteredTransactions];
    if (selectedCategoryFilter) {
      list = list.filter(t => t.category === selectedCategoryFilter);
    }
    return list.slice(0, 10);
  }, [filteredTransactions, selectedCategoryFilter]);

  // Count up animation on load
  useEffect(() => {
    const obj = { bal: 0, inc: 0, exp: 0, sav: 0 };
    gsap.to(obj, {
      bal: balance,
      inc: income,
      exp: expenses,
      sav: savingsRate,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        if (balRef.current) balRef.current.innerHTML = `<span style="font-family: var(--font-body), sans-serif; margin-right: 2px;">${currencySymbol}</span>${obj.bal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (incRef.current) incRef.current.innerHTML = `<span style="font-family: var(--font-body), sans-serif; margin-right: 2px;">+${currencySymbol}</span>${obj.inc.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (expRef.current) expRef.current.innerHTML = `<span style="font-family: var(--font-body), sans-serif; margin-right: 2px;">-${currencySymbol}</span>${obj.exp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (savRef.current) savRef.current.textContent = `${obj.sav.toFixed(1)}%`;
      }
    });
  }, [balance, income, expenses, savingsRate, currencySymbol]);

  const userName = profile?.full_name || user?.user_metadata?.full_name || 'there';

  return (
    <div>
      {/* Header with Period Tabs and Add Action */}
      <PageHeader
        title={`Welcome, ${userName}`}
        subtitle={`Financial summary for ${dateFilter.label}.`}
        action={
          <Button variant="primary" onClick={() => setIsAddTxOpen(true)}>
            <Plus size={16} strokeWidth={1.5} /> Add Transaction
          </Button>
        }
      >
        {/* Period Selector Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'var(--color-ink-deep)',
            border: '1px solid var(--color-ink-border)',
            borderRadius: 'var(--radius-md)',
            padding: 3,
            gap: 2
          }}
          role="tablist"
          aria-label="Filter period"
        >
          {['today', 'week', 'month', 'all'].map((pKey) => {
            const labels = { today: 'Today', week: 'This Week', month: 'This Month', all: 'All Time' };
            const isActive = period === pKey;
            return (
              <button
                key={pKey}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setPeriod(pKey)}
                style={{
                  background: isActive ? 'var(--color-ink-raised)' : 'transparent',
                  color: isActive ? 'var(--color-cream)' : 'var(--color-cream-dim)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {labels[pKey]}
              </button>
            );
          })}
        </div>
      </PageHeader>

      {/* SUMMARY STAT CARDS (4 cards) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        {/* Card 1: Balance */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="ui-label">Available Balance</span>
            <Wallet size={16} strokeWidth={1.5} color="var(--color-cream-dim)" />
          </div>
          {txLoading ? (
            <Skeleton height="36px" width="60%" />
          ) : (
            <div
              ref={balRef}
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                color: 'var(--color-cream)'
              }}
            >
              {currencySymbol}{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
          <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)', marginTop: 4 }}>
            Net liquidity after expenses
          </div>
        </Card>

        {/* Card 2: Income */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="ui-label">Total Inflow</span>
            <TrendingUp size={16} strokeWidth={1.5} color="var(--color-positive)" />
          </div>
          {txLoading ? (
            <Skeleton height="36px" width="60%" />
          ) : (
            <div
              ref={incRef}
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                color: 'var(--color-positive)'
              }}
            >
              +{currencySymbol}{income.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
          <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)', marginTop: 4 }}>
            Salary, allowances & deposits
          </div>
        </Card>

        {/* Card 3: Expenses */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="ui-label">Total Outflow</span>
            <TrendingDown size={16} strokeWidth={1.5} color="var(--color-negative)" />
          </div>
          {txLoading ? (
            <Skeleton height="36px" width="60%" />
          ) : (
            <div
              ref={expRef}
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                color: 'var(--color-negative)'
              }}
            >
              -{currencySymbol}{expenses.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
          <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)', marginTop: 4 }}>
            Recorded expenses in period
          </div>
        </Card>

        {/* Card 4: Savings Rate */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="ui-label">Savings Rate</span>
            <Percent size={16} strokeWidth={1.5} color="var(--color-accent)" />
          </div>
          {txLoading ? (
            <Skeleton height="36px" width="60%" />
          ) : (
            <div
              ref={savRef}
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                color: 'var(--color-accent)'
              }}
            >
              {savingsRate.toFixed(1)}%
            </div>
          )}
          <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)', marginTop: 4 }}>
            Recommended target: 20%+
          </div>
        </Card>
      </div>

      {/* STREAK & SAVINGS GOALS ROW */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}
      >
        {/* Streak Mini Widget */}
        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--color-accent-glow)',
                border: '1px solid rgba(201, 168, 76, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent)'
              }}
            >
              <Flame size={24} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span className="tabular-nums" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-accent)' }}>
                  {streakCount}
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>day streak</span>
              </div>
              <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
                {completedToday ? 'Today complete' : 'Log a transaction or review goals'}
              </div>
            </div>
          </div>
          <Link to="/app/streaks" style={{ color: 'var(--color-cream-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-caption)' }}>
            Streaks & Habits <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </Card>

        {/* Primary Savings Goal Highlight */}
        <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span className="ui-label">Active Savings Target</span>
            <Link to="/app/savings-goals" style={{ color: 'var(--color-cream-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-caption)' }}>
              All Goals <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
          {goalsLoading ? (
            <Skeleton height="30px" width="100%" />
          ) : goals.length > 0 ? (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{goals[0].emoji || '🎯'}</span>
                <span>{goals[0].name}</span>
              </div>
              <SavingsProgressChart
                currentAmount={goals[0].current_amount}
                targetAmount={goals[0].target_amount}
                currencySymbol={currencySymbol}
                color={goals[0].color || '#C9A84C'}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-cream-dim)' }}>
                No active savings target
              </span>
              <Button variant="ghost" size="sm" onClick={() => setIsAddGoalOpen(true)}>
                + Create Goal
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* CHARTS SECTION: SPENDING OVER TIME & CATEGORY BREAKDOWN */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '24px',
          marginBottom: '28px'
        }}
        className="dashboard-charts-grid"
      >
        {/* Spending Over Time Line Chart */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
              Spending Over Time
            </h3>
            <span className="ui-label">{dateFilter.label}</span>
          </div>

          <SpendingLineChart
            transactions={filteredTransactions}
            currencySymbol={currencySymbol}
            height={240}
          />
        </Card>

        {/* Category Breakdown Donut */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
              Category Outflow
            </h3>
            {selectedCategoryFilter && (
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: 'var(--text-caption)' }}
              >
                Clear filter
              </button>
            )}
          </div>

          <CategoryPieChart
            categoryTotals={categoryTotals}
            currencySymbol={currencySymbol}
            selectedCategory={selectedCategoryFilter}
            onSelectCategory={setSelectedCategoryFilter}
          />
        </Card>
      </div>

      {/* RECENT TRANSACTIONS */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
              Recent Transactions
            </h3>
            {selectedCategoryFilter && (
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-accent)' }}>
                Filtered by category: {selectedCategoryFilter}
              </p>
            )}
          </div>

          <Link to="/app/transactions" style={{ color: 'var(--color-cream-dim)', textDecoration: 'none', fontSize: 'var(--text-body-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
            View all transactions <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

        {txLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Skeleton height="48px" />
            <Skeleton height="48px" />
            <Skeleton height="48px" />
          </div>
        ) : recentTransactions.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="No transactions in this period"
            description="Add your first transaction to begin tracking your spending trends."
            actionLabel="Add Transaction"
            onAction={() => setIsAddTxOpen(true)}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                currencySymbol={currencySymbol}
                onDelete={deleteTransaction}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Transaction Modal */}
      <TransactionForm
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        onSave={addTransaction}
        currencySymbol={currencySymbol}
      />

      {/* Goal Modal */}
      <GoalForm
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onSave={addGoal}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}
