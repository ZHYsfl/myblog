export const SITE = {
  title: '周浩洋 | Haoyang Zhou',
  description:
    '外包记忆和部分思考，保留理解和部分思考。AI Agents、AI Infra、RL、World Model 与认知架构的数字花园。',
  url: 'https://zhysfl.github.io/myblog',
  author: '周浩洋',
  authorEn: 'Haoyang Zhou',
  email: 'zhouhy5523@gmail.com',
  github: 'ZHYsfl',
  wechat: 'Zhouhaohao0505',
  phone: '13223291973',
} as const;

export const CATEGORIES = [
  {
    id: 'ai-infra',
    name: { zh: 'AI 基础设施', en: 'AI Infrastructure' },
    color: '#3B82F6',
    description: {
      zh: '系统、协议、评测与工程规范的底层思考',
      en: 'Systems, protocols, evaluation, and engineering discipline',
    },
  },
  {
    id: 'ai-theory',
    name: { zh: '智能理论', en: 'Intelligence Theory' },
    color: '#8B5CF6',
    description: {
      zh: '大模型、注意力、世界模型与认知核心',
      en: 'LLMs, attention, world models, and cognitive cores',
    },
  },
  {
    id: 'backend',
    name: { zh: '后端与系统', en: 'Backend & Systems' },
    color: '#10B981',
    description: {
      zh: 'Python、Go 与全栈分层实践',
      en: 'Python, Go, and full-stack systems thinking',
    },
  },
  {
    id: 'personal-growth',
    name: { zh: '个人成长', en: 'Personal Growth' },
    color: '#F59E0B',
    description: {
      zh: '心性、确定性与认知边界',
      en: 'Mindset, certainty, and cognitive boundaries',
    },
  },
  {
    id: 'social',
    name: { zh: '社交与信息', en: 'Social & Information' },
    color: '#EC4899',
    description: {
      zh: '刻意社交、信息生态与陌生人对话',
      en: 'Deliberate socializing and information ecosystems',
    },
  },
  {
    id: 'startup',
    name: { zh: '创业与投资', en: 'Startup & Investment' },
    color: '#EF4444',
    description: {
      zh: '大模型创业观察与投资机构视角',
      en: 'LLM entrepreneurship and VC perspectives',
    },
  },
  {
    id: 'learning',
    name: { zh: '学习反思', en: 'Learning & Reflection' },
    color: '#06B6D4',
    description: {
      zh: '方法论、年度复盘与给后来者的建议',
      en: 'Methodology, year-end reviews, and advice',
    },
  },
  {
    id: 'music-life',
    name: { zh: '音乐与生活', en: 'Music & Life' },
    color: '#F97316',
    description: {
      zh: '歌声、情绪与日常',
      en: 'Songs, emotions, and everyday life',
    },
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export const CATEGORY_IDS: string[] = CATEGORIES.map((c) => c.id);

export const MAX_FILE_LINES = 250;
export const MAX_FILE_LINES_EXCEPTION = 600;
export const MAX_EXCEPTION_FILES = 3;

export const SLOGANS = [
  {
    zh: '记忆力的价值在贬值，理解力的溢价在升高。',
    en: 'The value of memory is depreciating, while the premium on understanding is soaring.',
  },
  { zh: '摒弃假动作，练就真功夫。', en: 'Discard fake moves, forge real skills.' },
  {
    zh: '没有 review 就没有进步，没有 test 就没有质量。',
    en: 'No review, no progress; no test, no quality.',
  },
  {
    zh: '用文件体积倒逼解耦，用高测试率锁定逻辑。',
    en: 'Use file size to force decoupling; use high test coverage to lock down logic.',
  },
  {
    zh: '去魅求真，读源码胜于看教程。',
    en: 'De-mystify and seek truth; read source code over tutorials.',
  },
] as const;

export type Language = 'zh' | 'en';
