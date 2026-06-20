import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'src/content/posts';

function escapeInMath(content: string): string {
  // Escape { and } inside inline ($...$) and display ($$...$$) math.
  // Already escaped placeholders {'{'} and {'}'} should not be touched.
  return content
    .split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g)
    .map((chunk, index) => {
      if (index % 2 === 0) return chunk;
      return chunk.replace(/\{/g, "{'{'}").replace(/\}/g, "{'}'}");
    })
    .join('');
}

function main(): void {
  let count = 0;
  for (const lang of ['zh', 'en']) {
    const dir = path.join(ROOT, lang);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.mdx')) continue;
      const p = path.join(dir, file);
      const content = fs.readFileSync(p, 'utf8');
      const updated = escapeInMath(content);
      if (updated !== content) {
        fs.writeFileSync(p, updated, 'utf8');
        count++;
      }
    }
  }
  console.log(`Updated ${count} posts.`);
}

main();
