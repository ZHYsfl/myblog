import { CATEGORIES } from '@/lib/constants';
import type { Lang } from '@/lib/langStore';

interface CategoryDistributionProps {
  counts: Record<string, number>;
  lang?: Lang;
}

export function CategoryDistribution({ counts, lang = 'zh' }: CategoryDistributionProps) {
  const active = CATEGORIES.filter((c) => (counts[c.id] || 0) > 0).sort(
    (a, b) => (counts[b.id] || 0) - (counts[a.id] || 0)
  );
  const max = Math.max(...active.map((c) => counts[c.id] || 0), 1);

  return (
    <div className="space-y-4">
      {active.map((category) => {
        const count = counts[category.id] || 0;
        const pct = (count / max) * 100;
        return (
          <div key={category.id} className="group">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-fg">{category.name[lang]}</span>
              <span className="text-muted">
                {count} {lang === 'zh' ? '篇' : 'posts'}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${pct}%`, backgroundColor: category.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
