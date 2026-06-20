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
  '260217': 'startup',
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
  和学弟的AI学习建议对话: 'learning',
};

const TAGS_MAP: Record<string, string[]> = {
  '251229': ['Cognitive Core', 'World Model', 'LLM'],
  '260128': ['Agent', 'Context Engineering', 'Evaluation'],
  '260130': ['Attention', 'Opus 4.5', 'Programming'],
  '260209': ['Uncertainty', 'Determinism', 'Cognitive Shift'],
  '260511': ['Claude Code', 'Bug', 'Agent Infra'],
  '260601': ['Engineering', 'Vibe Coding', 'Open-Closed Principle'],
};

const DATE_OVERRIDES: Record<string, string> = {
  '260220': '2026-02-21',
};

const SPECIAL_SLUGS: Record<string, string> = {
  '260220': 'reflections-tairan-weng-jiayi',
  '260221': 'reflections-tairan-weng-jiayi',
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
  if (lang === 'en') {
    const stem = path.basename(file, '.md').replace(/^\d{6}-/, '');
    return stem
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace(/\$dxdt\$/g, 'dx/dt');
  }
  return 'Untitled';
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

function rewriteImages(body: string, slug: string, assetDir: string | null): string {
  const known = new Set<string>();
  if (assetDir) {
    for (const img of fs.readdirSync(assetDir)) {
      if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(path.extname(img).toLowerCase())) {
        known.add(img);
      }
    }
  }
  let result = body;
  const imgPattern = /!\[[^\]]*\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = imgPattern.exec(body)) !== null) {
    const [full, src] = match;
    const name = path.basename(src);
    if (known.has(name)) {
      result = result.replace(full, `![${name}](/assets/posts/${slug}/${name})`);
    } else {
      result = result.replace(full, `<!-- missing image: ${name} -->`);
    }
  }
  return result;
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
    const category = CATEGORY_MAP[dateKey] ?? 'ai-infra';
    const tags = TAGS_MAP[dateKey] ?? [];
    const assetDir = discoverAssetDir(full);
    results.push({ file: full, date, title, category, tags, lang, body: raw, assetDir });
  }
  return results;
}

function writePost(post: SourceFile, slug: string, translationOf?: string): void {
  const outDir = post.lang === 'zh' ? OUT_ZH : OUT_EN;
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${post.date}-${slug}.mdx`);
  const body = escapeMdx(rewriteImages(post.body, slug, post.assetDir));
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
  const manual: string[] = [];
  const success: string[] = [];

  for (const zh of zhPosts) {
    const dateKey =
      path.basename(zh.file, '.md').match(/^(\d{6})-/)?.[1] ?? path.basename(zh.file, '.md');
    let slug = SPECIAL_SLUGS[dateKey];
    if (!slug) {
      const en = enByDate.get(zh.date);
      const base = en ? extractTitle(en.body, en.file, 'en') : zh.title;
      slug = slugifyEn(base.replace(/[:?]/g, ''));
    }
    if (!slug) slug = dateKey;

    if (!CATEGORY_IDS.includes(zh.category)) {
      manual.push(`Unknown category for ${zh.file}: ${zh.category}`);
      continue;
    }

    const en = enByDate.get(zh.date);
    writePost(zh, slug, en ? slug : undefined);
    copyAssets(zh, slug);
    success.push(`zh: ${slug}`);

    if (en) {
      writePost(en, slug, slug);
      copyAssets(en, slug);
      success.push(`en: ${slug}`);
      enByDate.delete(zh.date);
    }
  }

  for (const en of enByDate.values()) {
    const dateKey =
      path.basename(en.file, '.md').match(/^(\d{6})-/)?.[1] ?? path.basename(en.file, '.md');
    let slug = SPECIAL_SLUGS[dateKey] ?? slugifyEn(extractTitle(en.body, en.file, 'en'));
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
