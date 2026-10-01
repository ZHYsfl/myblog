import type { Element } from './types';
import { paintGraph } from './painter-graphs';
import { paintMark } from './painter-marks';
import { paintShape } from './painter-shapes';

export const W = 1000;
export const H = 380;

/* ---------- deterministic random ---------- */
export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Palette = { ink: string; muted: string; accent: string; hairline: string };

export function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  return {
    ink: cs.getPropertyValue('--fg').trim() || '#1c1c1a',
    muted: cs.getPropertyValue('--muted').trim() || '#6f6f6a',
    accent: cs.getPropertyValue('--accent').trim() || '#dc4c3a',
    hairline: cs.getPropertyValue('--border').trim() || '#e9e9e6',
  };
}

export function resolveText(t: string | { zh: string; en: string }, lang: 'zh' | 'en'): string {
  return typeof t === 'string' ? t : t[lang];
}

export function fontFor(size: 's' | 'm' | 'l'): string {
  const px = size === 'l' ? 22 : size === 'm' ? 17 : 13;
  return `${px}px Georgia, "Noto Serif SC", "Songti SC", serif`;
}

export function paintText(
  ctx: CanvasRenderingContext2D,
  el: {
    x: number;
    y: number;
    content: string | { zh: string; en: string };
    size?: 's' | 'm' | 'l';
    tone?: 'ink' | 'muted' | 'accent';
    align?: 'left' | 'center' | 'right';
  },
  p: Palette,
  lang: 'zh' | 'en'
) {
  ctx.font = fontFor(el.size ?? 'm');
  ctx.fillStyle = el.tone === 'accent' ? p.accent : el.tone === 'ink' ? p.ink : p.muted;
  ctx.textAlign = el.align ?? 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(resolveText(el.content, lang), el.x, el.y);
}

/** pencil double-stroke along points */
export function pencilPath(
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
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

export function catmullRom(pts: [number, number][], samples = 16): [number, number][] {
  if (pts.length < 3) return pts;
  const out: [number, number][] = [];
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

export function roughCircle(
  cx: number,
  cy: number,
  r: number,
  rand: () => number,
  wobble = 0.012
): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const w =
      Math.sin(a * 3 + rand() * 6) * r * wobble + Math.sin(a * 7 + rand() * 4) * r * wobble * 0.6;
    pts.push([cx + Math.cos(a) * (r + w), cy + Math.sin(a) * (r + w)]);
  }
  return pts;
}

export function drawArrowHead(
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  to: [number, number],
  color: string
) {
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

export function paintElement(
  ctx: CanvasRenderingContext2D,
  el: Element,
  p: Palette,
  rand: () => number,
  lang: 'zh' | 'en'
) {
  switch (el.type) {
    case 'nodes':
    case 'arrow':
    case 'axis':
    case 'bars':
      return paintGraph(ctx, el, p, rand, lang);
    case 'orbitDots':
    case 'grid':
    case 'dot':
    case 'measure':
    case 'angle':
    case 'text':
      return paintMark(ctx, el, p, rand, lang);
    default:
      return paintShape(ctx, el, p, rand, lang);
  }
}
