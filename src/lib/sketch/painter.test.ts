import { describe, expect, it } from 'vitest';
import { hashSeed, mulberry32, paintElement, pencilPath, catmullRom, resolveText } from './painter';
import type { Element } from './types';

/** Recording no-op 2D context: every method is a spy, every property settable. */
function mockCtx() {
  const calls: { name: string; args: unknown[] }[] = [];
  const store: Record<string | symbol, unknown> = {};
  const ctx = new Proxy(store, {
    get(t, prop) {
      if (typeof prop !== 'string') return undefined;
      if (!(prop in t)) {
        t[prop] = (...args: unknown[]) => calls.push({ name: prop, args });
      }
      return t[prop];
    },
    set(t, prop, value) {
      t[prop] = value;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
  return { ctx, calls };
}

const palette = { ink: '#111', muted: '#888', accent: '#f00', hairline: '#eee' };
const rand = mulberry32(42);
const count = (calls: { name: string }[], name: string) =>
  calls.filter((c) => c.name === name).length;

describe('sketch helpers', () => {
  it('hashSeed is deterministic and differs per input', () => {
    expect(hashSeed('abc')).toBe(hashSeed('abc'));
    expect(hashSeed('abc')).not.toBe(hashSeed('abd'));
  });

  it('mulberry32 returns stable values in [0, 1)', () => {
    const r1 = mulberry32(7);
    const r2 = mulberry32(7);
    for (let i = 0; i < 10; i++) {
      const v = r1();
      expect(v).toBe(r2());
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('resolveText picks the requested language', () => {
    expect(resolveText({ zh: '中文', en: 'English' }, 'zh')).toBe('中文');
    expect(resolveText({ zh: '中文', en: 'English' }, 'en')).toBe('English');
    expect(resolveText('plain', 'zh')).toBe('plain');
  });

  it('catmullRom keeps endpoints and interpolates between', () => {
    const pts: [number, number][] = [
      [0, 0],
      [100, 100],
      [200, 0],
    ];
    const out = catmullRom(pts, 8);
    expect(out[0]).toEqual([0, 0]);
    expect(out[out.length - 1]).toEqual([200, 0]);
    expect(out.length).toBeGreaterThan(pts.length);
  });

  it('pencilPath strokes twice (double pass)', () => {
    const { ctx, calls } = mockCtx();
    pencilPath(
      ctx,
      [
        [0, 0],
        [10, 10],
      ],
      '#111',
      mulberry32(1)
    );
    expect(count(calls, 'stroke')).toBe(2);
  });
});

describe('paintElement dispatcher', () => {
  const cases: Element[] = [
    { type: 'rings', cx: 500, cy: 190, radii: [80, 140] },
    { type: 'circle', x: 500, y: 190, r: 60 },
    {
      type: 'path',
      points: [
        [0, 0],
        [100, 50],
      ],
    },
    {
      type: 'curve',
      points: [
        [0, 300],
        [300, 80],
        [600, 250],
      ],
    },
    {
      type: 'nodes',
      items: [
        { x: 10, y: 10 },
        { x: 90, y: 90 },
      ],
      edges: [[0, 1]],
    },
    { type: 'arrow', from: [10, 300], to: [500, 80] },
    { type: 'axis', y: 320, from: 60, to: 940, ticks: 3 },
    { type: 'axis', x: 100, from: 40, to: 340, ticks: 2 },
    { type: 'bars', x: 100, y: 320, w: 400, h: 150, values: [0.3, 0.9] },
    { type: 'wave', x: 60, y: 190, w: 600, h: 160, cycles: 4 },
    { type: 'wave', x: 60, y: 190, w: 600, h: 160, points: [0.2, 1, 0.5] },
    { type: 'spiral', x: 500, y: 190, r0: 8, r1: 110, turns: 3 },
    { type: 'orbitDots', x: 500, y: 190, r: 120, count: 6, accentEvery: 2 },
    { type: 'grid', x: 100, y: 60, w: 300, h: 200, cols: 3, rows: 2, accentCells: [[1, 1]] },
    { type: 'dot', x: 500, y: 190, accent: true },
    { type: 'measure', from: [100, 330], to: [500, 330] },
    { type: 'angle', x: 500, y: 190, r: 60, fromDeg: -160, toDeg: -40 },
    { type: 'text', x: 10, y: 20, content: { zh: '你好', en: 'hello' } },
  ];

  it.each(cases.map((el, i) => [i, el] as const))(
    'renders element %i without throwing',
    (_, el) => {
      const { ctx } = mockCtx();
      expect(() => paintElement(ctx, el, palette, rand, 'zh')).not.toThrow();
    }
  );

  it('renders node labels and edges', () => {
    const { ctx, calls } = mockCtx();
    paintElement(
      ctx,
      {
        type: 'nodes',
        items: [
          { x: 10, y: 10, label: { zh: '甲', en: 'A' } },
          { x: 90, y: 90, accent: true },
        ],
        edges: [[0, 1]],
        edgeAccent: [1],
      },
      palette,
      rand,
      'zh'
    );
    expect(count(calls, 'fill')).toBeGreaterThanOrEqual(2);
    expect(count(calls, 'stroke')).toBeGreaterThan(0);
    const textCall = calls.find((c) => c.name === 'fillText');
    expect(textCall?.args[0]).toBe('甲');
  });

  it('renders arrowheads on both ends when both is set', () => {
    const { ctx, calls } = mockCtx();
    paintElement(
      ctx,
      { type: 'arrow', from: [0, 0], to: [100, 0], both: true },
      palette,
      rand,
      'zh'
    );
    expect(count(calls, 'moveTo')).toBeGreaterThanOrEqual(4);
  });

  it('renders bar labels and accent bars', () => {
    const { ctx, calls } = mockCtx();
    paintElement(
      ctx,
      {
        type: 'bars',
        x: 100,
        y: 320,
        w: 200,
        h: 100,
        values: [0.5, 1],
        labels: [
          { zh: '低', en: 'lo' },
          { zh: '高', en: 'hi' },
        ],
        accentIndex: 1,
      },
      palette,
      rand,
      'en'
    );
    const texts = calls.filter((c) => c.name === 'fillText').map((c) => c.args[0]);
    expect(texts).toContain('lo');
    expect(texts).toContain('hi');
  });

  it('renders axis tick labels', () => {
    const { ctx, calls } = mockCtx();
    paintElement(
      ctx,
      {
        type: 'axis',
        y: 320,
        from: 60,
        to: 940,
        ticks: 2,
        labels: [{ zh: '起', en: 'start' }, 'mid', { zh: '终', en: 'end' }],
      },
      palette,
      rand,
      'zh'
    );
    const texts = calls.filter((c) => c.name === 'fillText').map((c) => c.args[0]);
    expect(texts).toEqual(['起', 'mid', '终']);
  });

  it('renders ring labels at the given angle', () => {
    const { ctx, calls } = mockCtx();
    paintElement(
      ctx,
      {
        type: 'rings',
        cx: 500,
        cy: 190,
        radii: [100],
        labels: [{ r: 100, text: { zh: '顶', en: 'top' }, angle: -90 }],
      },
      palette,
      rand,
      'en'
    );
    const texts = calls.filter((c) => c.name === 'fillText').map((c) => c.args[0]);
    expect(texts).toContain('top');
  });
});
