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
      if (host.clientWidth === 0) return;

      host.innerHTML = '';
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
      className="relative aspect-[1000/380] w-full overflow-hidden"
    />
  );
}
