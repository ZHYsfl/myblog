import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…');
}

function processHtml(filePath: string): void {
  let c = fs.readFileSync(filePath, 'utf8');
  // Inline math
  c = c.replace(/<code class="language-math math-inline">(.*?)<\/code>/g, (match, inner) => {
    return `$${decodeHtml(inner)}$`;
  });
  // Display math wrapped in <pre><code>
  c = c.replace(
    /<pre><code class="language-math math-display">([\s\S]*?)<\/code><\/pre>/g,
    (match, inner) => {
      return `<p>$$\n${decodeHtml(inner)}\n$$</p>`;
    }
  );
  // Display math as bare $$...$$
  c = c.replace(/\n\$\$([\s\S]*?)\$\$\n/g, (match, inner) => {
    return `\n<p>$$\n${decodeHtml(inner).trim()}\n$$</p>\n`;
  });
  fs.writeFileSync(filePath, c, 'utf8');
}

function walk(dir: string): void {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.html')) processHtml(p);
  }
}

walk(DIST);
console.log('Post-processed math in dist.');
