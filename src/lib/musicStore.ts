import { useEffect, useSyncExternalStore } from 'react';
import songs from '@/data/songs.json';
import type { Song } from '@/types';

declare global {
  interface Window {
    __music?: {
      play: (index: number) => void;
      toggle: () => void;
      next: () => void;
      prev: () => void;
    };
  }
}

type PlayMode = 'order' | 'loop' | 'shuffle';

interface MusicState {
  currentIndex: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  mode: PlayMode;
}

const STORAGE_KEY = 'myblog-music';

const initialState: MusicState = {
  currentIndex: 0,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.8,
  mode: 'order',
};

function isBrowser() {
  return typeof window !== 'undefined';
}

function loadStoredState(): Partial<MusicState> {
  if (!isBrowser()) return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      currentIndex: Number.isFinite(parsed.currentIndex)
        ? parsed.currentIndex
        : initialState.currentIndex,
      progress: Number.isFinite(parsed.progress) ? parsed.progress : 0,
      volume: Number.isFinite(parsed.volume) ? parsed.volume : initialState.volume,
      mode: ['order', 'loop', 'shuffle'].includes(parsed.mode) ? parsed.mode : 'order',
    };
  } catch {
    return {};
  }
}

function saveState(state: MusicState) {
  if (!isBrowser()) return;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentIndex: state.currentIndex,
        progress: state.progress,
        volume: state.volume,
        mode: state.mode,
        isPlaying: state.isPlaying,
      })
    );
  } catch {
    // ignore
  }
}

class MusicStore {
  private state: MusicState;
  private audio: HTMLAudioElement | null = null;
  private listeners = new Set<() => void>();
  private currentBlobUrl: string | null = null;

  constructor() {
    const stored = loadStoredState();
    this.state = { ...initialState, ...stored };

    if (isBrowser()) {
      this.audio = (document.getElementById('global-audio') as HTMLAudioElement) || new Audio();
      this.audio.volume = this.state.volume;
      this.audio.preload = 'metadata';
      this.attachEvents();
      if (!this.audio.dataset.initialized) {
        this.restore();
        this.audio.dataset.initialized = 'true';
      }
      this.attachKeyboard();
    }
  }

  private attachKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === 'ArrowRight') {
        this.next();
      } else if (e.code === 'ArrowLeft') {
        this.prev();
      }
    });
  }

  private attachEvents() {
    const audio = this.audio;
    if (!audio) return;

    audio.addEventListener('timeupdate', () => {
      this.setState({ progress: audio.currentTime || 0 });
    });
    audio.addEventListener('loadedmetadata', () => {
      this.setState({ duration: audio.duration || 0 });
    });
    audio.addEventListener('ended', () => this.handleEnded());
    audio.addEventListener('play', () => this.setState({ isPlaying: true }));
    audio.addEventListener('pause', () => this.setState({ isPlaying: false }));
  }

  private restore() {
    if (!this.audio || this.state.currentIndex < 0 || this.state.currentIndex >= songs.length)
      return;
    this.audio.src = songs[this.state.currentIndex].file;
    this.audio.currentTime = this.state.progress;
    if (this.state.isPlaying) {
      this.audio.play().catch(() => this.setState({ isPlaying: false }));
    }
  }

  private emit() {
    this.listeners.forEach((listener) => listener());
  }

  private setState(partial: Partial<MusicState>) {
    this.state = { ...this.state, ...partial };
    this.emit();
  }

  private handleEnded() {
    if (this.state.mode === 'loop') {
      if (this.audio) {
        this.audio.currentTime = 0;
        this.audio.play().catch(() => this.setState({ isPlaying: false }));
      }
    } else {
      this.next();
    }
  }

  getSnapshot = (): MusicState => this.state;

  getServerSnapshot = (): MusicState => initialState;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  get currentSong(): Song | null {
    return songs[this.state.currentIndex] || null;
  }

  get songs(): Song[] {
    return songs;
  }

  togglePlay = () => {
    if (!this.audio) return;
    if (this.state.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch(() => this.setState({ isPlaying: false }));
    }
  };

  private loadSrc(index: number, play: boolean, startTime: number) {
    if (!this.audio) return;
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
    this.audio.src = songs[index].file;
    this.audio.currentTime = startTime;
    if (play) {
      this.audio.play().catch(() => this.setState({ isPlaying: false }));
    }
  }

  playIndex = (index: number) => {
    if (index < 0 || index >= songs.length || !this.audio) return;
    this.setState({ currentIndex: index, progress: 0 });
    this.loadSrc(index, true, 0);
  };

  next = () => {
    if (songs.length === 0 || !this.audio) return;
    let nextIndex: number;
    if (this.state.mode === 'shuffle') {
      nextIndex = Math.floor(Math.random() * songs.length);
      while (songs.length > 1 && nextIndex === this.state.currentIndex) {
        nextIndex = Math.floor(Math.random() * songs.length);
      }
    } else {
      nextIndex = (this.state.currentIndex + 1) % songs.length;
    }
    this.playIndex(nextIndex);
  };

  prev = () => {
    if (songs.length === 0 || !this.audio) return;
    const prevIndex = (this.state.currentIndex - 1 + songs.length) % songs.length;
    this.playIndex(prevIndex);
  };

  seek = (time: number) => {
    if (!this.audio) return;
    this.audio.currentTime = time;
    this.setState({ progress: time });
  };

  setVolume = (volume: number) => {
    this.setState({ volume });
    if (this.audio) this.audio.volume = volume;
    saveState(this.state);
  };

  cycleMode = () => {
    this.setState({
      mode: this.state.mode === 'order' ? 'loop' : this.state.mode === 'loop' ? 'shuffle' : 'order',
    });
    saveState(this.state);
  };

  save = () => saveState(this.state);
}

function getStore(): MusicStore {
  if (isBrowser()) {
    const win = window as unknown as { __musicStore?: MusicStore };
    if (win.__musicStore) return win.__musicStore;
    const instance = new MusicStore();
    win.__musicStore = instance;
    return instance;
  }
  return new MusicStore();
}

const store = getStore();

if (isBrowser()) {
  window.__music = {
    play: (index: number) => store.playIndex(index),
    toggle: () => store.togglePlay(),
    next: () => store.next(),
    prev: () => store.prev(),
  };
}

export function useMusic() {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  useEffect(() => {
    const onBeforeUnload = () => store.save();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  return {
    ...state,
    songs: store.songs,
    currentSong: store.currentSong,
    togglePlay: store.togglePlay,
    playIndex: store.playIndex,
    next: store.next,
    prev: store.prev,
    seek: store.seek,
    setVolume: store.setVolume,
    cycleMode: store.cycleMode,
  };
}
