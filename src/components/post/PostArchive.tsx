import { useEffect } from 'react';
import { useLang } from '@/lib/useLang';
import { PostListItem } from './PostListItem';
import { SITE, type CategoryId } from '@/lib/constants';

interface Post {
  data: {
    title: string;
    date: string;
    category: CategoryId;
    description?: string;
    slug: string;
    lang: 'zh' | 'en';
  };
}

interface PostArchiveProps {
  posts: Post[];
}

function toDate(value: string | Date) {
  return typeof value === 'string' ? new Date(value) : value;
}

export function PostArchive({ posts }: PostArchiveProps) {
  const [lang] = useLang();

  useEffect(() => {
    document.title = lang === 'en' ? `Posts | ${SITE.authorEn}` : `文章 | ${SITE.authorEn}`;
  }, [lang]);

  const filtered = posts
    .filter((p) => p.data.lang === lang)
    .sort((a, b) => toDate(b.data.date).getTime() - toDate(a.data.date).getTime());

  const byYear: Record<string, Post[]> = {};
  for (const post of filtered) {
    const year = String(toDate(post.data.date).getFullYear());
    byYear[year] = byYear[year] ?? [];
    byYear[year].push(post);
  }
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  const title = lang === 'zh' ? '文章' : 'Posts';
  const subtitle =
    lang === 'zh'
      ? '把思考写下来，时间会让它们变得清晰。'
      : 'Writing thoughts down makes them clearer over time.';
  const countLabel = lang === 'zh' ? '篇中文文章' : 'English posts';

  return (
    <div className="mx-auto max-w-4xl px-6 py-32 sm:px-8">
      <header className="mb-20 text-center">
        <h1 className="mb-5 font-serif text-4xl font-bold text-fg sm:text-5xl">{title}</h1>
        <p className="mx-auto max-w-md text-base leading-relaxed text-muted">{subtitle}</p>
      </header>

      {years.map((year) => (
        <section className="mb-16" key={year}>
          <div className="mb-6 flex items-baseline gap-6">
            <h2 className="font-serif text-2xl font-semibold text-fg">{year}</h2>
            <span className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted">
              {byYear[year].length} {countLabel}
            </span>
          </div>
          <div className="divide-y divide-border border-t border-border">
            {byYear[year].map((post) => (
              <PostListItem
                key={post.data.slug}
                title={post.data.title}
                date={toDate(post.data.date)}
                category={post.data.category}
                description={post.data.description}
                href={`/posts/${post.data.lang}/${post.data.slug}`}
                lang={post.data.lang}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
