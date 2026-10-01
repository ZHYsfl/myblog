import { useEffect, useRef, useState } from 'react';

/**
 * PostSketch — a hand-drawn "manuscript plate" unique to each post.
 * Engine renders a declarative spec (src/data/sketches/<slug>.json) in a
 * consistent pencil-and-dot-grid aesthetic; content is per-post.
 *
 * Virtual canvas: 1000 x 380. All element coords live in that space.
 */

type V2 = [number, number];

interface TextSpec {
  x: number;
  y: number;
  content: string | { zh: string; en: string };
  size?: 's' | 'm' | 'l';
  tone?: 'ink' | 'muted' | 'accent';
  align?: 'left' | 'center' | 'right';
}

type Element =
  | {
      type: 'rings';
      cx?: number;
      cy?: number;
      radii: number[];
      labels?: { r: number; text: string | { zh: string; en: string }; angle?: number }[];
    }
  | { type: 'circle'; x: number; y: number; r: number; accent?: boolean; dashed?: boolean }
  | { type: 'path'; points: V2[]; closed?: boolean; accent?: boolean }
  | { type: 'curve'; points: V2[]; accent?: boolean; closed?: boolean }
  | {
      type: 'nodes';
      items: {
        x: number;
        y: number;
        label?: string | { zh: string; en: string };
        accent?: boolean;
        r?: number;
      }[];
      edges?: [number, number][];
      edgeAccent?: number[];
    }
  | {
      type: 'arrow';
      from: V2;
      to: V2;
      label?: string | { zh: string; en: string };
      accent?: boolean;
      both?: boolean;
    }
  | {
      type: 'axis';
      x?: number;
      y?: number;
      from?: number;
      to?: number;
      ticks?: number;
      labels?: (string | { zh: string; en: string })[];
    }
  | {
      type: 'bars';
      x: number;
      y: number;
      w: number;
      h: number;
      values: number[];
      labels?: (string | { zh: string; en: string })[];
      accentIndex?: number;
    }
  | {
      type: 'wave';
      x: number;
      y: number;
      w: number;
      h: number;
      points?: number[];
      cycles?: number;
      accent?: boolean;
    }
  | {
      type: 'spiral';
      x: number;
      y: number;
      r0: number;
      r1: number;
      turns: number;
      accent?: boolean;
    }
  | {
      type: 'orbitDots';
      x: number;
      y: number;
      r: number;
      count: number;
      accentEvery?: number;
      startDeg?: number;
    }
  | {
      type: 'grid';
      x: number;
      y: number;
      w: number;
      h: number;
      cols: number;
      rows: number;
      accentCells?: [number, number][];
    }
  | { type: 'dot'; x: number; y: number; accent?: boolean; r?: number }
  | { type: 'measure'; from: V2; to: V2; label?: string | { zh: string; en: string } }
  | {
      type: 'angle';
      x: number;
      y: number;
      r: number;
      fromDeg: number;
      toDeg: number;
      label?: string | { zh: string; en: string };
    }
  | ({ type: 'text' } & TextSpec);

interface SketchSpec {
  /** multiple plates allowed; legacy single-plate { elements } also accepted */
  plates?: Plate[];
  elements?: Element[];
}

interface Plate {
  /** 'top' (default, right under the post header) | 'end' (after the article) */
  placement?: 'top' | 'end';
  /** mid-article: insert after the first h2 whose text contains this substring */
  after?: string;
  elements: Element[];
}

const W = 1000;
const H = 380;

/* ---------- deterministic random ---------- */
function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Palette = { ink: string; muted: string; accent: string; hairline: string };

function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  return {
    ink: cs.getPropertyValue('--fg').trim() || '#1c1c1a',
    muted: cs.getPropertyValue('--muted').trim() || '#6f6f6a',
    accent: cs.getPropertyValue('--accent').trim() || '#dc4c3a',
    hairline: cs.getPropertyValue('--border').trim() || '#e9e9e6',
  };
}

function resolveText(t: string | { zh: string; en: string }, lang: 'zh' | 'en'): string {
  return typeof t === 'string' ? t : t[lang];
}

/* ---------- painters ---------- */

function fontFor(size: 's' | 'm' | 'l'): string {
  const px = size === 'l' ? 22 : size === 'm' ? 17 : 13;
  return `${px}px Georgia, "Noto Serif SC", "Songti SC", serif`;
}

function paintText(ctx: CanvasRenderingContext2D, el: TextSpec, p: Palette, lang: 'zh' | 'en') {
  ctx.font = fontFor(el.size ?? 'm');
  ctx.fillStyle = el.tone === 'accent' ? p.accent : el.tone === 'ink' ? p.ink : p.muted;
  ctx.textAlign = el.align ?? 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(resolveText(el.content, lang), el.x, el.y);
}

/** pencil double-stroke along points */
function pencilPath(
  ctx: CanvasRenderingContext2D,
  pts: V2[],
  color: string,
  rand: () => number,
  closed = false,
  width = 1.5
) {
  for (let pass = 0; pass < 2; pass++) {
    ctx.beginPath();
    pts.forEach(([x, y], i) => {
      const jx = x + (rand() - 0.5) * (pass ? 2.4 : 1.2);
      const jy = y + (rand() - 0.5) * (pass ? 2.4 : 1.2);
      if (i === 0) ctx.moveTo(jx, jy);
      else ctx.lineTo(jx, jy);
    });
    if (closed) ctx.closePath();
    ctx.strokeStyle = color;
    ctx.globalAlpha = pass ? 0.35 : 0.9;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

function catmullRom(pts: V2[], samples = 16): V2[] {
  if (pts.length < 3) return pts;
  const out: V2[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let j = 0; j < samples; j++) {
      const t = j / samples;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 *
          (2 * p1[0] +
            (-p0[0] + p2[0]) * t +
            (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
            (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 *
          (2 * p1[1] +
            (-p0[1] + p2[1]) * t +
            (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
            (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function roughCircle(cx: number, cy: number, r: number, rand: () => number, wobble = 0.012): V2[] {
  const pts: V2[] = [];
  for (let i = 0; i <= 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const w =
      Math.sin(a * 3 + rand() * 6) * r * wobble + Math.sin(a * 7 + rand() * 4) * r * wobble * 0.6;
    pts.push([cx + Math.cos(a) * (r + w), cy + Math.sin(a) * (r + w)]);
  }
  return pts;
}

function drawArrowHead(ctx: CanvasRenderingContext2D, from: V2, to: V2, color: string) {
  const ang = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const len = 9;
  ctx.beginPath();
  ctx.moveTo(to[0], to[1]);
  ctx.lineTo(to[0] - len * Math.cos(ang - 0.42), to[1] - len * Math.sin(ang - 0.42));
  ctx.moveTo(to[0], to[1]);
  ctx.lineTo(to[0] - len * Math.cos(ang + 0.42), to[1] - len * Math.sin(ang + 0.42));
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.stroke();
}

function paintElement(
  ctx: CanvasRenderingContext2D,
  el: Element,
  p: Palette,
  rand: () => number,
  lang: 'zh' | 'en'
) {
  const ink = (el as { accent?: boolean }).accent ? p.accent : p.ink;
  switch (el.type) {
    case 'rings': {
      const cx = el.cx ?? W / 2;
      const cy = el.cy ?? H / 2;
      for (const r of el.radii)
        pencilPath(ctx, roughCircle(cx, cy, r, rand), p.muted, rand, true, 1.1);
      for (const lb of el.labels ?? []) {
        const a = ((lb.angle ?? 0) * Math.PI) / 180;
        paintText(
          ctx,
          {
            x: cx + Math.cos(a) * lb.r,
            y: cy + Math.sin(a) * lb.r - 10,
            content: lb.text,
            size: 's',
            tone: 'muted',
            align: 'center',
          },
          p,
          lang
        );
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * lb.r, cy + Math.sin(a) * lb.r, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = p.muted;
        ctx.fill();
      }
      break;
    }
    case 'circle': {
      const pts: V2[] = [];
      for (let i = 0; i <= 90; i++) {
        const a = (i / 90) * Math.PI * 2;
        pts.push([el.x + Math.cos(a) * el.r, el.y + Math.sin(a) * el.r]);
      }
      pencilPath(ctx, pts, el.accent ? p.accent : p.muted, rand, true);
      break;
    }
    case 'path':
      pencilPath(ctx, el.points, ink, rand, el.closed);
      break;
    case 'curve':
      pencilPath(ctx, catmullRom(el.points), ink, rand, el.closed);
      break;
    case 'nodes': {
      for (const [i, j] of el.edges ?? []) {
        const a = el.items[i];
        const b = el.items[j];
        const accentEdge =
          el.edgeAccent?.includes(i * 100 + j) || el.edgeAccent?.includes(j * 100 + i);
        pencilPath(
          ctx,
          [
            [a.x, a.y],
            [b.x, b.y],
          ],
          accentEdge ? p.accent : p.muted,
          rand,
          false,
          1.1
        );
      }
      el.items.forEach((n, idx) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r ?? 4, 0, Math.PI * 2);
        ctx.fillStyle = n.accent ? p.accent : p.ink;
        ctx.fill();
        if (n.label) {
          paintText(
            ctx,
            {
              x: n.x,
              y: n.y - (n.r ?? 4) - 12,
              content: n.label,
              size: 's',
              tone: n.accent ? 'accent' : 'muted',
              align: 'center',
            },
            p,
            lang
          );
        }
        void idx;
      });
      break;
    }
    case 'arrow': {
      pencilPath(ctx, [el.from, el.to], el.accent ? p.accent : p.ink, rand);
      drawArrowHead(ctx, el.from, el.to, el.accent ? p.accent : p.ink);
      if (el.both) drawArrowHead(ctx, el.to, el.from, el.accent ? p.accent : p.ink);
      if (el.label) {
        paintText(
          ctx,
          {
            x: (el.from[0] + el.to[0]) / 2,
            y: (el.from[1] + el.to[1]) / 2 - 12,
            content: el.label,
            size: 's',
            tone: el.accent ? 'accent' : 'muted',
            align: 'center',
          },
          p,
          lang
        );
      }
      break;
    }
    case 'axis': {
      if (el.x !== undefined) {
        const y0 = el.from ?? 40;
        const y1 = el.to ?? H - 50;
        pencilPath(
          ctx,
          [
            [el.x, y0],
            [el.x, y1],
          ],
          p.muted,
          rand,
          false,
          1.1
        );
        const ticks = el.ticks ?? 0;
        for (let i = 0; i <= ticks; i++) {
          const ty = y0 + ((y1 - y0) * i) / ticks;
          pencilPath(
            ctx,
            [
              [el.x - 5, ty],
              [el.x + 5, ty],
            ],
            p.muted,
            rand,
            false,
            1
          );
          const lb = el.labels?.[i];
          if (lb)
            paintText(
              ctx,
              { x: el.x - 12, y: ty, content: lb, size: 's', tone: 'muted', align: 'right' },
              p,
              lang
            );
        }
      } else {
        const x0 = el.from ?? 60;
        const x1 = el.to ?? W - 60;
        const y = el.y ?? H - 70;
        pencilPath(
          ctx,
          [
            [x0, y],
            [x1, y],
          ],
          p.muted,
          rand,
          false,
          1.1
        );
        const ticks = el.ticks ?? 0;
        for (let i = 0; i <= ticks; i++) {
          const tx = x0 + ((x1 - x0) * i) / ticks;
          pencilPath(
            ctx,
            [
              [tx, y - 4],
              [tx, y + 4],
            ],
            p.muted,
            rand,
            false,
            1
          );
          const lb = el.labels?.[i];
          if (lb)
            paintText(
              ctx,
              { x: tx, y: y + 18, content: lb, size: 's', tone: 'muted', align: 'center' },
              p,
              lang
            );
        }
      }
      break;
    }
    case 'bars': {
      const max = Math.max(...el.values, 0.0001);
      const bw = el.w / el.values.length;
      pencilPath(
        ctx,
        [
          [el.x, el.y],
          [el.x + el.w, el.y],
        ],
        p.muted,
        rand,
        false,
        1.1
      );
      el.values.forEach((v, i) => {
        const bh = (v / max) * el.h;
        const cx = el.x + bw * i + bw / 2;
        pencilPath(
          ctx,
          [
            [cx - bw * 0.28, el.y],
            [cx - bw * 0.28, el.y - bh],
            [cx + bw * 0.28, el.y - bh],
            [cx + bw * 0.28, el.y],
          ],
          i === el.accentIndex ? p.accent : p.ink,
          rand
        );
        const lb = el.labels?.[i];
        if (lb)
          paintText(
            ctx,
            { x: cx, y: el.y + 16, content: lb, size: 's', tone: 'muted', align: 'center' },
            p,
            lang
          );
      });
      break;
    }
    case 'wave': {
      const pts: V2[] = [];
      const n = 240;
      const data = el.points;
      for (let i = 0; i <= n; i++) {
        const f = i / n;
        const env = data
          ? data[Math.min(data.length - 1, Math.floor(f * data.length))]
          : Math.sin(f * Math.PI);
        const y = el.y + Math.sin(f * Math.PI * 2 * (el.cycles ?? 6)) * env * el.h * 0.5;
        pts.push([el.x + f * el.w, y]);
      }
      pencilPath(ctx, pts, el.accent ? p.accent : p.ink, rand);
      pencilPath(
        ctx,
        [
          [el.x - 8, el.y],
          [el.x + el.w + 8, el.y],
        ],
        p.hairline,
        rand,
        false,
        1
      );
      break;
    }
    case 'spiral': {
      const pts: V2[] = [];
      const steps = 220;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const a = t * el.turns * Math.PI * 2;
        const r = el.r0 + (el.r1 - el.r0) * t;
        pts.push([el.x + Math.cos(a) * r, el.y + Math.sin(a) * r]);
      }
      pencilPath(ctx, pts, el.accent ? p.accent : p.ink, rand);
      break;
    }
    case 'orbitDots': {
      for (let i = 0; i < el.count; i++) {
        const a = (((el.startDeg ?? 0) + (360 / el.count) * i) * Math.PI) / 180;
        ctx.beginPath();
        ctx.arc(el.x + Math.cos(a) * el.r, el.y + Math.sin(a) * el.r, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = el.accentEvery && i % el.accentEvery === 0 ? p.accent : p.muted;
        ctx.fill();
      }
      break;
    }
    case 'grid': {
      const cw = el.w / el.cols;
      const ch = el.h / el.rows;
      for (let c = 0; c <= el.cols; c++)
        pencilPath(
          ctx,
          [
            [el.x + c * cw, el.y],
            [el.x + c * cw, el.y + el.h],
          ],
          p.hairline,
          rand,
          false,
          1
        );
      for (let r = 0; r <= el.rows; r++)
        pencilPath(
          ctx,
          [
            [el.x, el.y + r * ch],
            [el.x + el.w, el.y + r * ch],
          ],
          p.hairline,
          rand,
          false,
          1
        );
      for (const [c, r] of el.accentCells ?? []) {
        ctx.fillStyle = p.accent;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(el.x + c * cw + cw * 0.22, el.y + r * ch + ch * 0.22, cw * 0.56, ch * 0.56);
        ctx.globalAlpha = 1;
      }
      break;
    }
    case 'dot': {
      ctx.beginPath();
      ctx.arc(el.x, el.y, el.r ?? 3.4, 0, Math.PI * 2);
      ctx.fillStyle = el.accent ? p.accent : p.muted;
      ctx.fill();
      break;
    }
    case 'measure': {
      pencilPath(ctx, [el.from, el.to], p.muted, rand, false, 1.1);
      const dx = el.to[0] - el.from[0];
      const dy = el.to[1] - el.from[1];
      const len = Math.hypot(dx, dy) || 1;
      const nx = (-dy / len) * 5;
      const ny = (dx / len) * 5;
      pencilPath(
        ctx,
        [
          [el.from[0] + nx, el.from[1] + ny],
          [el.from[0] - nx, el.from[1] - ny],
        ],
        p.muted,
        rand,
        false,
        1.1
      );
      pencilPath(
        ctx,
        [
          [el.to[0] + nx, el.to[1] + ny],
          [el.to[0] - nx, el.to[1] - ny],
        ],
        p.muted,
        rand,
        false,
        1.1
      );
      if (el.label)
        paintText(
          ctx,
          {
            x: (el.from[0] + el.to[0]) / 2,
            y: (el.from[1] + el.to[1]) / 2 - 12,
            content: el.label,
            size: 's',
            tone: 'muted',
            align: 'center',
          },
          p,
          lang
        );
      break;
    }
    case 'angle': {
      const pts: V2[] = [];
      const sweep = el.toDeg - el.fromDeg;
      for (let i = 0; i <= 60; i++) {
        const a = ((el.fromDeg + (sweep * i) / 60) * Math.PI) / 180;
        pts.push([el.x + Math.cos(a) * el.r, el.y + Math.sin(a) * el.r]);
      }
      pencilPath(ctx, pts, p.muted, rand);
      pencilPath(
        ctx,
        [
          [el.x, el.y],
          [
            el.x + Math.cos((el.fromDeg * Math.PI) / 180) * el.r * 1.35,
            el.y + Math.sin((el.fromDeg * Math.PI) / 180) * el.r * 1.35,
          ],
        ],
        p.muted,
        rand,
        false,
        1.1
      );
      pencilPath(
        ctx,
        [
          [el.x, el.y],
          [
            el.x + Math.cos((el.toDeg * Math.PI) / 180) * el.r * 1.35,
            el.y + Math.sin((el.toDeg * Math.PI) / 180) * el.r * 1.35,
          ],
        ],
        p.muted,
        rand,
        false,
        1.1
      );
      if (el.label) {
        const mid = ((el.fromDeg + el.toDeg) / 2) * (Math.PI / 180);
        paintText(
          ctx,
          {
            x: el.x + Math.cos(mid) * (el.r + 18),
            y: el.y + Math.sin(mid) * (el.r + 18),
            content: el.label,
            size: 's',
            tone: 'muted',
            align: 'center',
          },
          p,
          lang
        );
      }
      break;
    }
    case 'text':
      paintText(ctx, el, p, lang);
      break;
  }
}

/* ---------- spec loading ---------- */
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
