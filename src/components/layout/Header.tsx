import { ThemeToggle } from './ThemeToggle';
import { SITE } from '@/lib/constants';
import { Disc3 } from 'lucide-react';
import { useLang } from '@/lib/useLang';

const navItems = [
  { href: '/posts', zh: '文章', en: 'Posts' },
  { href: '/music', zh: '音乐', en: 'Music' },
  { href: '/about', zh: '关于', en: 'About' },
];

export function Header() {
  const [lang, , toggleLang] = useLang();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
        <a href="/" data-astro-prefetch="hover" className="group flex items-center gap-2 text-fg">
          <Disc3 className="h-5 w-5 transition-transform duration-700 group-hover:rotate-180" />
          <span className="font-serif text-lg font-semibold tracking-tight">{SITE.authorEn}</span>
        </a>
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label={lang === 'zh' ? '主导航' : 'Main navigation'}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-astro-prefetch="hover"
              className="group relative text-sm font-medium text-muted transition-colors hover:text-fg"
            >
              {item[lang]}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLang}
            className="rounded-md px-2 py-1 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-fg"
            aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
          >
            {lang === 'zh' ? 'EN' : '中'}
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
