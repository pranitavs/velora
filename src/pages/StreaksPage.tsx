import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Flame,
  CheckCircle2,
  Circle,
  Award,
  Calendar,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../components/common/Card.tsx';
import { Button } from '../components/common/Button.tsx';
import {
  generate90DayActivity,
  calculateStats,
} from '../lib/finance.js';
import {
  completeStreakTask,
} from '../lib/storage.js';

export const StreaksPage: React.FC = () => {
  const { appState, onOpenAddTransaction } = useOutletContext<any>();
  const [hoveredDay, setHoveredDay] = useState<{ date: string; isCompleted: boolean } | null>(null);

  const streak = appState?.streak || {
    currentStreak: 0,
    longestStreak: 0,
    completedDates: [],
    todayTasks: { loggedTransaction: false, checkedBudget: false, reviewedGoals: false },
  };

  const transactions = appState?.transactions || [];
  const goals = appState?.goals || [];
  const stats = calculateStats(transactions);

  const matrixDays = generate90DayActivity(streak.completedDates || []);

  const handleTaskClick = (key: string) => {
    completeStreakTask(key);
  };

  // 4 Achievement Badges evaluation
  const badges = [
    {
      id: 'first-ledger',
      title: 'First Ledger Entry',
      description: 'Recorded your first cashflow transaction in Velora.',
      isUnlocked: transactions.length >= 1,
      icon: <Sparkles size={20} />,
      progress: transactions.length >= 1 ? 'Unlocked' : '0/1 Transactions',
    },
    {
      id: 'streak-7',
      title: '7-Day Disciplined',
      description: 'Completed 7 consecutive days of financial tracking.',
      isUnlocked: (streak.longestStreak || 0) >= 7,
      icon: <Flame size={20} />,
      progress: `${Math.min(7, streak.longestStreak || 0)}/7 Days`,
    },
    {
      id: 'goal-crusher',
      title: 'Goal Crusher',
      description: 'Fully funded at least one dedicated savings target.',
      isUnlocked: goals.some((g: any) => g.currentAmount >= g.targetAmount && g.targetAmount > 0),
      icon: <Award size={20} />,
      progress: goals.some((g: any) => g.currentAmount >= g.targetAmount && g.targetAmount > 0)
        ? 'Unlocked'
        : `${goals.length} active goals`,
    },
    {
      id: 'savvy-saver',
      title: 'Savvy Saver',
      description: 'Maintained a healthy savings rate above 20%.',
      isUnlocked: stats.savingsRate >= 20,
      icon: <TrendingUp size={20} />,
      progress: `${stats.savingsRate}% / 20% required`,
    },
  ];

  const allTasksDone =
    streak.todayTasks?.loggedTransaction &&
    streak.todayTasks?.checkedBudget &&
    streak.todayTasks?.reviewedGoals;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Editorial Header */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
          Discipline Matrix & Habit Velocity
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--cream-dim)' }}>
          Personal wealth is built through daily consistency. Track daily rituals and verify your 90-day matrix.
        </p>
      </div>

      {/* Hero Streak Counter Card */}
      <div
        className="velora-card"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(201, 168, 76, 0.12), transparent 70%), var(--ink-raised)',
          padding: '2.5rem',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '2.5rem',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            <Flame size={18} />
            <span>Active Financial Streak</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(3.5rem, 7vw, 5.5rem)',
                lineHeight: 1,
                color: 'var(--cream)',
              }}
            >
              {streak.currentStreak || 0}
            </span>
            <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--cream-dim)' }}>
              Days Active
            </span>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--cream-dim)', maxWidth: '440px', lineHeight: '1.6' }}>
            {allTasksDone
              ? "All today's tasks are complete! Your streak has advanced and today's cell is marked on your matrix."
              : 'Complete all 3 daily tasks below before midnight to advance your active streak.'}
          </p>

          <div className="meta-unboxed-row" style={{ marginTop: '1.5rem', fontSize: '0.8125rem' }}>
            <span>Longest Streak: <strong style={{ color: 'var(--cream)' }}>{streak.longestStreak || 0} days</strong></span>
            <span className="meta-dot-sep">·</span>
            <span>Total Completed Days: <strong style={{ color: 'var(--cream)' }}>{(streak.completedDates || []).length}</strong></span>
          </div>
        </div>

        {/* Daily Tasks Checklist Block */}
        <div
          style={{
            backgroundColor: 'var(--ink)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            border: '1px solid var(--ink-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
              Today's Ritual Checklist
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                color: allTasksDone ? 'var(--positive)' : 'var(--accent)',
                fontWeight: 600,
              }}
            >
              {allTasksDone ? '3/3 Complete' : 'Tasks Pending'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              {
                key: 'loggedTransaction',
                title: 'Log at least 1 transaction today',
                desc: 'Record a cash, UPI, or card purchase in your ledger',
                done: streak.todayTasks?.loggedTransaction,
                action: () => {
                  handleTaskClick('loggedTransaction');
                  onOpenAddTransaction();
                },
              },
              {
                key: 'checkedBudget',
                title: 'Audit weekly cashflow pacing',
                desc: 'Review income vs expenses to avoid deficit drag',
                done: streak.todayTasks?.checkedBudget,
                action: () => handleTaskClick('checkedBudget'),
              },
              {
                key: 'reviewedGoals',
                title: 'Review savings target progress',
                desc: 'Check days remaining on your savings milestones',
                done: streak.todayTasks?.reviewedGoals,
                action: () => handleTaskClick('reviewedGoals'),
              },
            ].map((task) => (
              <button
                key={task.key}
                type="button"
                onClick={task.action}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: task.done ? 'var(--positive-bg)' : 'var(--ink-raised)',
                  border: task.done ? '1px solid rgba(76, 175, 130, 0.3)' : '1px solid var(--ink-border)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  {task.done ? (
                    <CheckCircle2 size={16} style={{ color: 'var(--positive)' }} />
                  ) : (
                    <Circle size={16} style={{ color: 'var(--cream-dim)' }} />
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: task.done ? 'var(--cream)' : 'var(--cream)',
                      textDecoration: task.done ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </p>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--cream-dim)', marginTop: '0.15rem' }}>
                    {task.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 90-Day GitHub-Style Activity Matrix */}
      <Card>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <h3 className="card-title">90-Day Activity Matrix</h3>
              <p className="card-subtitle">Every square represents one day of financial discipline</p>
            </div>
          </div>

          {hoveredDay && (
            <div style={{ fontSize: '0.75rem', color: 'var(--cream)', backgroundColor: 'var(--ink)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--ink-border)' }}>
              <strong>{hoveredDay.date}</strong>: {hoveredDay.isCompleted ? 'Discipline Verified ✓' : 'Inactive'}
            </div>
          )}
        </div>

        <div className="heatmap-container" style={{ marginTop: '0.5rem' }}>
          <div className="heatmap-matrix">
            {matrixDays.map((day) => (
              <div
                key={day.date}
                className={`heatmap-cell ${day.isCompleted ? 'completed' : ''} ${day.isToday ? 'today-ring' : ''}`}
                onMouseEnter={() => setHoveredDay({ date: day.date, isCompleted: day.isCompleted })}
                onMouseLeave={() => setHoveredDay(null)}
                title={`${day.date}: ${day.isCompleted ? 'Active' : 'No activity'}`}
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', fontSize: '0.6875rem', color: 'var(--cream-dim)' }}>
            <span>Less</span>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--ink-border)' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--positive)' }} />
            <span>More Active</span>
          </div>
        </div>
      </Card>

      {/* 4 Achievement Badges */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Award size={20} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
            Financial Achievement Badges
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="velora-card card-hover-lift"
              style={{
                padding: '1.5rem',
                opacity: badge.isUnlocked ? 1 : 0.6,
                backgroundColor: badge.isUnlocked ? 'var(--ink-raised)' : 'var(--ink)',
                border: badge.isUnlocked ? '1px solid var(--ink-border)' : '1px dashed var(--ink-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: badge.isUnlocked ? 'var(--accent-muted)' : 'var(--ink-border)',
                    color: badge.isUnlocked ? 'var(--accent)' : 'var(--cream-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {badge.icon}
                </div>

                <span
                  className={`velora-badge ${badge.isUnlocked ? 'badge-accent' : 'badge-neutral'}`}
                >
                  {badge.isUnlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>

              <h4 style={{ fontSize: '1.0625rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '0.35rem' }}>
                {badge.title}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--cream-dim)', lineHeight: '1.5', marginBottom: '1rem' }}>
                {badge.description}
              </p>

              <div style={{ fontSize: '0.75rem', color: 'var(--cream-subtle)', borderTop: '1px solid var(--ink-border)', paddingTop: '0.75rem' }}>
                Status: <strong style={{ color: badge.isUnlocked ? 'var(--cream)' : 'var(--cream-dim)' }}>{badge.progress}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
