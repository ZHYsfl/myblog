export type V2 = [number, number];

export interface TextSpec {
  x: number;
  y: number;
  content: string | { zh: string; en: string };
  size?: 's' | 'm' | 'l';
  tone?: 'ink' | 'muted' | 'accent';
  align?: 'left' | 'center' | 'right';
}

export type Element =
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

export interface SketchSpec {
  /** multiple plates allowed; legacy single-plate { elements } also accepted */
  plates?: Plate[];
  elements?: Element[];
}

export interface Plate {
  /** 'top' (default, right under the post header) | 'end' (after the article) */
  placement?: 'top' | 'end';
  /** mid-article: insert after the first h2 whose text contains this substring */
  after?: string;
  elements: Element[];
}
