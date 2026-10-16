import React from 'react';
import { Flame, CheckCircle, Circle, Award, ShieldCheck } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';

export default function StreakDisplay({
  streakCount = 0,
  completedToday = false,
  tasks = {},
  onToggleTask,
  goals = [],
  budgets = []
}) {
  const hasCompletedGoal = goals.some(g => g.status === 'completed' || Number(g.current_amount) >= Number(g.target_amount));
  const hasBudget = budgets.length > 0;

  const achievements = [
    {
      id: 'streak_7',
      title: '7 Days Consistent',
      description: 'One full week of disciplined check-ins',
      unlocked: streakCount >= 7
    },
    {
      id: 'streak_30',
      title: '30 Days Consistent',
      description: 'A complete month of financial composure',
      unlocked: streakCount >= 30
    },
    {
      id: 'first_goal',
      title: 'First Goal Met',
      description: 'Achieved a target savings milestone',
      unlocked: hasCompletedGoal
    },
    {
      id: 'first_budget',
      title: 'First Budget Set',
      description: 'Defined category limits for the month',
      unlocked: hasBudget
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Left Card: Streak Counter & Daily Checklist */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'var(--color-accent-glow)',
              border: '1px solid rgba(201, 168, 76, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent)'
            }}
          >
            <Flame size={28} strokeWidth={1.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span
                className="tabular-nums"
                style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--color-accent)', lineHeight: 1 }}
              >
                {streakCount}
              </span>
              <span style={{ fontSize: 'var(--text-body)', color: 'var(--color-cream)', fontWeight: 600 }}>
                day streak
              </span>
            </div>
            <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
              {completedToday
                ? 'Streak secured for today! Excellent momentum.'
                : 'Complete your daily check-in to preserve your streak.'}
            </div>
          </div>
        </div>

        {/* Daily Checklist */}
        <div style={{ marginTop: 24, borderTop: '1px solid var(--color-ink-border)', paddingTop: 16 }}>
          <div className="ui-label" style={{ marginBottom: 12 }}>Today's Ritual Checklist</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: tasks.loggedTransaction ? 'rgba(76, 175, 130, 0.08)' : 'var(--color-ink)',
                border: `1px solid ${tasks.loggedTransaction ? 'rgba(76, 175, 130, 0.3)' : 'var(--color-ink-border)'}`,
                cursor: 'pointer',
                fontSize: 'var(--text-body-sm)'
              }}
            >
              <input
                type="checkbox"
                checked={tasks.loggedTransaction}
                onChange={() => onToggleTask('loggedTransaction')}
                style={{ accentColor: 'var(--color-accent)' }}
              />
              <span style={{ color: tasks.loggedTransaction ? 'var(--color-positive)' : 'var(--color-cream)' }}>
                Log at least one transaction
              </span>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: tasks.reviewedBudget ? 'rgba(76, 175, 130, 0.08)' : 'var(--color-ink)',
                border: `1px solid ${tasks.reviewedBudget ? 'rgba(76, 175, 130, 0.3)' : 'var(--color-ink-border)'}`,
                cursor: 'pointer',
                fontSize: 'var(--text-body-sm)'
              }}
            >
              <input
                type="checkbox"
                checked={tasks.reviewedBudget}
                onChange={() => onToggleTask('reviewedBudget')}
                style={{ accentColor: 'var(--color-accent)' }}
              />
              <span style={{ color: tasks.reviewedBudget ? 'var(--color-positive)' : 'var(--color-cream)' }}>
                Review your monthly budget usage
              </span>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: tasks.checkedGoals ? 'rgba(76, 175, 130, 0.08)' : 'var(--color-ink)',
                border: `1px solid ${tasks.checkedGoals ? 'rgba(76, 175, 130, 0.3)' : 'var(--color-ink-border)'}`,
                cursor: 'pointer',
                fontSize: 'var(--text-body-sm)'
              }}
            >
              <input
                type="checkbox"
                checked={tasks.checkedGoals}
                onChange={() => onToggleTask('checkedGoals')}
                style={{ accentColor: 'var(--color-accent)' }}
              />
              <span style={{ color: tasks.checkedGoals ? 'var(--color-positive)' : 'var(--color-cream)' }}>
                Check your savings target pace
              </span>
            </label>
          </div>
        </div>
      </Card>

      {/* Right Card: Achievements (4 Milestones) */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Award size={20} strokeWidth={1.5} color="var(--color-accent)" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
            Financial Milestones
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {achievements.map((ach) => (
            <div
              key={ach.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: ach.unlocked ? 'var(--color-accent-glow)' : 'var(--color-ink)',
                border: `1px solid ${ach.unlocked ? 'rgba(201, 168, 76, 0.35)' : 'var(--color-ink-border)'}`,
                opacity: ach.unlocked ? 1 : 0.6
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-body-sm)', color: ach.unlocked ? 'var(--color-cream)' : 'var(--color-cream-dim)' }}>
                  {ach.title}
                </div>
                <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)', marginTop: 2 }}>
                  {ach.description}
                </div>
              </div>
              <Badge variant={ach.unlocked ? 'accent' : 'neutral'} size="sm">
                {ach.unlocked ? 'Unlocked' : 'Locked'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
