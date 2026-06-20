import fs from 'node:fs';

const files: { src: string; dst: string }[] = [
  {
    src: 'AIInsights/ChineseVersion/251205-智能的统一方程：从dx÷dt到图论，论Agent与世界模型的终极形态.md',
    dst: 'src/content/posts/zh/2025-12-05-the-unified-equation-of-intelligence-from-dxd.mdx',
  },
  {
    src: 'AIInsights/EnglishVersion/251205-The-Unified-Equation-of-Intelligence-From-$dxdt$-to-Graph-Theory-—-On-the-Ultimate-Form-of-Agents-and-World-Models.md',
    dst: 'src/content/posts/en/2025-12-05-the-unified-equation-of-intelligence-from-dxd.mdx',
  },
];

function restore(src: string, dst: string): void {
  const original = fs.readFileSync(src, 'utf8');
  const fmEnd = original.indexOf('\n---\n');
  // The original starts with a heading; skip it plus the following separator and blank lines.
  let bodyStart = fmEnd >= 0 ? fmEnd + 5 : 0;
  while (original[bodyStart] === '\n') bodyStart++;
  const body = original.slice(bodyStart);

  const dstContent = fs.readFileSync(dst, 'utf8');
  const dstFmEnd = dstContent.indexOf('\n---\n');
  const frontmatter = dstContent.slice(0, dstFmEnd + 5);

  fs.writeFileSync(dst, `${frontmatter}\n${body}`, 'utf8');
  console.log(`Restored ${dst}`);
}

for (const { src, dst } of files) restore(src, dst);
