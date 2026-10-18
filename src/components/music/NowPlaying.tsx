import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import { useMusic } from '@/lib/musicStore';
import { useLang } from '@/lib/useLang';
import { activeLineIndex, fetchLyrics, type LyricsData } from '@/lib/lyrics';
import { Vinyl } from '@/components/music/Vinyl';
import { LyricsList } from '@/components/music/LyricsList';
import { PlayerControls } from '@/components/music/PlayerControls';

const EXIT_MS = 320;

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

  const idx = lyrics ? activeLineIndex(lyrics.lines, progress) : -1;

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
  const titleBlock = (
    <>
      <p className="truncate font-serif text-xl font-semibold text-fg sm:text-center sm:text-3xl">
        {currentSong.title}
      </p>
      <p className="truncate text-sm text-muted sm:mt-2">
        {artist}
        {currentSong.originalArtist && ` · 原唱 ${currentSong.originalArtist}`}
      </p>
    </>
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
          <Vinyl sizeClass="h-14 w-14" isPlaying={isPlaying} />
          <div className="min-w-0">{titleBlock}</div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col sm:flex-row sm:gap-14 lg:gap-20">
          {/* desktop vinyl + title */}
          <div className="hidden w-2/5 flex-col items-center justify-center gap-9 sm:flex">
            <Vinyl sizeClass="h-64 w-64 lg:h-80 lg:w-80" isPlaying={isPlaying} />
            {titleBlock}
          </div>

          <LyricsList
            lyrics={lyrics}
            lyricsLoaded={lyricsLoaded}
            activeIndex={idx}
            progress={progress}
            lang={lang}
            seek={seek}
          />
        </div>

        <PlayerControls
          progress={progress}
          duration={duration}
          isPlaying={isPlaying}
          mode={mode}
          volume={volume}
          lang={lang}
          seek={seek}
          togglePlay={togglePlay}
          next={next}
          prev={prev}
          setVolume={setVolume}
          cycleMode={cycleMode}
        />
      </div>
    </div>
  );
}
