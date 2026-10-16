import { useState, useEffect, useCallback } from 'react';
import supabase from '../config/supabase.js';
import { useAuth } from './useAuth.js';

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (fetchErr) {
        throw fetchErr;
      }
      setTransactions(data || []);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (txData) => {
    if (!user?.id) throw new Error('User not authenticated');
    const row = {
      user_id: user.id,
      type: txData.type,
      amount: parseFloat(txData.amount),
      category: txData.category,
      description: txData.description.trim(),
      date: txData.date,
      payment_method: txData.payment_method || 'UPI',
      notes: txData.notes || '',
      is_recurring: Boolean(txData.is_recurring)
    };

    const { data, error: insertErr } = await supabase
      .from('transactions')
      .insert(row);

    if (insertErr) throw insertErr;

    // Log daily activity for streak!
    try {
      const today = new Date().toISOString().split('T')[0];
      await supabase.from('daily_activity').insert({
        user_id: user.id,
        activity_date: today,
        activity_type: 'log_transaction'
      });
    } catch (e) {
      // Ignore duplicate activity for same day
    }

    await fetchTransactions();
    return data;
  };

  const updateTransaction = async (id, txData) => {
    if (!user?.id) throw new Error('User not authenticated');
    const updates = {
      type: txData.type,
      amount: parseFloat(txData.amount),
      category: txData.category,
      description: txData.description.trim(),
      date: txData.date,
      payment_method: txData.payment_method,
      notes: txData.notes,
      is_recurring: Boolean(txData.is_recurring)
    };

    const { data, error: updateErr } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (updateErr) throw updateErr;
    await fetchTransactions();
    return data;
  };

  const deleteTransaction = async (id) => {
    if (!user?.id) throw new Error('User not authenticated');
    const { data, error: deleteErr } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteErr) throw deleteErr;
    await fetchTransactions();
    return data;
  };

  const deleteMultipleTransactions = async (ids = []) => {
    if (!user?.id || ids.length === 0) return;
    for (const id of ids) {
      await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
    }
    await fetchTransactions();
  };

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteMultipleTransactions
  };
}

export default useTransactions;
