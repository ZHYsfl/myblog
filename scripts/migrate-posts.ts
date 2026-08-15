import fs from 'node:fs';
import path from 'node:path';
import { CATEGORY_IDS } from '../src/lib/constants';

const SRC_ZH = 'AIInsights/ChineseVersion';
const SRC_EN = 'AIInsights/EnglishVersion';
const OUT_ZH = 'src/content/posts/zh';
const OUT_EN = 'src/content/posts/en';
const ASSET_OUT = 'public/assets/posts';

interface SourceFile {
  file: string;
  date: string;
  title: string;
  category: string;
  tags: string[];
  lang: 'zh' | 'en';
  body: string;
  assetDir: string | null;
}

const CATEGORY_MAP: Record<string, string> = {
  '251123': 'social',
  '251205': 'ai-theory',
  '251227': 'personal-growth',
  '251229': 'ai-infra',
  '251231': 'learning',
  '260116': 'personal-growth',
  '260122': 'startup',
  '260128': 'ai-infra',
  '260130': 'ai-theory',
  '260201': 'backend',
  '260204': 'personal-growth',
  '260209': 'backend',
  '260213': 'personal-growth',
  '260220': 'learning',
  '260221': 'learning',
  '260307': 'social',
  '260312': 'ai-infra',
  '260325': 'social',
  '260327': 'social',
  '260329': 'backend',
  '260414': 'backend',
  '260418': 'ai-infra',
  '260420': 'personal-growth',
  '260429': 'personal-growth',
  '260430': 'startup',
  '260511': 'ai-infra',
  '260522': 'personal-growth',
  '260526': 'ai-infra',
  '260601': 'backend',
  '260609': 'ai-theory',
  '260621-神经网络架构简史与Agent思维架构的未来': 'ai-theory',
  '260621-给Ubuntu分区还给了D盘：一年后的开发环境选择': 'backend',
  '260626-篮球场上的芳芳阿姨': 'social',
  '260630-OpenAI-SDK已自动注入工具Schema': 'ai-infra',
  '260621-A-Brief-History-of-Neural-Network-Architectures-and-the-Future-of-Agent-Thinking-Structures':
    'ai-theory',
  '260621-Returning-Ubuntu-Partitions-to-D-Drive-A-Year-of-Dev-Setup-Evolution': 'backend',
  '260626-Aunt-Fangfang-on-the-Basketball-Court': 'social',
  '260630-OpenAI-SDK-Automatically-Injects-Tool-Schema': 'ai-infra',
  '260729-VLA的核心思想架构与数据流图': 'ai-theory',
  '260729-The-Core-Architecture-and-Data-Flow-of-VLA': 'ai-theory',
  '260813-2026年暑假论坛实践总结': 'personal-growth',
  '260813-2026-Summer-Forum-Training-Camp-Retrospective': 'personal-growth',
  和学弟的AI学习建议对话: 'learning',
};

const TAGS_MAP: Record<string, string[]> = {
  '251123': ['Zeitgeist', 'Society', 'Cognitive Shift'],
  '251205': ['World Model', 'Agent', 'Intelligence'],
  '251227': ['Year in Review', 'Personal Growth', 'Mindset'],
  '251229': ['Cognitive Core', 'World Model', 'LLM'],
  '251231': ['Learning', 'Source Code', 'Open Source'],
  '260116': ['Niche', 'Differentiation', 'AI Amplifier'],
  '260122': ['Community', 'Networking', 'Sharing'],
  '260128': ['Agent', 'Context Engineering', 'Evaluation'],
  '260130': ['Attention', 'Opus 4.5', 'Programming'],
  '260201': ['Python', 'Go', 'Backend'],
  '260204': ['Mental Models', 'Values', 'Personal Growth'],
  '260209': ['Uncertainty', 'Determinism', 'Cognitive Shift'],
  '260213': ['Human Nature', 'Character', 'Self-Improvement'],
  '260220': ['Reflection', 'Determinism', 'Mental Models'],
  '260221': ['Reflection', 'Determinism', 'Mental Models'],
  '260307': ['Human Connection', 'Automation', 'Society'],
  '260312': ['Multi-Agent', 'Human Connection', 'Tech Devaluation'],
  '260325': ['Deliberate Socializing', 'Networking', 'Information Ecosystem'],
  '260327': ['Deep Conversation', 'Networking', 'Information Ecosystem'],
  '260329': ['Cloud', 'Server', 'Bug'],
  '260414': ['Full Stack', 'Systems Thinking', 'LLM'],
  '260418': ['Harness', 'Claude Code', 'Model Vendors'],
  '260420': ['Trade-offs', 'Success', 'Life'],
  '260429': ['Self-Improvement', 'Gender Relations', 'Masculinity'],
  '260430': ['Venture Capital', 'AI Screening', 'Startup'],
  '260511': ['Claude Code', 'Bug', 'Agent Infra'],
  '260522': ['Teamwork', 'Vibe Coding', 'Cognitive Shift'],
  '260526': ['Agent Infra', 'Bug', 'API'],
  '260601': ['Engineering', 'Vibe Coding', 'Open-Closed Principle'],
  '260609': ['Vibe Coding', 'Evaluation', 'Agent'],
  '260621-神经网络架构简史与Agent思维架构的未来': ['Neural Network', 'Agent Architecture', 'JEPA'],
  '260621-给Ubuntu分区还给了D盘：一年后的开发环境选择': ['WSL', 'Ubuntu', 'Dev Environment'],
  '260626-篮球场上的芳芳阿姨': ['Memory', 'Basketball', 'People'],
  '260630-OpenAI-SDK已自动注入工具Schema': ['OpenAI SDK', 'Tool Schema', 'Context Engineering'],
  '260621-A-Brief-History-of-Neural-Network-Architectures-and-the-Future-of-Agent-Thinking-Structures':
    ['Neural Network', 'Agent Architecture', 'JEPA'],
  '260621-Returning-Ubuntu-Partitions-to-D-Drive-A-Year-of-Dev-Setup-Evolution': [
    'WSL',
    'Ubuntu',
    'Dev Environment',
  ],
  '260626-Aunt-Fangfang-on-the-Basketball-Court': ['Memory', 'Basketball', 'People'],
  '260630-OpenAI-SDK-Automatically-Injects-Tool-Schema': [
    'OpenAI SDK',
    'Tool Schema',
    'Context Engineering',
  ],
  '260729-VLA的核心思想架构与数据流图': [
    'VLA',
    'Embodied AI',
    'Agent Architecture',
    '3D Gaussian',
    'Flow Matching',
  ],
  '260729-The-Core-Architecture-and-Data-Flow-of-VLA': [
    'VLA',
    'Embodied AI',
    'Agent Architecture',
    '3D Gaussian',
    'Flow Matching',
  ],
  '260813-2026年暑假论坛实践总结': [
    'Summer Forum',
    'Embodied AI',
    'Agentic AI',
    'Team Management',
    'Social Connection',
  ],
  '260813-2026-Summer-Forum-Training-Camp-Retrospective': [
    'Summer Forum',
    'Embodied AI',
    'Agentic AI',
    'Team Management',
    'Social Connection',
  ],
  和学弟的AI学习建议对话: ['Learning', 'Source Code', 'Open Source'],
};

const TRANSLATION_PAIRS: Record<string, string> = {
  '260621-神经网络架构简史与Agent思维架构的未来':
    '260621-A-Brief-History-of-Neural-Network-Architectures-and-the-Future-of-Agent-Thinking-Structures',
  '260621-给Ubuntu分区还给了D盘：一年后的开发环境选择':
    '260621-Returning-Ubuntu-Partitions-to-D-Drive-A-Year-of-Dev-Setup-Evolution',
  '260626-篮球场上的芳芳阿姨': '260626-Aunt-Fangfang-on-the-Basketball-Court',
  '260630-OpenAI-SDK已自动注入工具Schema': '260630-OpenAI-SDK-Automatically-Injects-Tool-Schema',
  '260729-VLA的核心思想架构与数据流图': '260729-The-Core-Architecture-and-Data-Flow-of-VLA',
  '260813-2026年暑假论坛实践总结': '260813-2026-Summer-Forum-Training-Camp-Retrospective',
};

const DATE_OVERRIDES: Record<string, string> = {
  '260220': '2026-02-21',
};

const SPECIAL_SLUGS: Record<string, string> = {
  '260220': 'reflections-tairan-weng-jiayi',
  '260221': 'reflections-tairan-weng-jiayi',
  '260621-神经网络架构简史与Agent思维架构的未来': 'a-brief-history-of-neural-network-architectur',
  '260621-给Ubuntu分区还给了D盘：一年后的开发环境选择':
    'returning-ubuntu-partitions-to-d-drive-a-year',
  和学弟的AI学习建议对话: 'ai-learning-advice-dialogue',
};

function parseDate(file: string): string | null {
  const match = path.basename(file).match(/^(\d{6})-/);
  if (!match) return null;
  const yy = match[1].slice(0, 2);
  const mm = match[1].slice(2, 4);
  const dd = match[1].slice(4, 6);
  const iso = `20${yy}-${mm}-${dd}`;
  return DATE_OVERRIDES[match[1]] ?? iso;
}

function extractTitle(content: string, file: string, lang: 'zh' | 'en'): string {
  const heading = content.match(/^#{1,3}\s+(.+)$/m);
  if (heading) return heading[1].trim();
  const stem = path.basename(file, '.md').replace(/^\d{6}-/, '');
  if (lang === 'en') {
    return stem
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace(/\$dxdt\$/g, 'dx/dt');
  }
  return stem || 'Untitled';
}

function slugifyEn(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 45)
    .replace(/(^-|-$)/g, '');
}

function discoverAssetDir(file: string): string | null {
  const dir = path.dirname(file);
  const base = path.basename(file, '.md');
  const entries = fs.readdirSync(dir);
  const exact = entries.find((n) => {
    const full = path.join(dir, n);
    return fs.statSync(full).isDirectory() && n.startsWith(base);
  });
  if (exact) return path.join(dir, exact);
  const fallback = entries.find((n) => {
    const full = path.join(dir, n);
    return fs.statSync(full).isDirectory() && n.includes(base.slice(0, 6));
  });
  return fallback ? path.join(dir, fallback) : null;
}

function escapeMdx(body: string): string {
  const braceOpen = String.fromCharCode(123, 39, 123, 39, 125); // {'{'}
  const braceClose = String.fromCharCode(123, 39, 125, 39, 125); // {'}'}
  const lowerCodeLangs = body.replace(/```(\w+)/g, (_, lang) => `\`\`\`${lang.toLowerCase()}`);
  return lowerCodeLangs
    .split(/(```[\s\S]*?```)/g)
    .map((chunk, index) => {
      if (index % 2 === 1) return chunk; // code block
      return chunk
        .split(/(\$\$[\s\S]*?\$\$)/g)
        .map((segment, si) => {
          if (si % 2 === 1) return segment; // display math
          return segment
            .split(/(\$[^$\n]+?\$)/g)
            .map((part, pi) => {
              if (pi % 2 === 1) return part; // inline math
              return part
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/[{}]/g, (c) => (c === '{' ? braceOpen : braceClose));
            })
            .join('');
        })
        .join('');
    })
    .join('');
}

function getKnownAssets(assetDir: string | null): Set<string> {
  const known = new Set<string>();
  if (assetDir) {
    for (const file of fs.readdirSync(assetDir)) {
      const full = path.join(assetDir, file);
      if (fs.statSync(full).isFile()) known.add(file);
    }
  }
  return known;
}

function rewriteMarkdownImages(body: string, slug: string, known: Set<string>): string {
  return body.replace(/!\[[^\]]*\]\(([^)]+)\)/g, (full, src) => {
    const name = path.basename(src);
    if (known.has(name)) return `![${name}](/assets/posts/${slug}/${name})`;
    return `<!-- missing image: ${name} -->`;
  });
}

function rewriteHtmlMediaSrc(body: string, slug: string, known: Set<string>): string {
  const normalized = body.replace(/<img\b([^>]*)\/?>/gi, '<img$1 />');
  return normalized.replace(
    /(<(?:img|video)\b[^>]*?\s+src=["'])([^"']+)(["'][^>]*>)/gi,
    (full, prefix, src, suffix) => {
      const name = path.basename(src);
      if (known.has(name)) return `${prefix}/assets/posts/${slug}/${name}${suffix}`;
      return `${prefix}<!-- missing asset: ${name} -->${suffix}`;
    }
  );
}

function preserveHtmlMedia(body: string): { body: string; blocks: Map<string, string> } {
  const blocks = new Map<string, string>();
  let counter = 0;
  const pattern = /<(p|video)([^>]*)>[\s\S]*?<\/\1>|<img([^>]*)\/?>/gi;
  const newBody = body.replace(pattern, (match) => {
    const key = `__HTML_MEDIA_${counter++}__`;
    blocks.set(key, match);
    return key;
  });
  return { body: newBody, blocks };
}

function processSource(dir: string, lang: 'zh' | 'en'): SourceFile[] {
  const results: SourceFile[] = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md') || file.toLowerCase().startsWith('readme')) continue;
    const full = path.join(dir, file);
    const raw = fs.readFileSync(full, 'utf-8');
    const title = extractTitle(raw, full, lang);
    const key = path.basename(file, '.md');
    const dateKey = key.match(/^(\d{6})-/)?.[1] ?? key;
    const date = parseDate(file) ?? '2025-12-31';
    const category = CATEGORY_MAP[key] ?? CATEGORY_MAP[dateKey] ?? 'ai-infra';
    const tags = TAGS_MAP[key] ?? TAGS_MAP[dateKey] ?? [];
    const assetDir = discoverAssetDir(full);
    results.push({ file: full, date, title, category, tags, lang, body: raw, assetDir });
  }
  return results;
}

function writePost(post: SourceFile, slug: string, translationOf?: string): void {
  const outDir = post.lang === 'zh' ? OUT_ZH : OUT_EN;
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${post.date}-${slug}.mdx`);
  const known = getKnownAssets(post.assetDir);
  const hasHtmlMedia = /<(?:video|img)\b/i.test(post.body);
  const preserved = hasHtmlMedia
    ? preserveHtmlMedia(post.body)
    : { body: post.body, blocks: new Map<string, string>() };
  const escaped = escapeMdx(rewriteMarkdownImages(preserved.body, slug, known));
  const body = escaped.replace(/__HTML_MEDIA_(\d+)__/g, (match) => {
    const block = preserved.blocks.get(match);
    if (!block) return match;
    return rewriteHtmlMediaSrc(block, slug, known);
  });
  const readingTime = Math.max(1, Math.ceil(body.length / 500));
  const fm = [
    '---',
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `date: ${post.date}`,
    `category: "${post.category}"`,
    `tags: [${post.tags.map((t) => `"${t}"`).join(', ')}]`,
    `lang: "${post.lang}"`,
    `slug: "${slug}"`,
    translationOf ? `translationOf: "${translationOf}"` : null,
    `readingTime: ${readingTime}`,
    `description: ""`,
    '---',
    '',
    body,
  ]
    .filter(Boolean)
    .join('\n');
  fs.writeFileSync(outFile, fm, 'utf-8');
}

function copyAssets(post: SourceFile, slug: string): void {
  if (!post.assetDir) return;
  const target = path.join(ASSET_OUT, slug);
  fs.mkdirSync(target, { recursive: true });
  for (const file of fs.readdirSync(post.assetDir)) {
    const src = path.join(post.assetDir, file);
    const dst = path.join(target, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dst);
    }
  }
}

function main(): void {
  fs.rmSync(OUT_ZH, { recursive: true, force: true });
  fs.rmSync(OUT_EN, { recursive: true, force: true });
  fs.rmSync(ASSET_OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT_ZH, { recursive: true });
  fs.mkdirSync(OUT_EN, { recursive: true });
  fs.mkdirSync(ASSET_OUT, { recursive: true });

  const zhPosts = processSource(SRC_ZH, 'zh');
  const enPosts = processSource(SRC_EN, 'en');

  const enByDate = new Map(enPosts.map((p) => [p.date, p]));
  const enByFile = new Map(enPosts.map((p) => [path.basename(p.file, '.md'), p]));
  const manual: string[] = [];
  const success: string[] = [];

  for (const zh of zhPosts) {
    const key = path.basename(zh.file, '.md');
    const dateKey = key.match(/^(\d{6})-/)?.[1] ?? key;
    let slug = SPECIAL_SLUGS[key] ?? SPECIAL_SLUGS[dateKey];

    const enKey = TRANSLATION_PAIRS[key];
    const en = enKey ? (enByFile.get(enKey) ?? enByDate.get(zh.date)) : enByDate.get(zh.date);

    if (!slug) {
      const base = en ? extractTitle(en.body, en.file, 'en') : zh.title;
      slug = slugifyEn(base.replace(/[:?]/g, ''));
    }
    if (!slug) slug = dateKey;

    if (!CATEGORY_IDS.includes(zh.category)) {
      manual.push(`Unknown category for ${zh.file}: ${zh.category}`);
      continue;
    }

    writePost(zh, slug, en ? slug : undefined);
    copyAssets(zh, slug);
    success.push(`zh: ${slug}`);

    if (en) {
      writePost(en, slug, slug);
      copyAssets(en, slug);
      success.push(`en: ${slug}`);
      enByDate.delete(zh.date);
      enByFile.delete(path.basename(en.file, '.md'));
    }
  }

  for (const en of enByDate.values()) {
    const key = path.basename(en.file, '.md');
    const dateKey = key.match(/^(\d{6})-/)?.[1] ?? key;
    let slug =
      SPECIAL_SLUGS[key] ??
      SPECIAL_SLUGS[dateKey] ??
      slugifyEn(extractTitle(en.body, en.file, 'en'));
    if (!slug) slug = dateKey;
    writePost(en, slug);
    copyAssets(en, slug);
    success.push(`en: ${slug}`);
  }

  // eslint-disable-next-line no-console
  console.log(`Migrated ${success.length} posts.`);
  if (manual.length > 0) {
    console.warn('Manual review required:');
    for (const item of manual) console.warn(`  - ${item}`);
  }
}

main();
