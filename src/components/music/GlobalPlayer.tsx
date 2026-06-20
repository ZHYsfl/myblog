import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat1,
  Repeat,
  Shuffle,
} from 'lucide-react';
import { useMusic } from '@/lib/musicStore';
import { useLang } from '@/lib/useLang';

export function GlobalPlayer() {
  const {
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

  if (!currentSong) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const modeIcon =
    mode === 'loop' ? (
      <Repeat1 className="h-4 w-4" />
    ) : mode === 'shuffle' ? (
      <Shuffle className="h-4 w-4" />
    ) : (
      <Repeat className="h-4 w-4" />
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

  const artist = lang === 'en' ? 'HaoYang Zhou' : currentSong.artist;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="hidden w-48 sm:block">
          <p className="truncate text-sm font-medium text-fg">{currentSong.title}</p>
          <p className="truncate text-xs text-muted">
            {artist}
            {currentSong.originalArtist && ` · ${currentSong.originalArtist}`}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label={lang === 'en' ? 'Previous' : '上一首'}
              className="text-muted transition-colors hover:text-fg"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={
                isPlaying ? (lang === 'en' ? 'Pause' : '暂停') : lang === 'en' ? 'Play' : '播放'
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-fg text-bg transition-transform hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={lang === 'en' ? 'Next' : '下一首'}
              className="text-muted transition-colors hover:text-fg"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
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
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={cycleMode}
            aria-label={modeLabel}
            title={modeLabel}
            className={`rounded-full p-2 transition-colors ${
              mode === 'order' ? 'text-muted hover:text-fg' : 'text-accent'
            }`}
          >
            {modeIcon}
          </button>
          <div className="hidden items-center gap-2 sm:flex">
            <Volume2 className="h-4 w-4 text-muted" />
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
  );
}
