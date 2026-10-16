import { useState, useMemo } from 'react';

export function usePeriod(initialPeriod = 'month') {
  const [period, setPeriod] = useState(initialPeriod); // 'today' | 'week' | 'month' | 'custom'
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const dateFilter = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    if (period === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      return { start: todayStr, end: todayStr, label: 'Today' };
    }

    if (period === 'week') {
      const day = now.getDay();
      const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
      const start = new Date(now);
      start.setDate(diffToMonday);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
        label: 'This Week'
      };
    }

    if (period === 'month') {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
        label: 'This Month'
      };
    }

    if (period === 'custom' && customRange.start && customRange.end) {
      return {
        start: customRange.start,
        end: customRange.end,
        label: `${customRange.start} to ${customRange.end}`
      };
    }

    return { start: '', end: '', label: 'All Time' };
  }, [period, customRange]);

  return {
    period,
    setPeriod,
    customRange,
    setCustomRange,
    dateFilter
  };
}

export default usePeriod;
