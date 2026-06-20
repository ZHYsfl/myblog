import fs from 'node:fs';

const file = 'dist/posts/en/the-unified-equation-of-intelligence-from-dxd/index.html';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/<p>\$\$\n([\s\S]*?)\n\$\$<\/p>/g, (match, inner) => {
  return `<p>$$${inner.trim()}$$</p>`;
});
fs.writeFileSync(file, c, 'utf8');
console.log('Collapsed English math.');
