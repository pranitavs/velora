import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Plus,
  Flame,
  Target,
  ArrowRight,
  CheckCircle2,
  Circle,
  ReceiptText,
} from 'lucide-react';
import { Button } from '../components/common/Button.tsx';
import { Card } from '../components/common/Card.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';
import {
  formatCurrency,
  filterTransactionsByPeriod,
  calculateStats,
  calculateCategoryTotals,
  getCashflowChartData,
  calculateGoalMetrics,
} from '../lib/finance.js';
import { completeStreakTask } from '../lib/storage.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

ChartJS.defaults.color = '#A89F94';
ChartJS.defaults.borderColor = '#2C2A26';
ChartJS.defaults.font.family = '"DM Sans", sans-serif';

export const DashboardPage: React.FC = () => {
  const { appState, onOpenAddTransaction } = useOutletContext<any>();
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');

  const currency = appState?.user?.currency || 'INR';
  const allTransactions = appState?.transactions || [];
  const filteredTransactions = filterTransactionsByPeriod(allTransactions, period);
  const stats = calculateStats(filteredTransactions);
  const categorySummary = calculateCategoryTotals(filteredTransactions);
  const chartData = getCashflowChartData(filteredTransactions, period);
  const goals = appState?.goals || [];
  const streak = appState?.streak || {
    currentStreak: 0,
    todayTasks: { loggedTransaction: false, checkedBudget: false, reviewedGoals: false },
  };

  const handleTaskToggle = (taskKey: string) => {
    completeStreakTask(taskKey);
  };

  // Donut chart config
  const donutData = {
    labels: categorySummary.breakdown.map((b) => b.category),
    datasets: [
      {
        data: categorySummary.breakdown.map((b) => b.amount),
        backgroundColor: categorySummary.breakdown.map((b) => b.color),
        borderColor: '#1A1916',
        borderWidth: 2,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.raw || 0;
            return ` ${context.label}: ${formatCurrency(val, currency)}`;
          },
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: { color: 'rgba(44, 42, 38, 0.6)' },
        ticks: { color: '#A89F94', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(44, 42, 38, 0.6)' },
        ticks: {
          color: '#A89F94',
          font: { size: 11 },
          callback: (value: any) => `${currency === 'INR' ? '₹' : '$'}${value}`,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: { boxWidth: 12, usePointStyle: true },
      },
    },
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Controls: Period Tabs & Quick Summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
            Cockpit Overview
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--cream-dim)' }}>
            Showing performance for{' '}
            <strong style={{ color: 'var(--cream)' }}>
              {period === 'today' ? 'Today' : period === 'week' ? 'Past 7 Days' : 'Past 30 Days'}
            </strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Period selector */}
          <div className="segmented-tabs">
            <button
              onClick={() => setPeriod('today')}
              className={`segmented-tab-btn ${period === 'today' ? 'active' : ''}`}
            >
              Today
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`segmented-tab-btn ${period === 'week' ? 'active' : ''}`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`segmented-tab-btn ${period === 'month' ? 'active' : ''}`}
            >
              Month
            </button>
          </div>

          <Button variant="primary" size="sm" onClick={onOpenAddTransaction} icon={<Plus size={15} />}>
            Log Entry
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="stats-grid">
        {/* Net Balance */}
        <div className="stat-card">
          <div className="stat-label">
            <span>Net Balance</span>
            <Wallet size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="stat-value" style={{ color: stats.netBalance >= 0 ? 'var(--cream)' : 'var(--negative)' }}>
            {formatCurrency(stats.netBalance, currency)}
          </div>
          <div className="stat-sub">
            <span style={{ color: stats.netBalance >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
              {stats.netBalance >= 0 ? 'Surplus buffer' : 'Deficit drag'}
            </span>
            <span>· Inflow vs Outflow</span>
          </div>
        </div>

        {/* Total Inflow */}
        <div className="stat-card">
          <div className="stat-label">
            <span>Total Inflow</span>
            <ArrowUpRight size={16} style={{ color: 'var(--positive)' }} />
          </div>
          <div className="stat-value" style={{ color: 'var(--positive)' }}>
            {formatCurrency(stats.totalIncome, currency)}
          </div>
          <div className="stat-sub">
            <span>{filteredTransactions.filter((t: any) => t.type === 'income').length} deposits</span>
            <span>· Academic & freelance</span>
          </div>
        </div>

        {/* Total Outflow */}
        <div className="stat-card">
          <div className="stat-label">
            <span>Total Outflow</span>
            <ArrowDownRight size={16} style={{ color: 'var(--negative)' }} />
          </div>
          <div className="stat-value" style={{ color: 'var(--negative)' }}>
            {formatCurrency(stats.totalExpenses, currency)}
          </div>
          <div className="stat-sub">
            <span>{filteredTransactions.filter((t: any) => t.type === 'expense').length} debits</span>
            <span>· Living & education costs</span>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="stat-card">
          <div className="stat-label">
            <span>Savings Rate</span>
            <Percent size={16} style={{ color: 'var(--warning)' }} />
          </div>
          <div className="stat-value" style={{ color: stats.savingsRate >= 20 ? 'var(--accent)' : 'var(--cream-dim)' }}>
            {stats.savingsRate}%
          </div>
          <div className="stat-sub">
            <span style={{ color: stats.savingsRate >= 20 ? 'var(--positive)' : 'var(--cream-dim)' }}>
              {stats.savingsRate >= 20 ? 'Target achieved' : 'Benchmark: 20%'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts & Widgets Grid */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          title={`No entries recorded for ${period === 'today' ? 'today' : period === 'week' ? 'this week' : 'this month'}`}
          description="Log campus expenses, allowances, or freelance gig pay to activate your cashflow line chart and spending donut."
          action={{
            label: '+ Log Your First Entry',
            onClick: onOpenAddTransaction,
          }}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
          {/* Cashflow Timeline Chart */}
          <Card>
            <div className="card-header">
              <div>
                <h3 className="card-title">Cashflow Trajectory</h3>
                <p className="card-subtitle">Inflow deposits vs Outflow spending over time</p>
              </div>
            </div>
            <div style={{ height: '280px', width: '100%', position: 'relative' }}>
              <Line data={chartData} options={lineOptions} />
            </div>
          </Card>

          {/* Category Spending Donut */}
          <Card>
            <div className="card-header">
              <div>
                <h3 className="card-title">Outflow Allocation</h3>
                <p className="card-subtitle">Spending by category</p>
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cream)' }}>
                {formatCurrency(categorySummary.totalExpenseAmount, currency)}
              </span>
            </div>

            {categorySummary.breakdown.length === 0 ? (
              <p style={{ color: 'var(--cream-dim)', fontSize: '0.8125rem', textAlign: 'center', padding: '3rem 0' }}>
                No expenses logged in this timeframe.
              </p>
            ) : (
              <div>
                <div style={{ height: '180px', position: 'relative', marginBottom: '1.25rem' }}>
                  <Doughnut data={donutData} options={donutOptions} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '120px', overflowY: 'auto' }}>
                  {categorySummary.breakdown.slice(0, 4).map((item) => (
                    <div
                      key={item.category}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                        <span style={{ color: 'var(--cream)' }}>{item.category}</span>
                      </div>
                      <span style={{ color: 'var(--cream-dim)' }}>
                        {formatCurrency(item.amount, currency)} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Lower Row: Recent Transactions + Goals Preview + Streak Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
        {/* Recent Transactions List */}
        <Card>
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Transactions</h3>
              <p className="card-subtitle">Last recorded activity</p>
            </div>
            <Link to="/transactions" className="velora-btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {allTransactions.length === 0 ? (
            <p style={{ color: 'var(--cream-dim)', fontSize: '0.8125rem', padding: '1rem 0' }}>
              No transactions recorded yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {allTransactions.slice(0, 5).map((t: any) => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--ink)',
                    border: '1px solid var(--ink-border)',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cream)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {t.description}
                    </p>
                    <div className="meta-unboxed-row" style={{ marginTop: '0.2rem' }}>
                      <span>{t.category}</span>
                      <span className="meta-dot-sep">·</span>
                      <span>{t.paymentMethod || 'UPI'}</span>
                      <span className="meta-dot-sep">·</span>
                      <span>{t.date}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: t.type === 'income' ? 'var(--positive)' : 'var(--cream)',
                      whiteSpace: 'nowrap',
                      marginLeft: '1rem',
                    }}
                  >
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount, currency)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Goals & Daily Checklist Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Daily Streak Checklist Widget */}
          <Card>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={18} style={{ color: 'var(--accent)' }} />
                <h3 className="card-title">Daily Discipline</h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
                {streak.currentStreak} Day Streak
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--cream-dim)', marginBottom: '1rem' }}>
              Complete all 3 daily tasks to advance your streak matrix.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { key: 'loggedTransaction', label: 'Log at least 1 transaction today', done: streak.todayTasks?.loggedTransaction },
                { key: 'checkedBudget', label: 'Audit weekly cashflow pacing', done: streak.todayTasks?.checkedBudget },
                { key: 'reviewedGoals', label: 'Review savings target progress', done: streak.todayTasks?.reviewedGoals },
              ].map((task) => (
                <button
                  key={task.key}
                  type="button"
                  onClick={() => handleTaskToggle(task.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: task.done ? 'var(--positive-bg)' : 'var(--ink)',
                    border: task.done ? '1px solid rgba(76, 175, 130, 0.3)' : '1px solid var(--ink-border)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {task.done ? (
                    <CheckCircle2 size={16} style={{ color: 'var(--positive)', flexShrink: 0 }} />
                  ) : (
                    <Circle size={16} style={{ color: 'var(--cream-dim)', flexShrink: 0 }} />
                  )}
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      color: task.done ? 'var(--cream)' : 'var(--cream-dim)',
                      textDecoration: task.done ? 'line-through' : 'none',
                    }}
                  >
                    {task.label}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Savings Goals Preview */}
          <Card>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={18} style={{ color: 'var(--positive)' }} />
                <h3 className="card-title">Savings Targets</h3>
              </div>
              <Link to="/goals" className="velora-btn btn-ghost btn-sm" style={{ padding: '0.2rem 0.5rem' }}>
                Manage
              </Link>
            </div>

            {goals.length === 0 ? (
              <p style={{ color: 'var(--cream-dim)', fontSize: '0.8125rem' }}>
                No active savings goals. Create your first goal to track progress.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {goals.slice(0, 2).map((goal: any) => {
                  const m = calculateGoalMetrics(goal);
                  return (
                    <div key={goal.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cream)' }}>
                          {goal.title}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
                          {m.progressPercent}%
                        </span>
                      </div>
                      <div className="progress-track" style={{ marginBottom: '0.35rem' }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${m.progressPercent}%`,
                            backgroundColor: m.isCompleted ? 'var(--positive)' : 'var(--accent)',
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--cream-dim)' }}>
                        <span>{formatCurrency(goal.currentAmount, currency)} saved</span>
                        <span>{m.daysRemaining} days left</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
