import { useEffect, useRef, useState, type TouchEvent } from 'react';
import {
  ChevronDown,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import { useMusic } from '@/lib/musicStore';
import { useLang } from '@/lib/useLang';
import { activeLineIndex, fetchLyrics, type LyricsData } from '@/lib/lyrics';

const EXIT_MS = 320;
const UNSUNG = 'color-mix(in srgb, var(--muted) 55%, transparent)';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function NowPlaying() {
  const {
    expanded,
    collapse,
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    mode,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    cycleMode,
  } = useMusic();
  const [lang] = useLang();

  // mount → slide up; collapse → slide down then unmount
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (expanded) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(raf);
    }
    setOpen(false);
    const t = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [expanded]);

  // lock page scroll while open
  useEffect(() => {
    if (!mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted]);

  // Esc to collapse
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') collapse();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mounted, collapse]);

  // lyrics, lazy per song
  const file = currentSong?.file ?? '';
  const [lyrics, setLyrics] = useState<LyricsData | null>(null);
  const [lyricsLoaded, setLyricsLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    setLyrics(null);
    setLyricsLoaded(false);
    if (file) {
      fetchLyrics(file).then((data) => {
        if (!alive) return;
        setLyrics(data);
        setLyricsLoaded(true);
      });
    }
    return () => {
      alive = false;
    };
  }, [file]);

  // active line + auto-center scroll (paused briefly after manual scroll)
  const idx = lyrics ? activeLineIndex(lyrics.lines, progress) : -1;
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const manualUntil = useRef(0);
  useEffect(() => {
    if (idx < 0 || Date.now() < manualUntil.current) return;
    lineRefs.current[idx]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [idx]);

  // pull-down to collapse
  const sheetRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startY: 0, dy: 0, active: false });
  const onTouchStart = (e: TouchEvent) => {
    if ((e.target as HTMLElement).closest('.np-lyrics, button, input')) return;
    drag.current = { startY: e.touches[0].clientY, dy: 0, active: true };
  };
  const onTouchMove = (e: TouchEvent) => {
    if (!drag.current.active) return;
    const dy = Math.max(0, e.touches[0].clientY - drag.current.startY);
    drag.current.dy = dy;
    const sheet = sheetRef.current;
    if (sheet) {
      sheet.style.transition = 'none';
      sheet.style.transform = `translateY(${dy}px)`;
    }
  };
  const onTouchEnd = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const sheet = sheetRef.current;
    if (drag.current.dy > 110) {
      if (sheet) sheet.style.transition = '';
      collapse();
      return;
    }
    if (sheet) {
      sheet.style.transition = '';
      sheet.style.transform = '';
    }
  };

  if (!mounted || !currentSong) return null;

  const artist = lang === 'en' ? 'HaoYang Zhou' : currentSong.artist;
  const modeIcon =
    mode === 'loop' ? (
      <Repeat1 className="h-5 w-5" />
    ) : mode === 'shuffle' ? (
      <Shuffle className="h-5 w-5" />
    ) : (
      <Repeat className="h-5 w-5" />
    );
  const modeLabel =
    mode === 'loop'
      ? lang === 'en'
        ? 'Loop'
        : '单曲循环'
      : mode === 'shuffle'
        ? lang === 'en'
          ? 'Shuffle'
          : '随机播放'
        : lang === 'en'
          ? 'Order'
          : '顺序播放';

  const vinyl = (sizeClass: string) => (
    <div
      className={`np-vinyl ${isPlaying ? '' : 'paused'} relative ${sizeClass} shrink-0 rounded-full border border-border`}
      style={{
        background:
          'repeating-radial-gradient(circle at center, var(--surface) 0px, var(--surface) 2px, var(--border) 3px, var(--surface) 4px)',
      }}
    >
      <div className="absolute inset-0 m-auto flex h-[38%] w-[38%] items-center justify-center rounded-full border border-border bg-bg">
        <span className="h-2 w-2 rounded-full bg-accent" />
      </div>
    </div>
  );

  return (
    <div
      ref={sheetRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`fixed inset-0 z-[60] flex flex-col bg-bg transition-transform duration-300 ease-out ${
        open ? 'translate-y-0' : 'translate-y-full'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'en' ? 'Now playing' : '正在播放'}
    >
      {/* header */}
      <div className="flex items-center justify-between px-4 pt-4 sm:px-8 sm:pt-6">
        <button
          type="button"
          onClick={collapse}
          aria-label={lang === 'en' ? 'Collapse' : '收起'}
          className="rounded-full p-1 text-muted transition-colors hover:text-fg"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted">
          {lang === 'en' ? 'Now Playing' : '正在播放'}
        </p>
        <span className="w-8" />
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-6 sm:px-10">
        {/* mobile song header */}
        <div className="flex items-center gap-4 py-5 sm:hidden">
          {vinyl('h-14 w-14')}
          <div className="min-w-0">
            <p className="truncate font-serif text-xl font-semibold text-fg">{currentSong.title}</p>
            <p className="truncate text-sm text-muted">
              {artist}
              {currentSong.originalArtist && ` · 原唱 ${currentSong.originalArtist}`}
            </p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col sm:flex-row sm:gap-14 lg:gap-20">
          {/* desktop vinyl + title */}
          <div className="hidden w-2/5 flex-col items-center justify-center gap-9 sm:flex">
            {vinyl('h-64 w-64 lg:h-80 lg:w-80')}
            <div className="text-center">
              <p className="font-serif text-3xl font-semibold text-fg">{currentSong.title}</p>
              <p className="mt-2 text-sm text-muted">
                {artist}
                {currentSong.originalArtist && ` · 原唱 ${currentSong.originalArtist}`}
              </p>
            </div>
          </div>

          {/* lyrics */}
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
              const active = i === idx;
              const passed = i < idx;
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
        </div>

        {/* controls */}
        <div className="mx-auto w-full max-w-xl pb-8 pt-4 sm:pb-10">
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="w-10 text-right">{formatTime(progress)}</span>
            <input
              type="range"
              min={0}
              max={duration || 1}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-border"
              style={{ accentColor: 'var(--fg)' }}
              aria-label={lang === 'en' ? 'Progress' : '播放进度'}
            />
            <span className="w-10">{formatTime(duration)}</span>
          </div>
          <div className="mt-5 flex items-center justify-center gap-7">
            <button
              type="button"
              onClick={cycleMode}
              aria-label={modeLabel}
              title={modeLabel}
              className={`rounded-full p-1 transition-colors ${
                mode === 'order' ? 'text-muted hover:text-fg' : 'text-accent'
              }`}
            >
              {modeIcon}
            </button>
            <button
              type="button"
              onClick={prev}
              aria-label={lang === 'en' ? 'Previous' : '上一首'}
              className="text-muted transition-colors hover:text-fg"
            >
              <SkipBack className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={
                isPlaying ? (lang === 'en' ? 'Pause' : '暂停') : lang === 'en' ? 'Play' : '播放'
              }
              className="flex h-14 w-14 items-center justify-center rounded-full bg-fg text-bg transition-transform hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 fill-current" />
              )}
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={lang === 'en' ? 'Next' : '下一首'}
              className="text-muted transition-colors hover:text-fg"
            >
              <SkipForward className="h-6 w-6" />
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <Volume2 className="h-5 w-5 text-muted" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-border"
                style={{ accentColor: 'var(--fg)' }}
                aria-label={lang === 'en' ? 'Volume' : '音量'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
