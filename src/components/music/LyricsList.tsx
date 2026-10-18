import { useEffect, useRef } from 'react';
import type { LyricsData } from '@/lib/lyrics';

const UNSUNG = 'color-mix(in srgb, var(--muted) 55%, transparent)';

interface LyricsListProps {
  lyrics: LyricsData | null;
  lyricsLoaded: boolean;
  activeIndex: number;
  progress: number;
  lang: string;
  seek: (time: number) => void;
}

export function LyricsList({
  lyrics,
  lyricsLoaded,
  activeIndex,
  progress,
  lang,
  seek,
}: LyricsListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const manualUntil = useRef(0);

  // auto-center the active line (paused briefly after manual scroll)
  useEffect(() => {
    if (activeIndex < 0 || Date.now() < manualUntil.current) return;
    lineRefs.current[activeIndex]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [activeIndex]);

  return (
    <div
      ref={scrollRef}
      onScroll={() => {
        manualUntil.current = Date.now() + 2600;
      }}
      className="np-lyrics np-lyrics-mask min-h-0 flex-1 overflow-y-auto py-8 [scrollbar-width:none] sm:py-24 [&::-webkit-scrollbar]:hidden"
    >
      {!lyricsLoaded && (
        <p className="py-20 text-center text-sm text-muted">
          {lang === 'en' ? 'Loading lyrics…' : '歌词加载中…'}
        </p>
      )}
      {lyricsLoaded && !lyrics && (
        <p className="py-20 text-center text-sm text-muted">
          {lang === 'en' ? 'No lyrics for this one yet.' : '这首歌暂时没有歌词。'}
        </p>
      )}
      {lyrics?.lines.map((line, i) => {
        const active = i === activeIndex;
        const passed = i < activeIndex;
        return (
          <button
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            type="button"
            onClick={() => seek(line.t + 0.01)}
            className={`block w-full cursor-pointer rounded px-2 py-2 text-left font-serif transition-all duration-300 ${
              active
                ? 'text-xl font-semibold leading-relaxed sm:text-2xl'
                : 'text-base leading-relaxed sm:text-lg'
            }`}
            style={{
              color: active
                ? 'var(--fg)'
                : passed
                  ? 'color-mix(in srgb, var(--muted) 75%, transparent)'
                  : UNSUNG,
            }}
          >
            {active && line.chars?.length
              ? line.chars.map((ch, j) => (
                  <span
                    key={j}
                    className="np-char"
                    style={{ color: progress >= ch.t - 0.06 ? 'var(--fg)' : UNSUNG }}
                  >
                    {ch.c}
                  </span>
                ))
              : line.text}
          </button>
        );
      })}
    </div>
  );
}
