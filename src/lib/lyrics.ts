export interface LyricChar {
  t: number;
  end: number;
  c: string;
}

export interface LyricLine {
  t: number;
  end: number;
  text: string;
  chars: LyricChar[];
}

export interface LyricsData {
  lines: LyricLine[];
}

const cache = new Map<string, LyricsData | null>();

export function lyricUrlForFile(file: string): string {
  const base = file
    .split('/')
    .pop()!
    .replace(/\.m4a$/, '');
  return `/lyrics/${encodeURIComponent(base)}.json`;
}

export async function fetchLyrics(file: string): Promise<LyricsData | null> {
  const hit = cache.get(file);
  if (hit !== undefined) return hit;
  try {
    const res = await fetch(lyricUrlForFile(file));
    if (!res.ok) {
      cache.set(file, null);
      return null;
    }
    const data = (await res.json()) as LyricsData;
    cache.set(file, data);
    return data;
  } catch {
    cache.set(file, null);
    return null;
  }
}

/** index of the line currently sung: last line whose start <= t (-1 before first line) */
export function activeLineIndex(lines: LyricLine[], t: number): number {
  let lo = 0;
  let hi = lines.length - 1;
  let ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (lines[mid].t <= t + 0.001) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}
