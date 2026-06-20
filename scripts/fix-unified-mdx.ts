import fs from 'node:fs';

const braceOpen = String.fromCharCode(123, 39, 123, 39, 125); // {'{'}
const braceClose = String.fromCharCode(123, 39, 125, 39, 125); // {'}'}

function escapeMdx(body: string): string {
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

const files = [
  'src/content/posts/zh/2025-12-05-the-unified-equation-of-intelligence-from-dxd.mdx',
  'src/content/posts/en/2025-12-05-the-unified-equation-of-intelligence-from-dxd.mdx',
];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const fmEnd = content.indexOf('\n---\n');
  const frontmatter = content.slice(0, fmEnd + 5);
  const body = content.slice(fmEnd + 5);
  fs.writeFileSync(file, `${frontmatter}\n${escapeMdx(body)}`, 'utf8');
  console.log(`Escaped ${file}`);
}
