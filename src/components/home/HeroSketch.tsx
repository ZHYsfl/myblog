import { useEffect, useRef } from 'react';
import { W, H, hashSeed, mulberry32, paintElement, readPalette } from '@/lib/sketch/painter';
import type { Element } from '@/lib/sketch/types';

const elements: Element[] = [
  { type: 'orbitDots', x: 170, y: 185, r: 90, count: 14, accentEvery: 5, startDeg: -90 },
  {
    type: 'text',
    x: 170,
    y: 315,
    content: { zh: '好奇心', en: 'curiosity' },
    size: 's',
    tone: 'muted',
    align: 'center',
  },
  { type: 'rings', cx: 830, cy: 185, radii: [90, 58] },
  {
    type: 'text',
    x: 830,
    y: 315,
    content: { zh: '审美力', en: 'taste' },
    size: 's',
    tone: 'muted',
    align: 'center',
  },
  {
    type: 'text',
    x: 500,
    y: 272,
    content: { zh: '克制感', en: 'restraint' },
    size: 's',
    tone: 'muted',
    align: 'center',
  },
  { type: 'wave', x: 140, y: 350, w: 720, h: 12, cycles: 4 },
];

export function HeroSketch({ lang }: { lang: 'zh' | 'en' }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;

    const render = () => {
      if (disposed || !host.isConnected) return;
      const palette = readPalette();
      const dpr = Math.min(window.devicePixelRatio, 2);
      const cssW = host.clientWidth;
      const cssH = host.clientHeight;
      if (cssW === 0) return;

      const bg = document.createElement('canvas');
      bg.width = cssW * dpr;
      bg.height = cssH * dpr;
      const bctx = bg.getContext('2d')!;
      bctx.scale(dpr, dpr);
      bctx.fillStyle = palette.hairline;
      for (let x = 13; x < cssW; x += 26) {
        for (let y = 13; y < cssH; y += 26) {
          bctx.globalAlpha = 0.5;
          bctx.fillRect(x, y, 1.6, 1.6);
        }
      }

      host.innerHTML = '';
      const bgDiv = document.createElement('div');
      bgDiv.style.position = 'absolute';
      bgDiv.style.inset = '0';
      bgDiv.style.backgroundImage = `url(${bg.toDataURL()})`;
      bgDiv.style.backgroundSize = `${cssW}px ${cssH}px`;
      bgDiv.style.opacity = '0.7';
      host.appendChild(bgDiv);

      elements.forEach((el, idx) => {
        const c = document.createElement('canvas');
        c.width = W * dpr;
        c.height = H * dpr;
        c.style.position = 'absolute';
        c.style.inset = '0';
        c.style.width = '100%';
        c.style.height = '100%';
        const ctx = c.getContext('2d')!;
        ctx.scale(dpr, dpr);
        paintElement(ctx, el, palette, mulberry32(hashSeed(`home-hero:${el.type}:${idx}`)), lang);
        host.appendChild(c);
      });
    };

    render();
    const mo = new MutationObserver(render);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('resize', render);
    return () => {
      disposed = true;
      mo.disconnect();
      window.removeEventListener('resize', render);
    };
  }, [lang]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="relative aspect-[1000/380] w-full overflow-hidden rounded-2xl border border-border bg-surface"
    />
  );
}
