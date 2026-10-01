import { useEffect } from 'react';
import { useLang } from '@/lib/useLang';
import { CategoryDistribution } from '@/components/about/CategoryDistribution';
import { ResumeSection } from '@/components/about/ResumeSection';
import { VoiceWaveSketch } from '@/components/about/VoiceWaveSketch';
import { SITE } from '@/lib/constants';

interface AboutPageProps {
  counts: Record<string, number>;
  total: number;
}

const copy = {
  zh: {
    aboutLabel: 'About',
    title: '关于我',
    tagline: '研究语音智能体，也造语音智能体。',
    intro1: `我是<strong>周浩洋</strong>，上海交通大学人工智能学院直博生（AudioCC Lab，导师张王优），吉林大学软件学院本科。研究语音智能体——既做评测它的 Benchmark，也做实现它的系统。`,
    intro2:
      '之前研究 Agentic RL 的长循环训练（SCRIBE），做过智能体评测平台 AgentGenesis 和语音多智能体系统 VoxFlow。这个博客记录技术与科研，也记录生活——不追热点，写什么取决于最近在为什么问题头疼。',
    doing: '在研究',
    doing1: '语音智能体的评测与系统：给语音 Agent 定评测标准，也造真正可用的系统。',
    doing2: 'Agentic RL：长循环训练中的信用分配与奖励设计。',
    doing3: '开源：AgentGenesis 维护者，CleanRL 贡献者。',
    off: '不在研究的时候',
    off1: '唱歌——录了一百多首翻唱，都收在这个站的音乐页。',
    off2: '写字——博客算一部分，剩下的在私人笔记里。',
    off3: '发呆——好的问题一般不在我盯着屏幕的时候出现。',
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
    tagline: 'I research voice agents — and build them.',
    intro1: `I'm <strong>Haoyang Zhou</strong>, a direct PhD student at the School of AI, Shanghai Jiao Tong University (AudioCC Lab, advised by Prof. Zhang Wangyou), with a B.E. from the Software College of Jilin University. I work on voice agents — both the benchmarks that evaluate them and the systems that realize them.`,
    intro2:
      'Before this, I worked on long-horizon Agentic RL training (SCRIBE), built an agent evaluation platform (AgentGenesis), and a voice multi-agent system (VoxFlow). This blog covers research and life — no hot takes, just whatever problem is currently keeping me up.',
    doing: 'Working On',
    doing1:
      'Evaluation and systems for voice agents: setting the benchmarks, and building systems that pass them.',
    doing2: 'Agentic RL: credit assignment and reward design for long-horizon training.',
    doing3: 'Open source: maintainer of AgentGenesis, contributor to CleanRL.',
    off: 'Off Duty',
    off1: 'Singing — over a hundred covers, all on the music page of this site.',
    off2: 'Writing — part of it lands here, the rest stays in private notes.',
    off3: 'Doing nothing — good ideas rarely show up while staring at a screen.',
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

      <VoiceWaveSketch />

      <section className="mb-20">
        <p
          className="text-lg leading-relaxed text-fg"
          dangerouslySetInnerHTML={{ __html: t.intro1 }}
        />
        <p className="mt-5 leading-relaxed text-muted">{t.intro2}</p>
      </section>

      <section className="mb-20 grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="mb-6 font-serif text-2xl font-semibold text-fg">{t.doing}</h2>
          <ul className="space-y-4 text-muted">
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent"></span>
              <span>{t.doing1}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent"></span>
              <span>{t.doing2}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent"></span>
              <span>{t.doing3}</span>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-6 font-serif text-2xl font-semibold text-fg">{t.off}</h2>
          <ul className="space-y-4 text-muted">
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent"></span>
              <span>{t.off1}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent"></span>
              <span>{t.off2}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent"></span>
              <span>{t.off3}</span>
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
