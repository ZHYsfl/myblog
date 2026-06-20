import fs from 'node:fs';

const files = [
  'src/content/posts/zh/2025-12-05-the-unified-equation-of-intelligence-from-dxd.mdx',
  'src/content/posts/en/2025-12-05-the-unified-equation-of-intelligence-from-dxd.mdx',
];

for (const file of files) {
  let c = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const fmEnd = c.indexOf('\n---\n');
  const frontmatter = c.slice(0, fmEnd + 5);
  let body = c.slice(fmEnd + 5).trimStart();
  // Remove first heading if present
  const headingMatch = body.match(/^#{1,3}\s+.*?\n+/m);
  if (headingMatch) {
    body = body.slice(headingMatch[0].length);
  }

  fs.writeFileSync(file, `${frontmatter}\n${body}`, 'utf8');
  console.log(`Cleaned ${file}`);
}
