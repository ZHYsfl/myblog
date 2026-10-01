import { useEffect, useRef, useState } from 'react';
import type { Element, Plate, SketchSpec } from '@/lib/sketch/types';
import { W, H, hashSeed, mulberry32, paintElement, readPalette } from '@/lib/sketch/painter';

const specModules = import.meta.glob('@/data/sketches/*.json', { eager: true }) as Record<
  string,
  { default: SketchSpec }
>;
const specs = new Map<string, SketchSpec>();
for (const [path, mod] of Object.entries(specModules)) {
  const slug = path.split('/').pop()!.replace('.json', '');
  specs.set(slug, mod.default);
}

export function hasSketch(slug: string): boolean {
  return specs.has(slug);
}

function normalizePlates(spec: SketchSpec): Plate[] {
  if (spec.plates) return spec.plates;
  if (spec.elements) return [{ placement: 'top', elements: spec.elements }];
  return [];
}

export function PostSketch({ slug, lang }: { slug: string; lang: 'zh' | 'en' }) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const anchor = anchorRef.current;
    const spec = specs.get(slug);
    if (!anchor || !spec) return;

    let disposed = false;
    let cleanups: Array<() => void> = [];
    const hosts: Array<{ plate: Plate; div: HTMLDivElement; seed: string }> = [];

    const article = anchor.closest('article');

    normalizePlates(spec).forEach((plate, i) => {
      const div = document.createElement('div');
      div.className =
        'sketch-plate relative mb-10 mt-8 aspect-[1000/380] w-full overflow-hidden rounded-2xl border border-border bg-surface';
      div.setAttribute('aria-hidden', 'true');
      const seed = `${slug}:${i}`;

      if (plate.placement === 'end') {
        const prose = article?.querySelector('.prose');
        prose?.insertAdjacentElement('afterend', div);
      } else if (plate.after) {
        const headings = Array.from(article?.querySelectorAll('.prose h2') ?? []);
        const hit = headings.find((h) => h.textContent?.includes(plate.after!));
        if (hit) {
          hit.insertAdjacentElement('afterend', div);
        } else {
          (article?.querySelector('.prose') ?? anchor).insertAdjacentElement('afterend', div);
        }
      } else {
        anchor.parentElement?.insertBefore(div, anchor);
      }
      hosts.push({ plate, div, seed });
    });

    const renderAll = () => {
      cleanups.forEach((fn) => fn());
      cleanups = [];
      if (disposed) return;
      hosts.forEach(({ plate, div, seed }) => {
        if (document.body.contains(div))
          cleanups.push(renderSketch(div, plate.elements, seed, lang));
      });
    };
    renderAll();

    const mo = new MutationObserver(() => renderAll());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const onResize = () => renderAll();
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      mo.disconnect();
      window.removeEventListener('resize', onResize);
      cleanups.forEach((fn) => fn());
      hosts.forEach(({ div }) => div.remove());
    };
  }, [mounted, slug, lang]);

  if (!specs.has(slug)) return null;
  return <span ref={anchorRef} className="block" />;
}

function renderSketch(
  host: HTMLDivElement,
  elements: Element[],
  seedKey: string,
  lang: 'zh' | 'en'
) {
  const palette = readPalette();
  const dpr = Math.min(window.devicePixelRatio, 2);
  const cssW = host.clientWidth;
  const cssH = host.clientHeight;
  if (cssW === 0) return () => {};

  // dot grid background
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

  // one offscreen canvas per element (for staggered fade-in)
  const layers = elements.map((el, idx) => {
    const c = document.createElement('canvas');
    c.width = W * dpr;
    c.height = H * dpr;
    c.style.position = 'absolute';
    c.style.inset = '0';
    c.style.width = '100%';
    c.style.height = '100%';
    const ctx = c.getContext('2d')!;
    ctx.scale(dpr, dpr);
    const rand = mulberry32(hashSeed(seedKey + ':' + el.type + idx));
    paintElement(ctx, el, palette, rand, lang);
    return c;
  });

  const bgDiv = document.createElement('div');
  bgDiv.style.position = 'absolute';
  bgDiv.style.inset = '0';
  bgDiv.style.backgroundImage = `url(${bg.toDataURL()})`;
  bgDiv.style.backgroundSize = `${cssW}px ${cssH}px`;
  bgDiv.style.opacity = '0.7';

  host.innerHTML = '';
  host.appendChild(bgDiv);
  layers.forEach((l) => host.appendChild(l));

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return () => {};

  layers.forEach((l) => (l.style.opacity = '0'));
  let raf = 0;
  let started = false;
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting || started) return;
      started = true;
      const t0 = performance.now();
      const step = (now: number) => {
        const elapsed = now - t0;
        layers.forEach((l, i) => {
          const local = Math.min(1, Math.max(0, (elapsed - i * 140) / 450));
          l.style.opacity = String(local);
        });
        if (elapsed < layers.length * 140 + 500) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      io.disconnect();
    },
    { threshold: 0.25 }
  );
  io.observe(host);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    host.innerHTML = '';
  };
}
