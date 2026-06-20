import { useEffect } from 'react';
import { GalaxyScene } from '@/components/home/GalaxyScene';
import { PostListItem } from '@/components/post/PostListItem';
import { LangText } from '@/components/ui/LangText';
import { useLang } from '@/lib/useLang';
import { SITE, type CategoryId } from '@/lib/constants';

interface HomePost {
  data: {
    title: string;
    date: string;
    category: CategoryId;
    description?: string;
    slug: string;
    lang: 'zh' | 'en';
  };
}

interface HomePageProps {
  posts: HomePost[];
}

const copy = {
  zh: { digitalGarden: 'Digital Garden' },
  en: { digitalGarden: 'Digital Garden' },
};

export function HomePage({ posts }: HomePageProps) {
  const [lang] = useLang();
  const t = copy[lang];

  const activePosts = posts.filter((p) => p.data.lang === lang);
  const counts = activePosts.reduce(
    (acc, post) => {
      acc[post.data.category] = (acc[post.data.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const sortByDate = (a: HomePost, b: HomePost) =>
    new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  const zhRecent = posts
    .filter((p) => p.data.lang === 'zh')
    .sort(sortByDate)
    .slice(0, 5);
  const enRecent = posts
    .filter((p) => p.data.lang === 'en')
    .sort(sortByDate)
    .slice(0, 5);

  const renderList = (list: HomePost[]) => (
    <div className="divide-y divide-border border-t border-border">
      {list.map((post) => (
        <PostListItem
          key={post.data.slug}
          title={post.data.title}
          date={new Date(post.data.date)}
          category={post.data.category}
          description={post.data.description}
          href={`/posts/${post.data.lang}/${post.data.slug}`}
          lang={post.data.lang}
        />
      ))}
    </div>
  );

  useEffect(() => {
    document.title = SITE.authorEn;
  }, [lang]);

  return (
    <div className="min-h-screen bg-bg">
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <GalaxyScene counts={counts} />
        </div>

        {/* gradient overlay for text readability */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-bg/30 via-bg/60 to-bg" />

        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <div className="pointer-events-auto max-w-3xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              {t.digitalGarden}
            </p>
            <h1 className="mb-8 font-serif text-5xl font-bold leading-tight tracking-tight text-fg sm:text-7xl lg:text-8xl">
              {SITE.authorEn}
            </h1>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-fg/90 sm:text-xl">
              <span data-lang-block="zh">外包记忆和部分思考，保留理解和部分思考。</span>
              <span data-lang-block="en">
                Outsource memory and part of thinking; preserve understanding and part of thinking.
              </span>
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="/posts"
                data-astro-prefetch="hover"
                className="rounded-full bg-accent px-7 py-3 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-transform hover:scale-105"
              >
                <LangText zh="浏览文章" en="Browse Posts" />
              </a>
              <a
                href="/about"
                data-astro-prefetch="hover"
                className="rounded-full border border-fg/20 bg-bg/70 px-7 py-3 text-sm font-medium text-fg backdrop-blur-sm transition-colors hover:bg-bg"
              >
                <LangText zh="了解更多" en="Learn More" />
              </a>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-2">
          <span className="text-xs text-muted">
            <LangText zh="向下滚动" en="Scroll down" />
          </span>
          <span className="h-6 w-px animate-bounce bg-muted/60"></span>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-28 sm:px-8">
        <div className="mb-12 flex items-end justify-between border-b border-border pb-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <LangText zh="最近" en="Recent" />
            </p>
            <h2 className="font-serif text-3xl font-semibold text-fg sm:text-4xl">
              <LangText zh="最近写作" en="Recent Writing" />
            </h2>
          </div>
          <a
            href="/posts"
            data-astro-prefetch="hover"
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            <LangText zh="查看全部 →" en="View all →" />
          </a>
        </div>
        <div data-lang-block="zh">{renderList(zhRecent)}</div>
        <div data-lang-block="en">{renderList(enRecent)}</div>
      </section>

      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
          <h2 className="mb-4 font-serif text-2xl font-semibold text-fg">
            <LangText zh="也听听我的歌" en="Listen to my songs" />
          </h2>
          <p className="mx-auto mb-8 max-w-md text-muted">
            <LangText
              zh="在音乐页面收录了一些翻唱，是另一种记录心情的方式。"
              en="The music page collects some covers — another way to record moods."
            />
          </p>
          <a
            href="/music"
            data-astro-prefetch="hover"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
          >
            <LangText zh="前往音乐页" en="Go to Music" />
          </a>
        </div>
      </section>
    </div>
  );
}
