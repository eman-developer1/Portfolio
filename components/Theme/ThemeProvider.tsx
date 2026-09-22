'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ek_portfolio_theme') as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
        document.documentElement.setAttribute('data-theme', stored);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme: Theme = prefersDark ? 'dark' : 'dark'; // Dark is preferred primary modern aesthetic
        setTheme(initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);
      }
    } catch {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('ek_portfolio_theme', nextTheme);
    } catch {
      // ignore
    }
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: mounted ? theme : 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
