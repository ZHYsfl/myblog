import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from 'lucide-react';
import { AudioCard } from './AudioCard';
import type { Song } from '@/types';

interface AudioPlayerProps {
  songs: Song[];
}

export function AudioPlayer({ songs }: AudioPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [loop, setLoop] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentIndex];

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  }, [isPlaying]);

  const playIndex = useCallback(
    (index: number) => {
      if (index === currentIndex && isPlaying) {
        togglePlay();
        return;
      }
      setCurrentIndex(index);
      setIsPlaying(true);
    },
    [currentIndex, isPlaying, togglePlay]
  );

  const next = useCallback(() => {
    if (shuffle) {
      setCurrentIndex(Math.floor(Math.random() * songs.length));
    } else {
      setCurrentIndex((i) => (i + 1) % songs.length);
    }
    setIsPlaying(true);
  }, [shuffle, songs.length]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  }, [songs.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        next();
      } else if (e.code === 'ArrowLeft') {
        prev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePlay, next, prev]);

  if (songs.length === 0) {
    return <p className="text-muted">暂无歌曲</p>;
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto max-w-3xl">
      <audio
        ref={audioRef}
        src={currentSong.file}
        loop={loop}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          const el = e.currentTarget;
          el.volume = volume;
          setDuration(el.duration || 0);
        }}
        onEnded={next}
      />

      <div className="mb-8 rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4">
          <p className="text-sm text-muted">正在播放</p>
          <h2 className="text-xl font-semibold text-fg">{currentSong.title}</h2>
          <p className="text-sm text-muted">
            {currentSong.artist}{' '}
            {currentSong.originalArtist && `· 原唱 ${currentSong.originalArtist}`}
          </p>
        </div>

        <div className="mb-4">
          <input
            type="range"
            min={0}
            max={duration || 1}
            value={progress}
            onChange={(e) => {
              const time = Number(e.target.value);
              if (audioRef.current) audioRef.current.currentTime = time;
              setProgress(time);
            }}
            className="w-full accent-accent"
            aria-label="播放进度"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShuffle((s) => !s)}
              aria-label="随机播放"
              className={`rounded-full p-2 ${shuffle ? 'text-accent' : 'text-muted'}`}
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={prev}
              aria-label="上一首"
              className="rounded-full p-2 text-muted hover:text-fg"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? '暂停' : '播放'}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="下一首"
              className="rounded-full p-2 text-muted hover:text-fg"
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setLoop((l) => !l)}
              aria-label="循环播放"
              className={`rounded-full p-2 ${loop ? 'text-accent' : 'text-muted'}`}
            >
              <Repeat className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                if (audioRef.current) audioRef.current.volume = v;
              }}
              className="w-24 accent-accent"
              aria-label="音量"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {songs.map((song, index) => (
          <AudioCard
            key={song.id}
            title={song.title}
            artist={song.artist}
            originalArtist={song.originalArtist}
            isPlaying={isPlaying}
            isCurrent={index === currentIndex}
            onClick={() => playIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
