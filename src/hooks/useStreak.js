import { useState, useEffect, useCallback } from 'react';
import supabase from '../config/supabase.js';
import { useAuth } from './useAuth.js';
import { calculateStreakFromActivity } from '../lib/finance.js';

export function useStreak() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [streakCount, setStreakCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedToday, setCompletedToday] = useState(false);

  // Today's checklist items (state tracked per session / day)
  const [tasks, setTasks] = useState({
    loggedTransaction: false,
    reviewedBudget: false,
    checkedGoals: false
  });

  const fetchActivity = useCallback(async () => {
    if (!user?.id) {
      setActivities([]);
      setStreakCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('daily_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('activity_date', { ascending: false });

      if (error) throw error;

      const dates = (data || []).map(a => a.activity_date);
      setActivities(data || []);

      const todayStr = new Date().toISOString().split('T')[0];
      const hasToday = dates.includes(todayStr);
      setCompletedToday(hasToday);

      const count = calculateStreakFromActivity(dates, todayStr);
      setStreakCount(count);
    } catch (err) {
      console.error('Failed to load streak activity:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const recordDayComplete = async (activityType = 'daily_review') => {
    if (!user?.id) return;
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      await supabase.from('daily_activity').insert({
        user_id: user.id,
        activity_date: todayStr,
        activity_type: activityType
      });
      await fetchActivity();
    } catch (err) {
      // Ignore if already logged today
    }
  };

  const toggleTask = (taskKey) => {
    setTasks(prev => {
      const next = { ...prev, [taskKey]: !prev[taskKey] };
      // If all 3 tasks are checked, automatically record today's streak activity!
      if (next.loggedTransaction && next.reviewedBudget && next.checkedGoals && !completedToday) {
        recordDayComplete('daily_checklist_complete');
      }
      return next;
    });
  };

  return {
    activities,
    streakCount,
    completedToday,
    tasks,
    toggleTask,
    recordDayComplete,
    loading,
    refetch: fetchActivity
  };
}

export default useStreak;
