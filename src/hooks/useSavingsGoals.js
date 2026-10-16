import { useState, useEffect, useCallback } from 'react';
import supabase from '../config/supabase.js';
import { useAuth } from './useAuth.js';

export function useSavingsGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async () => {
    if (!user?.id) {
      setGoals([]);
      setContributions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data: goalsData, error: goalsErr } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (goalsErr) throw goalsErr;
      setGoals(goalsData || []);

      const { data: contribData } = await supabase
        .from('savings_contributions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      setContributions(contribData || []);
    } catch (err) {
      console.error('Failed to load savings goals:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (goalData) => {
    if (!user?.id) throw new Error('User not authenticated');
    const targetAmt = parseFloat(goalData.target_amount);
    const startAmt = parseFloat(goalData.starting_amount) || 0;

    const row = {
      user_id: user.id,
      name: goalData.name.trim(),
      target_amount: targetAmt,
      current_amount: startAmt,
      target_date: goalData.target_date || null,
      color: goalData.color || '#C9A84C',
      emoji: goalData.emoji || '🎯',
      status: startAmt >= targetAmt ? 'completed' : 'active'
    };

    const { data, error: insertErr } = await supabase
      .from('savings_goals')
      .insert(row);

    if (insertErr) throw insertErr;

    if (startAmt > 0 && data) {
      const goalId = Array.isArray(data) ? data[0].id : data.id;
      await supabase.from('savings_contributions').insert({
        goal_id: goalId,
        user_id: user.id,
        amount: startAmt,
        note: 'Starting balance',
        date: new Date().toISOString().split('T')[0]
      });
    }

    await fetchGoals();
    return data;
  };

  const addContribution = async (goalId, amount, note = '') => {
    if (!user?.id) throw new Error('User not authenticated');
    const amt = parseFloat(amount);
    if (amt <= 0) throw new Error('Contribution amount must be positive');

    const goal = goals.find(g => g.id === goalId);
    if (!goal) throw new Error('Goal not found');

    const newCurrent = Math.round(((parseFloat(goal.current_amount) || 0) + amt) * 100) / 100;
    const isCompleted = newCurrent >= parseFloat(goal.target_amount);

    // Record contribution
    await supabase.from('savings_contributions').insert({
      goal_id: goalId,
      user_id: user.id,
      amount: amt,
      note: note.trim() || 'Contribution deposit',
      date: new Date().toISOString().split('T')[0]
    });

    // Update goal current amount & status
    await supabase
      .from('savings_goals')
      .update({
        current_amount: newCurrent,
        status: isCompleted ? 'completed' : 'active'
      })
      .eq('id', goalId)
      .eq('user_id', user.id);

    // Record streak activity
    try {
      const today = new Date().toISOString().split('T')[0];
      await supabase.from('daily_activity').insert({
        user_id: user.id,
        activity_date: today,
        activity_type: 'goal_contribution'
      });
    } catch (e) {
      // Ignore duplicate for day
    }

    await fetchGoals();
    return { newCurrent, isCompleted };
  };

  const deleteGoal = async (goalId) => {
    if (!user?.id) throw new Error('User not authenticated');
    await supabase.from('savings_goals').delete().eq('id', goalId).eq('user_id', user.id);
    await fetchGoals();
  };

  return {
    goals,
    contributions,
    loading,
    error,
    refetch: fetchGoals,
    addGoal,
    addContribution,
    deleteGoal
  };
}

export default useSavingsGoals;
