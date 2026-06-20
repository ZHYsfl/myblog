import { Globe } from 'lucide-react';

interface LanguageSwitchProps {
  current: 'zh' | 'en';
  targetHref: string;
}

export function LanguageSwitch({ current, targetHref }: LanguageSwitchProps) {
  const label = current === 'zh' ? '切换到英文' : '切换到中文';
  return (
    <a
      href={targetHref}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted transition-colors hover:text-fg"
      aria-label={label}
    >
      <Globe className="h-4 w-4" />
      <span>{current === 'zh' ? 'EN' : '中'}</span>
    </a>
  );
}
