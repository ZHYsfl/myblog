import { SITE } from '@/lib/constants';
import { useLang } from '@/lib/useLang';

const copy = {
  zh: {
    wechat: '微信',
    tagline: '专注代码，认真思考。',
  },
  en: {
    wechat: 'WeChat',
    tagline: 'Focused on code, thoughtful thinking.',
  },
};

export function Footer() {
  const [lang] = useLang();
  const t = copy[lang];

  return (
    <footer className="border-t border-border py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-serif text-lg font-semibold text-fg">{SITE.authorEn}</p>
            <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted">
              {lang === 'zh'
                ? SITE.description
                : 'Outsource memory and part of thinking; preserve understanding and part of thinking. A digital garden for AI Agents, AI Infra, RL, and World Model.'}
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <a
              href={`https://github.com/${SITE.github}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-fg"
            >
              GitHub
            </a>
            <a
              href={`mailto:${SITE.email}`}
              aria-label="Email"
              className="transition-colors hover:text-fg"
            >
              {SITE.email}
            </a>
            <span>
              {t.wechat} {SITE.wechat}
            </span>
          </div>
        </div>
        <p className="mt-12 text-center text-xs text-muted/60">
          © {new Date().getFullYear()} {SITE.authorEn}. {t.tagline}
        </p>
      </div>
    </footer>
  );
}
