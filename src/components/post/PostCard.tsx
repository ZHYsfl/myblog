import { formatDate, getCategoryMeta } from '@/lib/utils';
import type { CategoryId } from '@/lib/constants';

interface PostCardProps {
  title: string;
  date: Date;
  category: CategoryId;
  description?: string;
  href: string;
  lang: 'zh' | 'en';
}

export function PostCard({ title, date, category, description, href, lang }: PostCardProps) {
  const meta = getCategoryMeta(category);
  return (
    <a
      href={href}
      data-astro-prefetch="hover"
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
        >
          {meta.name[lang]}
        </span>
        <span className="text-xs text-muted">
          {formatDate(date, lang === 'zh' ? 'zh-CN' : 'en-US')}
        </span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-fg transition-colors group-hover:text-accent">
        {title}
      </h3>
      {description && <p className="line-clamp-2 text-sm text-muted">{description}</p>}
    </a>
  );
}
