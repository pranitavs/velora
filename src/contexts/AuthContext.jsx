import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import supabase from '../config/supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create profile for user
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data);
        return data;
      }

      // If no profile row exists, create initial row
      if (!data) {
        const initialProfile = {
          id: userId,
          full_name: '',
          currency_code: 'INR',
          currency_symbol: '₹',
          income_frequency: 'monthly',
          monthly_income: null,
          primary_goal: '',
          onboarding_complete: false
        };
        const { data: created } = await supabase
          .from('profiles')
          .insert(initialProfile);

        const saved = Array.isArray(created) ? created[0] : (created || initialProfile);
        setProfile(saved);
        return saved;
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
    return null;
  }, []);

  useEffect(() => {
    // Check initial auth state
    let isMounted = true;

    async function initAuth() {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            if (!isMounted) return;
            setSession(currentSession);
            setUser(currentSession?.user || null);

            if (currentSession?.user) {
              await fetchProfile(currentSession.user.id);
            } else {
              setProfile(null);
            }
            setLoading(false);
          }
        );

        return () => {
          subscription?.unsubscribe();
        };
      } catch (err) {
        console.error('Auth initialization failed:', err);
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [fetchProfile]);

  const signUp = async ({ email, password, fullName }) => {
    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (res.data?.user) {
      // Create or update profile with the provided full_name
      await supabase.from('profiles').update({ full_name: fullName }).eq('id', res.data.user.id);
      await fetchProfile(res.data.user.id);
    }

    return res;
  };

  const signIn = async ({ email, password }) => {
    const res = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (res.data?.user) {
      await fetchProfile(res.data.user.id);
    }
    return res;
  };

  const signOut = async () => {
    const res = await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    return res;
  };

  const resetPassword = async (email) => {
    return await supabase.auth.resetPasswordForEmail(email);
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: 'No active user session' };
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error) {
      setProfile(prev => ({ ...prev, ...updates }));
    }
    return { data, error };
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile: () => user && fetchProfile(user.id)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
