import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth.js';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const { profile, updateProfile } = useAuth();

  const currencyCode = profile?.currency_code || 'INR';
  const currencySymbol = profile?.currency_symbol || '₹';

  const formatMoney = useMemo(() => {
    return (amount, showSymbol = true) => {
      const num = Number(amount) || 0;
      const formatted = new Intl.NumberFormat(currencyCode === 'INR' ? 'en-IN' : 'en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(num);

      return showSymbol ? `${currencySymbol}${formatted}` : formatted;
    };
  }, [currencyCode, currencySymbol]);

  const setCurrency = async (code, symbol) => {
    if (updateProfile) {
      await updateProfile({ currency_code: code, currency_symbol: symbol });
    }
  };

  const value = {
    currencyCode,
    currencySymbol,
    formatMoney,
    setCurrency
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    return {
      currencyCode: 'INR',
      currencySymbol: '₹',
      formatMoney: (amt) => `₹${Number(amt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      setCurrency: () => {}
    };
  }
  return ctx;
}

export default CurrencyContext;
