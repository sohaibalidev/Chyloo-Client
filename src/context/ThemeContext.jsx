import { createContext, useContext, useEffect, useState } from 'react';
import '@/theme.css';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = document.documentElement;

    const themes = {
      dark: {
        '--primary-color': '#1a1a1a',
        '--primary-accent': '#d4af37',
        '--primary-accent-hover': '#c19b2e',
        '--dark-bg': '#0a0a0a',
        '--dark-card': '#111111',
        '--text': '#ffffff',
        '--text-light': '#b8b8b8',
        '--text-lighter': '#888888',
        '--error': '#e53935',
        '--success': '#43a047',
        '--shadow': '0 4px 20px rgba(0, 0, 0, 0.5)',
        '--shadow-hover': '0 8px 30px rgba(0, 0, 0, 0.6)',
        '--gold-glow': '0 0 15px rgba(212, 175, 55, 0.4)',
        '--border-color': 'rgba(255, 255, 255, 0.1)',
      },
      light: {
        '--primary-color': '#ffffff',
        '--primary-accent': '#c19b2e',
        '--primary-accent-hover': '#b38b1f',
        '--dark-bg': '#f9f9f9',
        '--dark-card': '#ffffff',
        '--text': '#1a1a1a',
        '--text-light': '#555555',
        '--text-lighter': '#777777',
        '--error': '#d32f2f',
        '--success': '#388e3c',
        '--shadow': '0 4px 20px rgba(0, 0, 0, 0.1)',
        '--shadow-hover': '0 8px 30px rgba(0, 0, 0, 0.15)',
        '--gold-glow': '0 0 10px rgba(193, 155, 46, 0.3)',
        '--border-color': 'rgba(0, 0, 0, 0.1)',
      },
    };

    Object.entries(themes[theme]).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
