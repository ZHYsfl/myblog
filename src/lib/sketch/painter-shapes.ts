import type { Element } from './types';
import { H, W, catmullRom, paintText, pencilPath, roughCircle, type Palette } from './painter';

export function paintShape(
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
      const pts: [number, number][] = [];
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
    case 'wave': {
      const pts: [number, number][] = [];
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
      const pts: [number, number][] = [];
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
  }
}
