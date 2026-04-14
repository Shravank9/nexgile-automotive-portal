import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext({
  currency: 'INR',
  setCurrency: () => {},
});

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('INR');

  const value = {
    currency,
    setCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
