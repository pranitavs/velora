import { createClient } from '@supabase/supabase-js';

// INTEGRATION_REQUIRED: Supabase credentials — configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env before activating live remote Supabase.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isLiveSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your-supabase-project-url' &&
  !supabaseUrl.includes('example.com')
);

// Fallback client for local offline persistence when external Supabase project is not yet linked
class LocalSupabaseAuth {
  constructor() {
    this.storageKey = 'velora_local_auth_session';
  }

  getSession() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  setSession(session) {
    if (session) {
      localStorage.setItem(this.storageKey, JSON.stringify(session));
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }

  async signUp({ email, password, options = {} }) {
    const existing = this.getSession();
    const userId = 'user_' + Math.random().toString(36).substring(2, 11);
    const user = {
      id: userId,
      email,
      user_metadata: options.data || { full_name: options.data?.full_name || '' },
      created_at: new Date().toISOString()
    };
    const session = { access_token: 'local_token_' + userId, user };
    this.setSession(session);

    // Initialise default profile
    const rawProfiles = localStorage.getItem('velora_profiles');
    let profilesList = [];
    try {
      const p = JSON.parse(rawProfiles || '[]');
      profilesList = Array.isArray(p) ? p : Object.values(p);
    } catch {
      profilesList = [];
    }
    profilesList = profilesList.filter(p => p.id !== userId);
    profilesList.push({
      id: userId,
      full_name: options.data?.full_name || '',
      currency_code: 'INR',
      currency_symbol: '₹',
      income_frequency: 'monthly',
      monthly_income: null,
      primary_goal: '',
      onboarding_complete: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    localStorage.setItem('velora_profiles', JSON.stringify(profilesList));

    return { data: { user, session }, error: null };
  }

  async signInWithPassword({ email, password }) {
    const session = this.getSession();
    if (session && session.user && session.user.email === email) {
      return { data: session, error: null };
    }
    // Check if profile exists for this email
    const users = JSON.parse(localStorage.getItem('velora_registered_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const sessionData = {
        access_token: 'local_token_' + found.id,
        user: { id: found.id, email: found.email, user_metadata: { full_name: found.full_name } }
      };
      this.setSession(sessionData);
      return { data: sessionData, error: null };
    }

    // Allow user to login if newly registering or demoing
    const newId = 'user_' + Math.random().toString(36).substring(2, 9);
    const newSession = {
      access_token: 'local_token_' + newId,
      user: { id: newId, email, user_metadata: { full_name: email.split('@')[0] } }
    };
    this.setSession(newSession);

    const profiles = JSON.parse(localStorage.getItem('velora_profiles') || '{}');
    if (!profiles[newId]) {
      profiles[newId] = {
        id: newId,
        full_name: email.split('@')[0],
        currency_code: 'INR',
        currency_symbol: '₹',
        income_frequency: 'monthly',
        monthly_income: null,
        primary_goal: '',
        onboarding_complete: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('velora_profiles', JSON.stringify(profiles));
    }

    return { data: newSession, error: null };
  }

  async signOut() {
    this.setSession(null);
    return { error: null };
  }

  async resetPasswordForEmail(email) {
    return { data: {}, error: null };
  }

  onAuthStateChange(callback) {
    const session = this.getSession();
    callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
    const listener = (e) => {
      if (e.key === this.storageKey) {
        const s = this.getSession();
        callback(s ? 'SIGNED_IN' : 'SIGNED_OUT', s);
      }
    };
    window.addEventListener('storage', listener);
    return {
      data: {
        subscription: {
          unsubscribe: () => window.removeEventListener('storage', listener)
        }
      }
    };
  }
}

// Local mock database query builder
class LocalSupabaseQuery {
  constructor(table) {
    this.table = table;
    this.storageKey = `velora_${table}`;
    this.filters = [];
    this.orderConfig = null;
    this.limitCount = null;
  }

  _getItems() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'object' && parsed !== null) return Object.values(parsed);
      return [];
    } catch {
      return [];
    }
  }

  _saveItems(items) {
    const arr = Array.isArray(items) ? items : [items];
    localStorage.setItem(this.storageKey, JSON.stringify(arr));
  }

  select(columns = '*') {
    return this;
  }

  eq(column, value) {
    this.filters.push(item => item[column] === value);
    return this;
  }

  gte(column, value) {
    this.filters.push(item => item[column] >= value);
    return this;
  }

  lte(column, value) {
    this.filters.push(item => item[column] <= value);
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.orderConfig = { column, ascending };
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  async single() {
    let items = this._getItems();
    for (const fn of this.filters) {
      items = items.filter(fn);
    }
    return { data: items[0] || null, error: null };
  }

  async insert(data) {
    let items = this._getItems();
    const rows = Array.isArray(data) ? data : [data];
    const inserted = rows.map(r => ({
      id: r.id || 'id_' + Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...r
    }));
    items.push(...inserted);
    this._saveItems(items);
    return { data: Array.isArray(data) ? inserted : inserted[0], error: null };
  }

  update(updates) {
    this.pendingUpdate = updates;
    return this;
  }

  delete() {
    this.pendingDelete = true;
    return this;
  }

  // Thenable for await query
  then(resolve, reject) {
    let items = this._getItems();

    if (this.pendingUpdate) {
      let updatedItem = null;
      items = items.map(item => {
        const match = this.filters.length === 0 || this.filters.every(fn => fn(item));
        if (match) {
          updatedItem = { ...item, ...this.pendingUpdate, updated_at: new Date().toISOString() };
          return updatedItem;
        }
        return item;
      });
      this._saveItems(items);
      return resolve({ data: updatedItem, error: null });
    }

    if (this.pendingDelete) {
      items = items.filter(item => !this.filters.every(fn => fn(item)));
      this._saveItems(items);
      return resolve({ data: null, error: null });
    }

    for (const fn of this.filters) {
      items = items.filter(fn);
    }
    if (this.orderConfig) {
      const { column, ascending } = this.orderConfig;
      items.sort((a, b) => {
        if (a[column] < b[column]) return ascending ? -1 : 1;
        if (a[column] > b[column]) return ascending ? 1 : -1;
        return 0;
      });
    }
    if (this.limitCount) {
      items = items.slice(0, this.limitCount);
    }
    resolve({ data: items, error: null });
  }
}

class LocalSupabaseClient {
  constructor() {
    this.auth = new LocalSupabaseAuth();
  }

  from(table) {
    return new LocalSupabaseQuery(table);
  }
}

export const supabase = isLiveSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new LocalSupabaseClient();

export default supabase;
