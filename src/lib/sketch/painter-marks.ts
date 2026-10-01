import type { Element, V2 } from './types';
import { paintText, pencilPath, type Palette } from './painter';

export function paintMark(
  ctx: CanvasRenderingContext2D,
  el: Element,
  p: Palette,
  rand: () => number,
  lang: 'zh' | 'en'
) {
  switch (el.type) {
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
