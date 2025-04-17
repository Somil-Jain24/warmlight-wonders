
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Candle } from '@/types/candle';
import { candles as initialCandles } from '@/data/candles';

interface CandleContextType {
  candles: Candle[];
  setCandles: React.Dispatch<React.SetStateAction<Candle[]>>;
}

const CandleContext = createContext<CandleContextType | undefined>(undefined);

export const useCandleContext = () => {
  const context = useContext(CandleContext);
  if (!context) {
    throw new Error('useCandleContext must be used within a CandleProvider');
  }
  return context;
};

export const CandleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with data from the static file, but allow updates
  const [candles, setCandles] = useState<Candle[]>(() => {
    // Try to load from localStorage first
    const savedCandles = localStorage.getItem('bloom-burn-candles');
    if (savedCandles) {
      try {
        return JSON.parse(savedCandles);
      } catch (e) {
        console.error('Failed to parse saved candles', e);
        return initialCandles.map(candle => ({
          ...candle,
          isLive: true,
          isComingSoon: false,
          price: Math.floor(Math.random() * 1000) + 500 
        }));
      }
    }
    
    // Fall back to initial data
    return initialCandles.map(candle => ({
      ...candle,
      isLive: true,
      isComingSoon: false,
      price: Math.floor(Math.random() * 1000) + 500 
    }));
  });

  // Save to localStorage whenever candles change
  useEffect(() => {
    localStorage.setItem('bloom-burn-candles', JSON.stringify(candles));
  }, [candles]);

  return (
    <CandleContext.Provider value={{ candles, setCandles }}>
      {children}
    </CandleContext.Provider>
  );
};
