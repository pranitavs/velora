// Financial Calculations Engine for VELORA (src/lib/finance.js)

export const CURRENCY_MAP = {
  INR: { symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  USD: { symbol: '$', locale: 'en-US', name: 'US Dollar' },
  EUR: { symbol: '€', locale: 'de-DE', name: 'Euro' },
  GBP: { symbol: '£', locale: 'en-GB', name: 'British Pound' },
};

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Education',
  'Housing',
  'Bills',
  'Healthcare',
  'Entertainment',
  'Travel',
  'Other',
];

export const CATEGORY_COLORS = {
  Food: '#E8A838', // Amber warning
  Transport: '#5E81AC', // Soft blue
  Shopping: '#B48EAD', // Plum
  Education: '#C9A84C', // Velora gold
  Housing: '#88C0D0', // Ice blue
  Bills: '#D9604A', // Crimson negative
  Healthcare: '#4CAF82', // Mint positive
  Entertainment: '#D08770', // Terracotta
  Travel: '#A3BE8C', // Sage
  Other: '#A89F94', // Cream dim
};

export const PAYMENT_METHODS = ['UPI', 'Cash', 'Card', 'Bank Transfer'];

/**
 * Format currency with exact symbol, 2 decimal places, and tabular-nums friendly string
 */
export function formatCurrency(amount, currencyCode = 'INR', options = { sign: false }) {
  const code = (currencyCode || 'INR').toUpperCase();
  const config = CURRENCY_MAP[code] || CURRENCY_MAP.INR;
  const num = Number(amount) || 0;
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const formattedNumber = absNum.toLocaleString(config.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const signStr = options.sign ? (isNegative ? '- ' : '+ ') : (isNegative ? '- ' : '');
  return `${signStr}${config.symbol}${formattedNumber}`;
}

/**
 * Filter transactions by timeframe
 */
export function filterTransactionsByPeriod(transactions = [], period = 'month') {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  return transactions.filter((t) => {
    if (!t.date) return false;
    const txDate = new Date(t.date);
    
    if (period === 'today') {
      return t.date === todayStr;
    }
    if (period === 'week') {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      return txDate >= sevenDaysAgo && txDate <= now;
    }
    if (period === 'month') {
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return txDate >= thirtyDaysAgo && txDate <= now;
    }
    return true; // 'all'
  });
}

/**
 * Calculate KPI summary stats
 */
export function calculateStats(transactions = []) {
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const t of transactions) {
    const amt = Math.abs(Number(t.amount) || 0);
    if (t.type === 'income') {
      totalIncome += amt;
    } else if (t.type === 'expense') {
      totalExpenses += amt;
    }
  }

  const netBalance = totalIncome - totalExpenses;
  let savingsRate = 0;
  if (totalIncome > 0) {
    savingsRate = Math.max(0, Math.min(100, ((totalIncome - totalExpenses) / totalIncome) * 100));
  }

  return {
    totalIncome: Number(totalIncome.toFixed(2)),
    totalExpenses: Number(totalExpenses.toFixed(2)),
    netBalance: Number(netBalance.toFixed(2)),
    savingsRate: Number(savingsRate.toFixed(1)),
    transactionCount: transactions.length,
  };
}

/**
 * Aggregate category totals and shares
 */
export function calculateCategoryTotals(transactions = []) {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totals = {};
  let totalExpenseAmount = 0;

  for (const cat of CATEGORIES) {
    totals[cat] = 0;
  }

  for (const t of expenseTransactions) {
    const cat = CATEGORIES.includes(t.category) ? t.category : 'Other';
    const amt = Math.abs(Number(t.amount) || 0);
    totals[cat] = (totals[cat] || 0) + amt;
    totalExpenseAmount += amt;
  }

  const list = Object.entries(totals)
    .map(([category, amount]) => {
      const percentage = totalExpenseAmount > 0 ? (amount / totalExpenseAmount) * 100 : 0;
      return {
        category,
        amount: Number(amount.toFixed(2)),
        percentage: Number(percentage.toFixed(1)),
        color: CATEGORY_COLORS[category] || '#A89F94',
      };
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return {
    breakdown: list,
    totalExpenseAmount: Number(totalExpenseAmount.toFixed(2)),
  };
}

/**
 * Group transactions by date for date-grouped list view
 */
export function groupTransactionsByDate(transactions = []) {
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const groups = {};

  for (const t of sorted) {
    const dateKey = t.date || 'Undated';
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(t);
  }

  return Object.entries(groups).map(([date, items]) => {
    let dayIncome = 0;
    let dayExpense = 0;
    for (const item of items) {
      if (item.type === 'income') dayIncome += item.amount;
      else dayExpense += item.amount;
    }
    return {
      date,
      items,
      dayIncome,
      dayExpense,
    };
  });
}

/**
 * Calculate goal timelines and required monthly contribution
 */
export function calculateGoalMetrics(goal) {
  const target = Math.abs(Number(goal.targetAmount) || 0);
  const current = Math.abs(Number(goal.currentAmount) || 0);
  const remainingAmount = Math.max(0, target - current);
  const progressPercent = target > 0 ? Math.min(100, Math.max(0, (current / target) * 100)) : 0;

  const targetDateObj = new Date(goal.targetDate);
  const today = new Date();
  const diffTime = targetDateObj.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const monthsRemaining = Math.max(1, daysRemaining / 30.4);

  const requiredMonthly = remainingAmount > 0 ? remainingAmount / monthsRemaining : 0;

  return {
    target,
    current,
    remainingAmount: Number(remainingAmount.toFixed(2)),
    progressPercent: Number(progressPercent.toFixed(1)),
    daysRemaining,
    requiredMonthly: Number(requiredMonthly.toFixed(2)),
    isCompleted: current >= target,
  };
}

/**
 * Interactive Contribution Simulator
 * Given a goal, how does saving an extra amount accelerate completion?
 */
export function simulateContribution(goal, extraMonthlyAmount) {
  const metrics = calculateGoalMetrics(goal);
  const extra = Math.max(0, Number(extraMonthlyAmount) || 0);
  const baseMonthly = metrics.requiredMonthly;
  const newMonthly = baseMonthly + extra;

  if (metrics.remainingAmount <= 0) {
    return {
      acceleratedMonths: 0,
      monthsSaved: 0,
      newCompletionDate: goal.targetDate,
      feasibility: 'Already completed',
    };
  }

  const acceleratedMonths = newMonthly > 0 ? metrics.remainingAmount / newMonthly : 999;
  const originalMonths = baseMonthly > 0 ? metrics.remainingAmount / baseMonthly : 999;
  const monthsSaved = Math.max(0, originalMonths - acceleratedMonths);

  const newDate = new Date();
  newDate.setDate(newDate.getDate() + Math.round(acceleratedMonths * 30.4));
  const newCompletionDate = newDate.toISOString().split('T')[0];

  return {
    baseMonthly: Number(baseMonthly.toFixed(2)),
    newMonthly: Number(newMonthly.toFixed(2)),
    acceleratedMonths: Number(acceleratedMonths.toFixed(1)),
    monthsSaved: Number(monthsSaved.toFixed(1)),
    newCompletionDate,
  };
}

/**
 * Generate 90-day activity matrix for GitHub-style heatmap
 */
export function generate90DayActivity(completedDates = []) {
  const days = [];
  const today = new Date();
  const completedSet = new Set(completedDates);

  // Generate backwards 90 days up to today
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isCompleted = completedSet.has(dateStr);
    days.push({
      date: dateStr,
      dayOfWeek: d.getDay(),
      isCompleted,
      isToday: i === 0,
    });
  }

  return days;
}

/**
 * Prepare Chart.js data for Inflow vs Outflow over time
 */
export function getCashflowChartData(transactions = [], period = 'month') {
  // Sort ascending by date
  const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Aggregate by date
  const dateMap = {};
  for (const t of sorted) {
    if (!t.date) continue;
    if (!dateMap[t.date]) {
      dateMap[t.date] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      dateMap[t.date].income += t.amount;
    } else {
      dateMap[t.date].expense += t.amount;
    }
  }

  const labels = Object.keys(dateMap).slice(-14); // last 14 active days
  const incomeData = labels.map((d) => dateMap[d].income);
  const expenseData = labels.map((d) => dateMap[d].expense);

  return {
    labels: labels.map((l) => {
      const p = l.split('-');
      return `${p[2]}/${p[1]}`;
    }),
    datasets: [
      {
        label: 'Inflow (Income)',
        data: incomeData,
        borderColor: '#4CAF82',
        backgroundColor: 'rgba(76, 175, 130, 0.1)',
        tension: 0.3,
        pointBackgroundColor: '#4CAF82',
        pointRadius: 3,
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Outflow (Expenses)',
        data: expenseData,
        borderColor: '#D9604A',
        backgroundColor: 'rgba(217, 96, 74, 0.08)',
        tension: 0.3,
        pointBackgroundColor: '#D9604A',
        pointRadius: 3,
        borderWidth: 2,
        fill: true,
      },
    ],
  };
}

/**
 * Generate honest financial data insights based on user's actual ledger
 */
export function generateDataInsights(transactions = [], currency = 'INR') {
  const stats = calculateStats(transactions);
  const { breakdown } = calculateCategoryTotals(transactions);
  const insights = [];

  if (transactions.length === 0) {
    return [
      {
        type: 'info',
        title: 'Ledger Empty',
        text: 'Log your first income or expense to generate live cashflow insights and runway projections.',
      },
    ];
  }

  // Top expense category
  if (breakdown.length > 0) {
    const top = breakdown[0];
    insights.push({
      type: top.percentage > 35 ? 'warning' : 'neutral',
      title: `Top Outflow: ${top.category}`,
      text: `${top.category} accounts for ${top.percentage}% of your spending (${formatCurrency(top.amount, currency)}). ${
        top.percentage > 35 ? 'Consider setting a weekly spending cap to avoid cash drag.' : 'Spending in this category remains within typical boundaries.'
      }`,
    });
  }

  // Savings rate verdict
  if (stats.totalIncome > 0) {
    if (stats.savingsRate >= 30) {
      insights.push({
        type: 'positive',
        title: 'Strong Savings Velocity',
        text: `Your current savings rate is ${stats.savingsRate}%, exceeding the student benchmark of 20%. You are building resilient capital.`,
      });
    } else if (stats.savingsRate > 0) {
      insights.push({
        type: 'warning',
        title: 'Tight Cashflow Margin',
        text: `Your savings rate is ${stats.savingsRate}%. An extra contribution of ${formatCurrency(stats.totalIncome * 0.1, currency)} per month would elevate your savings buffer into safety territory.`,
      });
    } else {
      insights.push({
        type: 'negative',
        title: 'Deficit Alert',
        text: `Expenses exceed income by ${formatCurrency(Math.abs(stats.netBalance), currency)}. Immediate spending reduction or freelance income generation recommended.`,
      });
    }
  }

  // Weekend vs Weekday analysis
  const weekendSpend = transactions
    .filter((t) => {
      const d = new Date(t.date).getDay();
      return (d === 0 || d === 6) && t.type === 'expense';
    })
    .reduce((acc, t) => acc + t.amount, 0);

  const weekdaySpend = transactions
    .filter((t) => {
      const d = new Date(t.date).getDay();
      return d >= 1 && d <= 5 && t.type === 'expense';
    })
    .reduce((acc, t) => acc + t.amount, 0);

  if (weekendSpend > 0 && weekdaySpend > 0) {
    const weekendAvg = weekendSpend / 2;
    const weekdayAvg = weekdaySpend / 5;
    const ratio = (weekendAvg / weekdayAvg).toFixed(1);
    insights.push({
      type: 'neutral',
      title: 'Weekend Spend Velocity',
      text: `Your weekend daily spending is ${ratio}x your weekday average (${formatCurrency(weekendAvg, currency)}/day vs ${formatCurrency(weekdayAvg, currency)}/day).`,
    });
  }

  return insights;
}
