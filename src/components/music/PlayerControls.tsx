import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import type { PlayMode } from '@/lib/musicPersistence';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface PlayerControlsProps {
  progress: number;
  duration: number;
  isPlaying: boolean;
  mode: PlayMode;
  volume: number;
  lang: string;
  seek: (time: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (volume: number) => void;
  cycleMode: () => void;
}

export function PlayerControls({
  progress,
  duration,
  isPlaying,
  mode,
  volume,
  lang,
  seek,
  togglePlay,
  next,
  prev,
  setVolume,
  cycleMode,
}: PlayerControlsProps) {
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

  return (
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
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
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
  );
}
