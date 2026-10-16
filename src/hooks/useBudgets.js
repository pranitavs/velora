import { useState, useEffect, useCallback } from 'react';
import supabase from '../config/supabase.js';
import { useAuth } from './useAuth.js';

export function useBudgets(selectedMonth = new Date().getMonth() + 1, selectedYear = new Date().getFullYear()) {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudgets = useCallback(async () => {
    if (!user?.id) {
      setBudgets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('period_month', selectedMonth)
        .eq('period_year', selectedYear);

      if (fetchErr) throw fetchErr;
      setBudgets(data || []);
    } catch (err) {
      console.error('Failed to load budgets:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const setBudget = async ({ category, amount }) => {
    if (!user?.id) throw new Error('User not authenticated');
    const existing = budgets.find(b => b.category === category);

    if (existing) {
      const { data, error: updateErr } = await supabase
        .from('budgets')
        .update({ amount: parseFloat(amount) })
        .eq('id', existing.id)
        .eq('user_id', user.id);

      if (updateErr) throw updateErr;
      await fetchBudgets();
      return data;
    } else {
      const { data, error: insertErr } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          category,
          amount: parseFloat(amount),
          period_month: selectedMonth,
          period_year: selectedYear
        });

      if (insertErr) throw insertErr;

      // Streak activity recording
      try {
        const today = new Date().toISOString().split('T')[0];
        await supabase.from('daily_activity').insert({
          user_id: user.id,
          activity_date: today,
          activity_type: 'set_budget'
        });
      } catch (e) {
        // Ignore duplicate for day
      }

      await fetchBudgets();
      return data;
    }
  };

  const deleteBudget = async (id) => {
    if (!user?.id) throw new Error('User not authenticated');
    const { data, error: delErr } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (delErr) throw delErr;
    await fetchBudgets();
    return data;
  };

  return {
    budgets,
    loading,
    error,
    refetch: fetchBudgets,
    setBudget,
    deleteBudget
  };
}

export default useBudgets;
