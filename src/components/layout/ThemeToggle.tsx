import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const root = document.documentElement;
    const current = (root.getAttribute('data-theme') as Theme) || 'dark';
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('myblog:theme', next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
      className="rounded-full p-2 transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" aria-hidden />
      ) : (
        <Sun className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
