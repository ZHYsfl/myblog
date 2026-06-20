import { formatDate, getCategoryMeta } from '@/lib/utils';
import type { CategoryId } from '@/lib/constants';

interface PostListItemProps {
  title: string;
  date: Date;
  category: CategoryId;
  description?: string;
  href: string;
  lang: 'zh' | 'en';
}

export function PostListItem({
  title,
  date,
  category,
  description,
  href,
  lang,
}: PostListItemProps) {
  const meta = getCategoryMeta(category);
  return (
    <a
      href={href}
      data-astro-prefetch="hover"
      className="group flex flex-col gap-3 border-b border-border py-7 transition-colors hover:bg-surface/40 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
    >
      <div className="flex-1">
        <h3 className="mb-2 font-serif text-xl font-semibold text-fg transition-colors group-hover:text-accent sm:text-2xl">
          {title}
        </h3>
        {description && (
          <p className="max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1.5 sm:pt-1">
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide"
          style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
        >
          {meta.name[lang]}
        </span>
        <time className="whitespace-nowrap text-xs text-muted/80">
          {formatDate(date, lang === 'zh' ? 'zh-CN' : 'en-US')}
        </time>
      </div>
    </a>
  );
}
