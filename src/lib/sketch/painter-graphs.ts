import type { Element } from './types';
import { H, W, drawArrowHead, paintText, pencilPath, type Palette } from './painter';

export function paintGraph(
  ctx: CanvasRenderingContext2D,
  el: Element,
  p: Palette,
  rand: () => number,
  lang: 'zh' | 'en'
) {
  switch (el.type) {
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
      el.items.forEach((n) => {
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
  }
}
