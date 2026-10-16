/**
 * Date and Period Utilities for VELORA
 */

export function formatDate(dateInput, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', options).format(d);
}

export function formatRelativeDate(dateStr) {
  if (!dateStr) return '';
  const target = new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00' : ''));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDay = new Date(target);
  targetDay.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - targetDay.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays === -1) return 'Tomorrow';

  return formatDate(target, { month: 'short', day: 'numeric' });
}

export function getTodayISO() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysRemaining(targetDateStr) {
  if (!targetDateStr) return null;
  const target = new Date(targetDateStr + (targetDateStr.length === 10 ? 'T23:59:59' : ''));
  const now = new Date();
  if (isNaN(target.getTime())) return null;

  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function getPeriodRange(period = 'monthly', refDate = new Date()) {
  const ref = new Date(refDate);
  const year = ref.getFullYear();
  const month = ref.getMonth();

  if (period === 'daily') {
    const dStr = ref.toISOString().split('T')[0];
    return { start: dStr, end: dStr, label: 'Today' };
  }

  if (period === 'weekly') {
    const day = ref.getDay();
    const diff = ref.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(ref);
    start.setDate(diff);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
      label: 'This Week'
    };
  }

  if (period === 'monthly') {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
      label: new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(ref)
    };
  }

  return { start: '', end: '', label: 'All Time' };
}
