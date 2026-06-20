import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Song } from '@/types';

type PlayMode = 'order' | 'loop' | 'shuffle';

interface MusicState {
  songs: Song[];
  currentIndex: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  mode: PlayMode;
}

interface MusicContextValue extends MusicState {
  currentSong: Song | null;
  togglePlay: () => void;
  playIndex: (index: number) => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  cycleMode: () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}

interface MusicProviderProps {
  songs: Song[];
  children: ReactNode;
}

export function MusicProvider({ songs, children }: MusicProviderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [mode, setMode] = useState<PlayMode>('order');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentIndex] || null;

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    setIsPlaying((p) => !p);
  }, []);

  const playIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= songs.length) return;
      setCurrentIndex(index);
      setIsPlaying(true);
    },
    [songs.length]
  );

  const next = useCallback(() => {
    if (songs.length === 0) return;
    setCurrentIndex((i) => {
      if (mode === 'shuffle') {
        let nextIdx = Math.floor(Math.random() * songs.length);
        while (songs.length > 1 && nextIdx === i) {
          nextIdx = Math.floor(Math.random() * songs.length);
        }
        return nextIdx;
      }
      return (i + 1) % songs.length;
    });
    setIsPlaying(true);
  }, [mode, songs.length]);

  const prev = useCallback(() => {
    if (songs.length === 0) return;
    setCurrentIndex((i) => (i - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  }, [songs.length]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setProgress(time);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const cycleMode = useCallback(() => {
    setMode((m) => (m === 'order' ? 'loop' : m === 'loop' ? 'shuffle' : 'order'));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
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

  const handleEnded = useCallback(() => {
    if (mode === 'loop' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      next();
    }
  }, [mode, next]);

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentIndex,
        isPlaying,
        progress,
        duration,
        volume,
        mode,
        currentSong,
        togglePlay,
        playIndex,
        next,
        prev,
        seek,
        setVolume,
        cycleMode,
      }}
    >
      {children}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.file}
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
          onEnded={handleEnded}
        />
      )}
    </MusicContext.Provider>
  );
}
