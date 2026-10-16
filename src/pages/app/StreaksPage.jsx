import React from 'react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import StreakDisplay from '../../components/streaks/StreakDisplay.jsx';
import ActivityCalendar from '../../components/streaks/ActivityCalendar.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { useStreak } from '../../hooks/useStreak.js';
import { useSavingsGoals } from '../../hooks/useSavingsGoals.js';
import { useBudgets } from '../../hooks/useBudgets.js';

export default function StreaksPage() {
  const {
    activities,
    streakCount,
    completedToday,
    tasks,
    toggleTask,
    loading
  } = useStreak();

  const { goals } = useSavingsGoals();
  const { budgets } = useBudgets();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PageHeader
        title="Streaks & Habits"
        subtitle="Daily financial consistency replaces anxiety with clarity. Momentum compounds over time."
      />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Skeleton height="180px" />
          <Skeleton height="220px" />
        </div>
      ) : (
        <>
          {/* Main Streak Counter, Daily Tasks, & Milestones */}
          <StreakDisplay
            streakCount={streakCount}
            completedToday={completedToday}
            tasks={tasks}
            onToggleTask={toggleTask}
            goals={goals}
            budgets={budgets}
          />

          {/* 52-Week Contribution Frequency Calendar */}
          <ActivityCalendar activities={activities} />
        </>
      )}
    </div>
  );
}
