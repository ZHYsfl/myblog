import fs from 'node:fs';
import path from 'node:path';
import { CATEGORY_IDS } from '../src/lib/constants';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function main(): void {
  const args = process.argv.slice(2);
  const titleIndex = args.indexOf('--title');
  const categoryIndex = args.indexOf('--category');
  const langIndex = args.indexOf('--lang');

  const title = titleIndex >= 0 ? args[titleIndex + 1] : '';
  const category = categoryIndex >= 0 ? args[categoryIndex + 1] : 'ai-infra';
  const lang = langIndex >= 0 ? args[langIndex + 1] : 'zh';

  if (!title) {
    console.error('Usage: npm run new:post -- --title "Title" --category ai-infra --lang zh');
    process.exit(1);
  }

  if (!CATEGORY_IDS.includes(category)) {
    console.error(`Invalid category. Choose from: ${CATEGORY_IDS.join(', ')}`);
    process.exit(1);
  }

  const today = new Date().toISOString().split('T')[0];
  const slug = slugify(title).replace(/[\u4e00-\u9fa5]/g, '');
  const fileName = `${today}-${slug}.mdx`;
  const dir = path.join('src/content/posts', lang);
  const filePath = path.join(dir, fileName);
  const assetDir = path.join('public/assets/posts', slug);

  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(assetDir, { recursive: true });

  const frontmatter = `---
title: "${title}"
date: ${today}
category: "${category}"
tags: []
lang: "${lang}"
slug: "${slug}"
readingTime: 5
description: ""
---

Start writing here.
`;

  fs.writeFileSync(filePath, frontmatter, 'utf-8');

  // eslint-disable-next-line no-console
  console.log(`✅ Created ${filePath}`);
  // eslint-disable-next-line no-console
  console.log(`📁 Put images in ${assetDir}`);
}

main();
