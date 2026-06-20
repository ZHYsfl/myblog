import { useEffect } from 'react';
import { useLang } from '@/lib/useLang';
import { CategoryDistribution } from '@/components/about/CategoryDistribution';
import { ResumeSection } from '@/components/about/ResumeSection';
import { SITE } from '@/lib/constants';

interface AboutPageProps {
  counts: Record<string, number>;
  total: number;
}

const copy = {
  zh: {
    aboutLabel: 'About',
    title: '关于我',
    tagline: '一个相信工程纪律、第一性原理与真实世界实践的软件工程学生。',
    intro1: `我叫<strong>周浩洋</strong>，吉林大学软件学院 2023 级学生。比起追逐热点，我更愿意把一个问题真正拆开，看它的源代码、边界条件和失败案例。`,
    intro2:
      '我的兴趣在 AI Agents、AI Infra、Reinforcement Learning、World Model。但本质上，我在乎的是：如何把抽象的想法变成能跑、能测、能被理解的系统。这个博客是我的数字花园，记录技术、科研、生活、社交和创业里的真实思考。',
    believe: '我相信的',
    believeQuote: '外包记忆和部分思考，保留理解和部分思考。',
    believeText:
      '摒弃假动作，练就真功夫。读源码、写测试、做 review，把每一行代码当作公开的思考痕迹。',
    ways: '我的方式',
    way1: '用小文件体积倒逼解耦，用高测试率锁定逻辑。',
    way2: '不重复造轮子，但愿意为了搞懂一个轮子把它拆开。',
    way3: '从单兵执行到团队思维，认知跃迁比加班更重要。',
    distribution: '文章分布',
    postsCount: '篇中文文章',
    contact: '保持联系',
    contactText:
      '如果你也在思考类似的问题，欢迎通过邮件或微信找我聊聊。我通常在读完一段代码、跑完一组实验后回复。',
    wechat: '微信',
  },
  en: {
    aboutLabel: 'About',
    title: 'About Me',
    tagline:
      'A software engineering student who believes in engineering discipline, first principles, and real-world practice.',
    intro1: `My name is <strong>Haoyang Zhou</strong>, a student at the Software College of Jilin University (Class of 2023). Rather than chasing trends, I prefer to take a problem apart and look at its source code, edge cases, and failure modes.`,
    intro2:
      'My interests are in AI Agents, AI Infra, Reinforcement Learning, and World Model. But at the core, I care about turning abstract ideas into systems that run, can be tested, and can be understood. This blog is my digital garden, recording real thoughts on technology, research, life, social dynamics, and entrepreneurship.',
    believe: 'What I Believe',
    believeQuote:
      'Outsource memory and part of thinking; preserve understanding and part of thinking.',
    believeText:
      'Discard fake moves, forge real skills. Read source code, write tests, do code reviews — treat every line of code as a public trace of thinking.',
    ways: 'How I Work',
    way1: 'Use small file sizes to force decoupling; use high test coverage to lock down logic.',
    way2: "Don't reinvent wheels, but I'm willing to take one apart just to understand it.",
    way3: 'Grow from solo execution to team thinking; cognitive leaps matter more than overtime.',
    distribution: 'Post Distribution',
    postsCount: 'posts',
    contact: 'Get in Touch',
    contactText:
      "If you're thinking about similar questions, feel free to reach out via email or WeChat. I usually reply after reading some code or running a set of experiments.",
    wechat: 'WeChat',
  },
};

export function AboutPage({ counts, total }: AboutPageProps) {
  const [lang] = useLang();
  const t = copy[lang];

  useEffect(() => {
    document.title = lang === 'en' ? `About | ${SITE.authorEn}` : `关于 | ${SITE.authorEn}`;
  }, [lang]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-32 sm:px-8">
      <header className="mb-20 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
          {t.aboutLabel}
        </p>
        <h1 className="mb-6 font-serif text-4xl font-bold text-fg sm:text-5xl">{t.title}</h1>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted">{t.tagline}</p>
      </header>

      <section className="mb-20">
        <p
          className="text-lg leading-relaxed text-fg"
          dangerouslySetInnerHTML={{ __html: t.intro1 }}
        />
        <p className="mt-5 leading-relaxed text-muted">{t.intro2}</p>
      </section>

      <section className="mb-20 grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="mb-6 font-serif text-2xl font-semibold text-fg">{t.believe}</h2>
          <blockquote className="border-l-2 border-accent pl-5 font-serif text-xl italic leading-relaxed text-fg">
            “{t.believeQuote}”
          </blockquote>
          <p className="mt-5 leading-relaxed text-muted">{t.believeText}</p>
        </div>
        <div>
          <h2 className="mb-6 font-serif text-2xl font-semibold text-fg">{t.ways}</h2>
          <ul className="space-y-4 text-muted">
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent"></span>
              <span>{t.way1}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent"></span>
              <span>{t.way2}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent"></span>
              <span>{t.way3}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-20">
        <div className="mb-8 flex items-baseline justify-between border-b border-border pb-4">
          <h2 className="font-serif text-2xl font-semibold text-fg">{t.distribution}</h2>
          <span className="text-sm text-muted">
            {total} {t.postsCount}
          </span>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <CategoryDistribution counts={counts} lang={lang} />
        </div>
      </section>

      <ResumeSection />

      <section>
        <h2 className="mb-6 font-serif text-2xl font-semibold text-fg">{t.contact}</h2>
        <p className="mb-8 leading-relaxed text-muted">{t.contactText}</p>
        <div className="flex flex-wrap gap-6 text-sm">
          <a
            href={`https://github.com/${SITE.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border bg-surface px-5 py-2.5 text-fg transition-colors hover:border-accent hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="rounded-full border border-border bg-surface px-5 py-2.5 text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {SITE.email}
          </a>
          <span className="rounded-full border border-border bg-surface px-5 py-2.5 text-muted">
            {t.wechat} {SITE.wechat}
          </span>
        </div>
      </section>
    </div>
  );
}
