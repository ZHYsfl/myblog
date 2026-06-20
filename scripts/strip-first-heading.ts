import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'src/content/posts';

function stripFirstHeading(filePath: string): void {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let inFrontmatter = false;
  let frontmatterEnd = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
      } else {
        frontmatterEnd = i;
        break;
      }
    }
  }
  if (frontmatterEnd === -1) return;
  // Find first heading after frontmatter
  for (let i = frontmatterEnd + 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    if (/^#{1,3}\s+/.test(lines[i])) {
      lines.splice(i, 1);
      // Also remove following empty line if present
      if (lines[i] && lines[i].trim() === '') lines.splice(i, 1);
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      return;
    }
    // Stop if we hit non-empty non-heading (e.g. paragraph)
    if (lines[i].trim() !== '') break;
  }
}

function main(): void {
  let count = 0;
  for (const lang of ['zh', 'en']) {
    const dir = path.join(ROOT, lang);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.mdx')) continue;
      stripFirstHeading(path.join(dir, file));
      count++;
    }
  }
  console.log(`Processed ${count} posts.`);
}

main();
