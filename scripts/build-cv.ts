/**
 * Regenerate public/CV/个人简历.pdf from the web resume copy
 * (src/components/about/resume-copy.ts), styled with the site's own
 * visual language: serif, hairlines, generous whitespace, one accent.
 *
 * Usage: npm run build-cv
 */

import { chromium } from 'playwright';
import sharp from 'sharp';
import { copy } from '../src/components/about/resume-copy';

const zh = copy.zh;

const esc = (s: string) => s;
const contact = zh.contact.items.map((i) => i.replace(/^[^：:]*[：:]\s*/, ''));
const name = '周浩洋';

const photo = await sharp('public/images/about/photo2.jpg')
  .resize(160, 160, { fit: 'cover' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer();
const photoUri = `data:image/jpeg;base64,${photo.toString('base64')}`;

const section = (title: string, inner: string) => `
  <section>
    <h2><span>${title}</span><i></i></h2>
    ${inner}
  </section>`;

const edu = `
  <div class="row"><p class="lead">${zh.education.school}</p></div>
  <div class="row"><p class="lead">${zh.education.school2}</p></div>
  <p class="body">${zh.education.gpa}</p>
  <p class="body">${zh.education.math}</p>
  <p class="body">${zh.education.cs}</p>
  <p class="body accent-line">${zh.education.summary}</p>`;

const research = zh.research.items
  .map(
    (it) => `
  <div class="item">
    <div class="row"><p class="item-title">${esc(it.title)}</p><p class="date">${it.date}</p></div>
    ${'sub' in it && it.sub ? `<p class="sub">${it.sub}</p>` : ''}
    <p class="body">${it.body}</p>
  </div>`
  )
  .join('');

const honors = `<ul>${zh.honors.items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const skills = zh.skills.items
  .map((i) => {
    const idx = i.indexOf('：');
    return `<p class="body def"><b>${i.slice(0, idx)}</b>${i.slice(idx)}</p>`;
  })
  .join('');
const traits = zh.traits.items
  .map((i) => {
    const idx = i.indexOf('：');
    return `<p class="body def"><b>${i.slice(0, idx)}</b>${i.slice(idx)}</p>`;
  })
  .join('');

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: 'Noto Serif CJK SC', 'Source Han Serif SC', 'Songti SC', Georgia, serif;
    color: #1c1c1a;
    padding: 15mm 17mm 13mm;
    font-size: 9.3pt;
    line-height: 1.58;
  }
  header { margin-bottom: 7mm; }
  .head-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8mm; }
  .me {
    width: 21mm; height: 21mm; object-fit: cover;
    border-radius: 2.5mm; border: 1px solid #e9e9e6; flex-shrink: 0;
  }
  h1 { font-size: 21pt; font-weight: 600; letter-spacing: 0.06em; }
  .tagline { margin-top: 1.2mm; color: #6f6f6a; font-size: 9.6pt; letter-spacing: 0.04em; }
  .contact { margin-top: 2.6mm; color: #6f6f6a; font-size: 8.8pt; letter-spacing: 0.02em; }
  .contact span + span::before { content: '·'; margin: 0 2.2mm; color: #c8c8c4; }
  header hr { border: 0; border-top: 1px solid #e9e9e6; margin-top: 4.5mm; }

  section { margin-top: 5.2mm; }
  h2 {
    display: flex; align-items: baseline; gap: 3mm;
    font-size: 9pt; font-weight: 600; letter-spacing: 0.22em; color: #6f6f6a;
    margin-bottom: 2.6mm;
  }
  h2 i { flex: 1; border-top: 1px solid #e9e9e6; transform: translateY(-1mm); }

  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 6mm; }
  .lead { font-weight: 600; font-size: 9.6pt; }
  .item { margin-top: 2.8mm; }
  .item-title { font-weight: 600; font-size: 9.9pt; }
  .date { color: #6f6f6a; font-size: 8.6pt; white-space: nowrap; }
  .sub { color: #6f6f6a; font-size: 8.8pt; margin-top: 0.4mm; }
  .body { margin-top: 0.8mm; }
  .accent-line { color: #dc4c3a; }
  strong { font-weight: 600; }

  ul { list-style: none; }
  li { position: relative; padding-left: 4mm; margin-top: 0.9mm; }
  li::before {
    content: ''; position: absolute; left: 0; top: 0.62em;
    width: 1.4mm; height: 1.4mm; background: #dc4c3a; border-radius: 50%;
  }
  .def b { font-weight: 600; }
  .def { margin-top: 0.9mm; }
</style>
</head>
<body>
  <header>
    <div class="head-row">
      <div>
        <h1>${name}</h1>
        <p class="tagline">全双工端到端实时语音交互大模型 · 语音智能体</p>
        <p class="contact">${contact.map((c) => `<span>${c}</span>`).join('')}<span>博客 zhouhaoyang.me</span></p>
      </div>
      <img class="me" src="${photoUri}" alt="" />
    </div>
    <hr />
  </header>
  ${section(zh.education.title, edu)}
  ${section(zh.research.title, research)}
  ${section(zh.honors.title, honors)}
  ${section(zh.skills.title, skills)}
  ${section(zh.traits.title, traits)}
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.pdf({
  path: 'public/CV/个人简历.pdf',
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
});
if (process.env.CV_PREVIEW) {
  const { writeFileSync } = await import('node:fs');
  writeFileSync('/tmp/cv-preview.html', html);
}
await browser.close();
console.log('[build-cv] wrote public/CV/个人简历.pdf');
