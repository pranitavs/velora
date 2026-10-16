import React from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Bar,
  Line,
} from 'react-chartjs-2';
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Calendar,
} from 'lucide-react';
import { Card } from '../components/common/Card.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';
import {
  formatCurrency,
  calculateStats,
  calculateCategoryTotals,
  generateDataInsights,
  CATEGORIES,
} from '../lib/finance.js';

export const AnalyticsPage: React.FC = () => {
  const { appState, onOpenAddTransaction } = useOutletContext<any>();
  const currency = appState?.user?.currency || 'INR';
  const transactions = appState?.transactions || [];

  const stats = calculateStats(transactions);
  const { breakdown } = calculateCategoryTotals(transactions);
  const insights = generateDataInsights(transactions, currency);

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<BarChart2 size={36} />}
        title="Analytics Ledger Empty"
        description="Log your daily campus expenses and income streams to unlock institutional cashflow bar charts, category distributions, and automated financial insights."
        action={{
          label: '+ Log Your First Entry',
          onClick: onOpenAddTransaction,
        }}
      />
    );
  }

  // Monthly / Period Income vs Expenses Bar Chart Data
  // Group by month YYYY-MM
  const monthMap: { [key: string]: { income: number; expense: number } } = {};
  const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const t of sorted) {
    if (!t.date) continue;
    const monthKey = t.date.substring(0, 7); // YYYY-MM
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') monthMap[monthKey].income += t.amount;
    else monthMap[monthKey].expense += t.amount;
  }

  const monthLabels = Object.keys(monthMap);
  const incomeBars = monthLabels.map((m) => monthMap[m].income);
  const expenseBars = monthLabels.map((m) => monthMap[m].expense);

  const barChartData = {
    labels: monthLabels.map((m) => {
      const [year, month] = m.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }),
    datasets: [
      {
        label: 'Inflow (Income)',
        data: incomeBars,
        backgroundColor: '#4CAF82',
        borderRadius: 4,
      },
      {
        label: 'Outflow (Expenses)',
        data: expenseBars,
        backgroundColor: '#D9604A',
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(44, 42, 38, 0.6)' },
        ticks: { color: '#A89F94' },
      },
      y: {
        grid: { color: 'rgba(44, 42, 38, 0.6)' },
        ticks: {
          color: '#A89F94',
          callback: (v: any) => `${currency === 'INR' ? '₹' : '$'}${v}`,
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

  // Category horizontal bar chart
  const horizontalBarData = {
    labels: breakdown.slice(0, 7).map((b) => b.category),
    datasets: [
      {
        label: 'Amount Spent',
        data: breakdown.slice(0, 7).map((b) => b.amount),
        backgroundColor: breakdown.slice(0, 7).map((b) => b.color),
        borderRadius: 4,
      },
    ],
  };

  const horizontalBarOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(44, 42, 38, 0.6)' },
        ticks: {
          color: '#A89F94',
          callback: (v: any) => `${currency === 'INR' ? '₹' : '$'}${v}`,
        },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#F0EDE6' },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  // Savings rate trend
  const savingsRateTrendData = {
    labels: monthLabels.map((m) => {
      const [year, month] = m.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }),
    datasets: [
      {
        label: 'Savings Rate (%)',
        data: monthLabels.map((m) => {
          const inc = monthMap[m].income;
          const exp = monthMap[m].expense;
          if (inc <= 0) return 0;
          return Math.max(0, Math.min(100, Math.round(((inc - exp) / inc) * 100)));
        }),
        borderColor: '#C9A84C',
        backgroundColor: 'rgba(201, 168, 76, 0.1)',
        tension: 0.3,
        pointBackgroundColor: '#C9A84C',
        pointRadius: 4,
        fill: true,
      },
    ],
  };

  const savingsRateOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(44, 42, 38, 0.6)' },
        ticks: { color: '#A89F94' },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(44, 42, 38, 0.6)' },
        ticks: {
          color: '#A89F94',
          callback: (v: any) => `${v}%`,
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Editorial Overview Header */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
          Capital Analytics & Financial Behavior
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--cream-dim)' }}>
          Detailed cashflow velocity, burn rate by category, and automated editorial observations.
        </p>
      </div>

      {/* Top 2 Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Income vs Expenses Bar Chart */}
        <Card>
          <div className="card-header">
            <div>
              <h3 className="card-title">Income vs Expenses</h3>
              <p className="card-subtitle">Monthly inflow deposits compared against outflow costs</p>
            </div>
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </Card>

        {/* Category Horizontal Bar Chart */}
        <Card>
          <div className="card-header">
            <div>
              <h3 className="card-title">Category Ranking</h3>
              <p className="card-subtitle">Top expenditures ordered by absolute magnitude</p>
            </div>
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <Bar data={horizontalBarData} options={horizontalBarOptions} />
          </div>
        </Card>
      </div>

      {/* Savings Rate Trend Line */}
      <Card>
        <div className="card-header">
          <div>
            <h3 className="card-title">Savings Rate Trendline</h3>
            <p className="card-subtitle">Percentage of total income retained each month (Target: ≥ 20%)</p>
          </div>
          <span style={{ fontSize: '1.125rem', fontFamily: 'var(--font-serif)', color: 'var(--accent)' }}>
            Current Rate: {stats.savingsRate}%
          </span>
        </div>
        <div style={{ height: '220px', width: '100%' }}>
          <Line data={savingsRateTrendData} options={savingsRateOptions} />
        </div>
      </Card>

      {/* Honest Data Insights Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Lightbulb size={20} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
            Terminal Financial Observations
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {insights.map((ins, index) => {
            const isNegative = ins.type === 'negative';
            const isPositive = ins.type === 'positive';
            const isWarning = ins.type === 'warning';

            return (
              <div
                key={index}
                className="velora-card card-hover-lift"
                style={{
                  padding: '1.25rem',
                  borderLeft: isPositive
                    ? '3px solid var(--positive)'
                    : isNegative
                    ? '3px solid var(--negative)'
                    : isWarning
                    ? '3px solid var(--warning)'
                    : '1px solid var(--ink-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {isPositive && <CheckCircle size={16} style={{ color: 'var(--positive)' }} />}
                  {isNegative && <AlertTriangle size={16} style={{ color: 'var(--negative)' }} />}
                  {isWarning && <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />}
                  {!isPositive && !isNegative && !isWarning && <HelpCircle size={16} style={{ color: 'var(--accent)' }} />}
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--cream)' }}>
                    {ins.title}
                  </h4>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--cream-dim)', lineHeight: '1.55' }}>
                  {ins.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
