import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

export function useThemeState(): ThemeContextValue {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light';
    return (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
  });

  const apply = useCallback((next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    apply(theme === 'light' ? 'dark' : 'light');
  }, [theme, apply]);

  const setTheme = useCallback(
    (next: Theme) => {
      apply(next);
    },
    [apply]
  );

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        apply(e.matches ? 'dark' : 'light');
      }
    };
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [apply]);

  return { theme, toggle, setTheme };
}
