import React, { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, X, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import IncomeExpenseBarChart from '../../components/charts/IncomeExpenseBarChart.jsx';
import { useTransactions } from '../../hooks/useTransactions.js';
import { usePeriod } from '../../hooks/usePeriod.js';
import { useCurrency } from '../../contexts/CurrencyContext.jsx';
import {
  calculateBalance,
  calculateCategoryTotals,
  calculateSavingsRate
} from '../../lib/finance.js';
import { formatDate } from '../../lib/dates.js';

export default function AnalyticsPage() {
  const { currencySymbol } = useCurrency();
  const { transactions, loading } = useTransactions();
  const { period, setPeriod, dateFilter } = usePeriod('month');

  // Slide-out panel for selected category
  const [activeCategoryDetail, setActiveCategoryDetail] = useState(null);

  // Filter transactions for current period
  const periodTransactions = useMemo(() => {
    if (!transactions) return [];
    if (!dateFilter.start || !dateFilter.end) return transactions;
    return transactions.filter(t => t.date >= dateFilter.start && t.date <= dateFilter.end);
  }, [transactions, dateFilter]);

  // Financial calculations
  const { income, expenses, balance } = useMemo(() => {
    return calculateBalance(periodTransactions);
  }, [periodTransactions]);

  const categoryTotals = useMemo(() => {
    return calculateCategoryTotals(periodTransactions, 'expense');
  }, [periodTransactions]);

  const savingsRate = useMemo(() => {
    return calculateSavingsRate(income, expenses);
  }, [income, expenses]);

  // Insight calculation: days where expense > income
  const daysDeficitCount = useMemo(() => {
    const dayMap = new Map();
    for (const t of periodTransactions) {
      if (!dayMap.has(t.date)) dayMap.set(t.date, { inc: 0, exp: 0 });
      const item = dayMap.get(t.date);
      if (t.type === 'income') item.inc += Number(t.amount) || 0;
      if (t.type === 'expense') item.exp += Number(t.amount) || 0;
    }
    let deficitDays = 0;
    for (const [, val] of dayMap.entries()) {
      if (val.exp > val.inc) deficitDays++;
    }
    return deficitDays;
  }, [periodTransactions]);

  // Top 5 largest single transactions
  const topTransactions = useMemo(() => {
    return [...periodTransactions]
      .filter(t => t.type === 'expense')
      .sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))
      .slice(0, 5);
  }, [periodTransactions]);

  // Real data-driven insight cards (max 3, only if data exists)
  const insights = useMemo(() => {
    const list = [];
    if (categoryTotals.length > 0) {
      const top = categoryTotals[0];
      list.push({
        title: 'Primary Spending Driver',
        text: `${top.category} is your highest expenditure at ${currencySymbol}${top.amount.toLocaleString('en-IN')}, accounting for ${top.percentage}% of all expenses this period.`
      });
    }

    if (savingsRate > 0) {
      list.push({
        title: 'Savings Discipline',
        text: `Your current net savings rate is ${savingsRate.toFixed(1)}%. ${
          savingsRate >= 20
            ? 'You are exceeding the recommended 20% financial wellness benchmark.'
            : 'Aim to reduce discretionary spending to bring your savings closer to the 20% target.'
        }`
      });
    }

    if (daysDeficitCount > 0) {
      list.push({
        title: 'Deficit Frequency',
        text: `Expenses exceeded recorded income on ${daysDeficitCount} distinct day${daysDeficitCount === 1 ? '' : 's'} during this period.`
      });
    }

    return list.slice(0, 3);
  }, [categoryTotals, savingsRate, daysDeficitCount, currencySymbol]);

  // Filtered transactions for the slideout category panel
  const categorySlideoutTransactions = useMemo(() => {
    if (!activeCategoryDetail) return [];
    return periodTransactions.filter(t => t.category === activeCategoryDetail);
  }, [periodTransactions, activeCategoryDetail]);

  return (
    <div>
      <PageHeader
        title="Analytics & Insights"
        subtitle={`Precision analytics and structural metrics for ${dateFilter.label}.`}
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
                  cursor: 'pointer'
                }}
              >
                {labels[pKey]}
              </button>
            );
          })}
        </div>
      </PageHeader>

      {/* SECTION 1: INCOME VS EXPENSES OVERVIEW */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
              Inflow vs Outflow Distribution
            </h3>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
              Temporal comparison of credits and debits throughout the period.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <span className="ui-label" style={{ fontSize: '0.625rem' }}>Total Inflow</span>
              <div className="tabular-nums" style={{ color: 'var(--color-positive)', fontWeight: 600 }}>
                +{currencySymbol}{income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="ui-label" style={{ fontSize: '0.625rem' }}>Total Outflow</span>
              <div className="tabular-nums" style={{ color: 'var(--color-negative)', fontWeight: 600 }}>
                -{currencySymbol}{expenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        <IncomeExpenseBarChart
          transactions={periodTransactions}
          currencySymbol={currencySymbol}
          height={260}
        />

        {/* Insight Line below chart */}
        <div
          style={{
            marginTop: 16,
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-ink)',
            border: '1px solid var(--color-ink-border)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-cream-dim)'
          }}
        >
          {daysDeficitCount > 0 ? (
            <span>Your expenses exceeded recorded income on <strong style={{ color: 'var(--color-cream)' }}>{daysDeficitCount} days</strong> during this period.</span>
          ) : (
            <span>No deficit spending days recorded in this period. Inflow consistently outpaced expenses.</span>
          )}
        </div>
      </Card>

      {/* SECTION 2: CATEGORY BREAKDOWN (Horizontal Bar Chart) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 24,
          marginBottom: 24
        }}
        className="dashboard-charts-grid"
      >
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
                Spending by Category
              </h3>
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
                Click a category to inspect its itemized transactions.
              </p>
            </div>
            <span className="ui-label">Sorted Highest First</span>
          </div>

          {categoryTotals.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-cream-dim)' }}>
              No expenses recorded in this period.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {categoryTotals.map((cat) => {
                const isSelected = activeCategoryDetail === cat.category;
                return (
                  <div
                    key={cat.category}
                    onClick={() => setActiveCategoryDetail(isSelected ? null : cat.category)}
                    style={{
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--color-accent-glow)' : 'transparent',
                      border: isSelected ? '1px solid var(--color-accent)' : '1px solid transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                      <span style={{ fontWeight: 500, color: 'var(--color-cream)', fontSize: 'var(--text-body-sm)' }}>
                        {cat.category}
                      </span>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                        <span className="tabular-nums" style={{ color: 'var(--color-cream)', fontWeight: 600 }}>
                          {currencySymbol}{cat.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="tabular-nums" style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
                          {cat.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Horizontal Bar */}
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        background: 'var(--color-ink)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(100, cat.percentage)}%`,
                          background: 'var(--color-accent)',
                          borderRadius: 'var(--radius-full)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* SECTION 3: SAVINGS RATE TREND & BENCHMARK */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
                Savings Benchmark
              </h3>
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
                Target: 20% savings rule of thumb.
              </p>
            </div>
            <Badge variant={savingsRate >= 20 ? 'positive' : 'warning'}>
              {savingsRate >= 20 ? 'Target Met' : 'Under Target'}
            </Badge>
          </div>

          <div
            style={{
              padding: '24px',
              background: 'var(--color-ink)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-ink-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              marginBottom: 16
            }}
          >
            <div className="ui-label" style={{ marginBottom: 6 }}>Current Savings Rate</div>
            <div
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3rem',
                color: 'var(--color-accent)',
                lineHeight: 1
              }}
            >
              {savingsRate.toFixed(1)}%
            </div>
            <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)', marginTop: 8 }}>
              {savingsRate >= 20
                ? 'Outstanding composure. You are retaining over one fifth of all earnings.'
                : 'Consider optimizing dining or entertainment categories to achieve 20%.'}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-ink-border)', paddingTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-body-sm)' }}>
              <span style={{ color: 'var(--color-cream-dim)' }}>Retained Liquidity:</span>
              <span className="tabular-nums" style={{ color: 'var(--color-cream)', fontWeight: 600 }}>
                {currencySymbol}{Math.max(0, balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* SECTION 4 & 5: TOP 5 EXPENSES & DATA-DRIVEN INSIGHTS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 24,
          marginBottom: 24
        }}
        className="dashboard-charts-grid"
      >
        {/* Top 5 Transactions */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
              Largest Single Outflows
            </h3>
            <span className="ui-label">Top 5</span>
          </div>

          {topTransactions.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--color-cream-dim)' }}>
              No expenses recorded in this period.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topTransactions.map((tx, idx) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'var(--color-ink)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-ink-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)', width: 14 }}>
                      #{idx + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 'var(--text-body-sm)', color: 'var(--color-cream)' }}>
                        {tx.description}
                      </div>
                      <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
                        {tx.category} • {formatDate(tx.date)}
                      </div>
                    </div>
                  </div>

                  <div className="tabular-nums" style={{ color: 'var(--color-negative)', fontWeight: 600 }}>
                    -{currencySymbol}{Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Data-Driven Insight Cards */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Sparkles size={18} strokeWidth={1.5} color="var(--color-accent)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
              Portfolio Observations
            </h3>
          </div>

          {insights.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--color-cream-dim)' }}>
              Add more transaction history to generate verified financial insights.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {insights.map((ins, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-ink)',
                    border: '1px solid var(--color-ink-border)'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-body-sm)', color: 'var(--color-cream)', marginBottom: 4 }}>
                    {ins.title}
                  </div>
                  <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)', lineHeight: 1.5 }}>
                    {ins.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Slide-out Category Detail Modal / Drawer */}
      {activeCategoryDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(8, 8, 7, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setActiveCategoryDetail(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '100vh',
              background: 'var(--color-ink-deep)',
              borderLeft: '1px solid var(--color-ink-border)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-elevated)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <span className="ui-label">Category Ledger</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-cream)' }}>
                  {activeCategoryDetail}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCategoryDetail(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-cream-dim)', cursor: 'pointer', padding: 6 }}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {categorySlideoutTransactions.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-ink)',
                    border: '1px solid var(--color-ink-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{tx.description}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-cream-dim)' }}>{formatDate(tx.date)}</div>
                  </div>
                  <div className="tabular-nums" style={{ color: 'var(--color-negative)', fontWeight: 600 }}>
                    -{currencySymbol}{Number(tx.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
