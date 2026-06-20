import fs from 'node:fs';
import path from 'node:path';

const OLD_ROOT = 'C:/Users/Zane/AppData/Local/Temp/old_norm2';
const POSTS_ROOT = 'src/content/posts';

function stripHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…');
}

function extractTitleFromOldDist(htmlPath: string): string | null {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const match = html.match(/<h1 class="mb-4[^"]*">(.*?)<\/h1>/);
  if (!match) return null;
  return stripHtmlEntities(match[1].trim());
}

function stripMarkdown(text: string): string {
  return text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/__/g, '').replace(/_/g, '');
}

function findSourceFile(lang: string, slug: string): string | null {
  const dir = path.join(POSTS_ROOT, lang);
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith(`-${slug}.mdx`)) {
      return path.join(dir, file);
    }
  }
  return null;
}

function updateMdxTitle(filePath: string, newTitle: string): void {
  let content = fs.readFileSync(filePath, 'utf8');
  // Update frontmatter title
  content = content.replace(
    /^title:\s*(['"])(.*)\1/m,
    (match, quote, oldTitle) =>
      `title: ${quote}${newTitle.replace(/\\/g, '\\\\').replace(new RegExp(quote, 'g'), '\\' + quote)}${quote}`
  );

  // Remove first heading if it matches the title (with markdown stripped)
  const strippedTitle = stripMarkdown(newTitle).trim();
  const headingPattern = /^#{1,3}\s+\*?\*?([^\n]+?)\*?\*?\s*(?:\n|$)/m;
  const headingMatch = content.match(headingPattern);
  if (headingMatch && stripMarkdown(headingMatch[1]).trim() === strippedTitle) {
    content = content.replace(headingMatch[0], '');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

function main(): void {
  let updated = 0;
  for (const lang of ['zh', 'en']) {
    const dir = path.join(OLD_ROOT, 'posts', lang);
    if (!fs.existsSync(dir)) continue;
    for (const slug of fs.readdirSync(dir)) {
      const oldHtml = path.join(dir, slug, 'index.html');
      if (!fs.existsSync(oldHtml)) continue;
      const title = extractTitleFromOldDist(oldHtml);
      if (!title) continue;
      const sourceFile = findSourceFile(lang, slug);
      if (!sourceFile) {
        console.warn(`Source not found: ${lang}/${slug}`);
        continue;
      }
      updateMdxTitle(sourceFile, title);
      updated++;
    }
  }
  console.log(`Updated ${updated} post titles.`);
}

main();
