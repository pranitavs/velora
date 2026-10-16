// Storage Engine for VELORA (src/lib/storage.js)
const STORAGE_KEY = 'velora_state_v1';
const EVENT_NAME = 'velora_state_updated';

// Default initial state
const defaultState = {
  user: {
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    currency: 'INR',
    incomeFrequency: 'monthly',
    hasCompletedOnboarding: true,
  },
  session: {
    isLoggedIn: true,
    email: 'alex.chen@university.edu',
  },
  transactions: [],
  goals: [],
  streak: {
    currentStreak: 12,
    longestStreak: 19,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedDates: [],
    todayTasks: {
      loggedTransaction: true,
      checkedBudget: true,
      reviewedGoals: false,
    },
  },
};

// Generates 90 days of realistic sample dates for demo
function generateCompletedDates(streakCount = 12) {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    // In current streak, all days active
    if (i < streakCount) {
      dates.push(dateStr);
    } else {
      // Historical probabilistic activity (approx 65% days completed)
      const pseudoHash = (i * 37 + d.getDate() * 19) % 100;
      if (pseudoHash > 35) {
        dates.push(dateStr);
      }
    }
  }
  return dates;
}

// Realistic student demo dataset
export function generateRealisticDemoData(currency = 'INR') {
  const isINR = currency === 'INR';
  const multiplier = isINR ? 80 : 1;

  const today = new Date();
  const formatOffset = (offsetDays) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offsetDays);
    return d.toISOString().split('T')[0];
  };

  const transactions = [
    {
      id: 'tx-1',
      type: 'income',
      amount: isINR ? 25000 : 850,
      description: 'Campus Research Assistant Stipend',
      category: 'Education',
      date: formatOffset(1),
      paymentMethod: isINR ? 'UPI' : 'Bank Transfer',
    },
    {
      id: 'tx-2',
      type: 'expense',
      amount: isINR ? 450 : 6.5,
      description: 'Campus Canteen Lunch & Chai',
      category: 'Food',
      date: formatOffset(0),
      paymentMethod: isINR ? 'UPI' : 'Cash',
    },
    {
      id: 'tx-3',
      type: 'expense',
      amount: isINR ? 1800 : 25,
      description: 'Operating Systems Course Textbook',
      category: 'Education',
      date: formatOffset(2),
      paymentMethod: isINR ? 'UPI' : 'Card',
    },
    {
      id: 'tx-4',
      type: 'expense',
      amount: isINR ? 650 : 8,
      description: 'Metro Pass Monthly Recharge',
      category: 'Transport',
      date: formatOffset(3),
      paymentMethod: isINR ? 'UPI' : 'Card',
    },
    {
      id: 'tx-5',
      type: 'expense',
      amount: isINR ? 950 : 14,
      description: 'Hostel Wi-Fi & Electricity Share',
      category: 'Bills',
      date: formatOffset(4),
      paymentMethod: isINR ? 'UPI' : 'Bank Transfer',
    },
    {
      id: 'tx-6',
      type: 'income',
      amount: isINR ? 8000 : 120,
      description: 'Weekend Freelance Web UI Design',
      category: 'Other',
      date: formatOffset(5),
      paymentMethod: isINR ? 'UPI' : 'Bank Transfer',
    },
    {
      id: 'tx-7',
      type: 'expense',
      amount: isINR ? 1200 : 18,
      description: 'Weekend Movie & Dinner with Friends',
      category: 'Entertainment',
      date: formatOffset(6),
      paymentMethod: isINR ? 'UPI' : 'Card',
    },
    {
      id: 'tx-8',
      type: 'expense',
      amount: isINR ? 380 : 5,
      description: 'Pharmacy First Aid & Multivitamins',
      category: 'Healthcare',
      date: formatOffset(8),
      paymentMethod: isINR ? 'UPI' : 'Cash',
    },
    {
      id: 'tx-9',
      type: 'expense',
      amount: isINR ? 2400 : 32,
      description: 'Winter Campus Hoodie & Notebooks',
      category: 'Shopping',
      date: formatOffset(11),
      paymentMethod: isINR ? 'UPI' : 'Card',
    },
    {
      id: 'tx-10',
      type: 'income',
      amount: isINR ? 5000 : 70,
      description: 'Peer Math Tutoring Sessions (x4)',
      category: 'Education',
      date: formatOffset(14),
      paymentMethod: isINR ? 'UPI' : 'Cash',
    },
    {
      id: 'tx-11',
      type: 'expense',
      amount: isINR ? 8500 : 120,
      description: 'Semester Hostel Accommodation Fee',
      category: 'Housing',
      date: formatOffset(18),
      paymentMethod: isINR ? 'UPI' : 'Bank Transfer',
    },
    {
      id: 'tx-12',
      type: 'expense',
      amount: isINR ? 1500 : 20,
      description: 'Train Tickets Home for Break',
      category: 'Travel',
      date: formatOffset(22),
      paymentMethod: isINR ? 'UPI' : 'Card',
    },
    {
      id: 'tx-13',
      type: 'expense',
      amount: isINR ? 850 : 12,
      description: 'Grocery Run (Oats, Peanut Butter, Fruit)',
      category: 'Food',
      date: formatOffset(25),
      paymentMethod: isINR ? 'UPI' : 'UPI',
    },
  ];

  const goals = [
    {
      id: 'goal-1',
      title: 'Graduation Tech Setup (M3 MacBook)',
      targetAmount: isINR ? 120000 : 1500,
      currentAmount: isINR ? 74000 : 920,
      targetDate: '2027-04-30',
      category: 'Education',
      createdAt: formatOffset(60),
    },
    {
      id: 'goal-2',
      title: 'Emergency Student Cushion (3 Mo Rent)',
      targetAmount: isINR ? 30000 : 400,
      currentAmount: isINR ? 21500 : 290,
      targetDate: '2026-12-31',
      category: 'Housing',
      createdAt: formatOffset(45),
    },
    {
      id: 'goal-3',
      title: 'Inter-College Hackathon Travel Fund',
      targetAmount: isINR ? 15000 : 200,
      currentAmount: isINR ? 9200 : 125,
      targetDate: '2027-02-15',
      category: 'Travel',
      createdAt: formatOffset(20),
    },
  ];

  return {
    transactions,
    goals,
    streak: {
      currentStreak: 12,
      longestStreak: 19,
      lastActiveDate: formatOffset(0),
      completedDates: generateCompletedDates(12),
      todayTasks: {
        loggedTransaction: true,
        checkedBudget: true,
        reviewedGoals: false,
      },
    },
  };
}

// Retrieve entire state from localStorage
export function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial realistic data on very first run
      const demo = generateRealisticDemoData('INR');
      const initialState = {
        ...defaultState,
        transactions: demo.transactions,
        goals: demo.goals,
        streak: demo.streak,
      };
      saveState(initialState);
      return initialState;
    }
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('Failed to read from localStorage:', err);
    return defaultState;
  }
}

// Save entire state and dispatch reactive event
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: state }));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

// Subscribe to storage changes across components
export function subscribeToStorage(callback) {
  const handler = (e) => {
    callback(e.detail || getState());
  };
  const storageHandler = (e) => {
    if (e.key === STORAGE_KEY) {
      callback(getState());
    }
  };

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', storageHandler);
  };
}

// User / Session functions
export function getUser() {
  const state = getState();
  return state.user || defaultState.user;
}

export function updateUser(userData) {
  const state = getState();
  state.user = { ...state.user, ...userData };
  saveState(state);
  return state.user;
}

export function getSession() {
  const state = getState();
  return state.session || { isLoggedIn: false, email: '' };
}

export function login(email, password) {
  const state = getState();
  state.session = { isLoggedIn: true, email };
  if (!state.user || !state.user.email) {
    state.user = {
      ...defaultState.user,
      email,
      name: email.split('@')[0],
    };
  }
  saveState(state);
  return state.session;
}

export function signup(name, email, password) {
  const state = getState();
  state.user = {
    name,
    email,
    currency: 'INR',
    incomeFrequency: 'monthly',
    hasCompletedOnboarding: false,
  };
  state.session = { isLoggedIn: true, email };
  // Clean slate for brand new sign up
  state.transactions = [];
  state.goals = [];
  state.streak = {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    completedDates: [],
    todayTasks: {
      loggedTransaction: false,
      checkedBudget: false,
      reviewedGoals: false,
    },
  };
  saveState(state);
  return { user: state.user, session: state.session };
}

export function logout() {
  const state = getState();
  state.session = { isLoggedIn: false, email: '' };
  saveState(state);
  return state.session;
}

// Transactions CRUD
export function getTransactions() {
  const state = getState();
  return state.transactions || [];
}

export function addTransaction(tx) {
  const state = getState();
  const newTx = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    ...tx,
    amount: Math.abs(parseFloat(tx.amount) || 0),
    date: tx.date || new Date().toISOString().split('T')[0],
  };
  state.transactions = [newTx, ...(state.transactions || [])];
  
  // Mark today's transaction task
  if (state.streak && state.streak.todayTasks) {
    state.streak.todayTasks.loggedTransaction = true;
    checkAndAdvanceStreakInternal(state);
  }

  saveState(state);
  return newTx;
}

export function updateTransaction(id, updatedTx) {
  const state = getState();
  state.transactions = (state.transactions || []).map((t) =>
    t.id === id ? { ...t, ...updatedTx, amount: Math.abs(parseFloat(updatedTx.amount) || 0) } : t
  );
  saveState(state);
  return state.transactions.find((t) => t.id === id);
}

export function deleteTransaction(id) {
  const state = getState();
  state.transactions = (state.transactions || []).filter((t) => t.id !== id);
  saveState(state);
  return true;
}

// Savings Goals CRUD & Contributions
export function getGoals() {
  const state = getState();
  return state.goals || [];
}

export function addGoal(goal) {
  const state = getState();
  const newGoal = {
    id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title: goal.title,
    targetAmount: Math.abs(parseFloat(goal.targetAmount) || 0),
    currentAmount: Math.abs(parseFloat(goal.currentAmount) || 0),
    targetDate: goal.targetDate,
    category: goal.category || 'Savings',
    createdAt: new Date().toISOString().split('T')[0],
  };
  state.goals = [...(state.goals || []), newGoal];
  
  if (state.streak && state.streak.todayTasks) {
    state.streak.todayTasks.reviewedGoals = true;
    checkAndAdvanceStreakInternal(state);
  }

  saveState(state);
  return newGoal;
}

export function updateGoal(id, updates) {
  const state = getState();
  state.goals = (state.goals || []).map((g) => (g.id === id ? { ...g, ...updates } : g));
  saveState(state);
  return state.goals.find((g) => g.id === id);
}

export function deleteGoal(id) {
  const state = getState();
  state.goals = (state.goals || []).filter((g) => g.id !== id);
  saveState(state);
  return true;
}

export function contributeToGoal(id, amount) {
  const state = getState();
  const num = Math.abs(parseFloat(amount) || 0);
  state.goals = (state.goals || []).map((g) => {
    if (g.id === id) {
      return { ...g, currentAmount: Number((g.currentAmount + num).toFixed(2)) };
    }
    return g;
  });

  if (state.streak && state.streak.todayTasks) {
    state.streak.todayTasks.reviewedGoals = true;
    checkAndAdvanceStreakInternal(state);
  }

  saveState(state);
  return state.goals.find((g) => g.id === id);
}

// Streaks & Daily Tasks
function checkAndAdvanceStreakInternal(state) {
  const today = new Date().toISOString().split('T')[0];
  const { loggedTransaction, checkedBudget, reviewedGoals } = state.streak.todayTasks;

  // Streak advances only when all 3 daily tasks are completed
  const allCompleted = loggedTransaction && checkedBudget && reviewedGoals;

  if (allCompleted) {
    if (!state.streak.completedDates.includes(today)) {
      state.streak.completedDates = [today, ...state.streak.completedDates];
      
      const lastActive = state.streak.lastActiveDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActive === yesterdayStr) {
        state.streak.currentStreak += 1;
      } else if (lastActive === today) {
        // already counted today
      } else {
        // fresh streak
        state.streak.currentStreak = 1;
      }

      state.streak.lastActiveDate = today;
      if (state.streak.currentStreak > state.streak.longestStreak) {
        state.streak.longestStreak = state.streak.currentStreak;
      }
    }
  }
}

export function getStreak() {
  const state = getState();
  return state.streak || defaultState.streak;
}

export function completeStreakTask(taskKey) {
  const state = getState();
  if (!state.streak) {
    state.streak = { ...defaultState.streak };
  }
  if (!state.streak.todayTasks) {
    state.streak.todayTasks = { loggedTransaction: false, checkedBudget: false, reviewedGoals: false };
  }
  
  state.streak.todayTasks[taskKey] = true;
  checkAndAdvanceStreakInternal(state);
  saveState(state);
  return state.streak;
}

// Reset daily tasks if date changed
export function checkDailyReset() {
  const state = getState();
  const today = new Date().toISOString().split('T')[0];
  if (state.streak && state.streak.lastActiveDate !== today) {
    // If user opened on a new day, keep lastActiveDate check
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // If not completed yesterday or today, and more than 1 day skipped, current streak resets to 0
    if (state.streak.lastActiveDate && state.streak.lastActiveDate !== yesterdayStr && state.streak.lastActiveDate !== today) {
      state.streak.currentStreak = 0;
    }
  }
}

// Reset / Seed / Export
export function seedDemoData(currency = 'INR') {
  const state = getState();
  const demo = generateRealisticDemoData(currency);
  state.transactions = demo.transactions;
  state.goals = demo.goals;
  state.streak = demo.streak;
  state.user.currency = currency;
  state.user.hasCompletedOnboarding = true;
  saveState(state);
  return state;
}

export function clearAllData() {
  const freshState = {
    ...defaultState,
    transactions: [],
    goals: [],
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      completedDates: [],
      todayTasks: {
        loggedTransaction: false,
        checkedBudget: false,
        reviewedGoals: false,
      },
    },
  };
  saveState(freshState);
  return freshState;
}

export function exportTransactionsCSV() {
  const state = getState();
  const rows = [
    ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount', 'Payment Method'],
    ...(state.transactions || []).map((t) => [
      t.id,
      t.date,
      t.type,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      t.paymentMethod || 'UPI',
    ]),
  ];

  const csvContent = rows.map((e) => e.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `velora-ledger-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
