export type PlayMode = 'order' | 'loop' | 'shuffle';

export interface MusicState {
  currentIndex: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  mode: PlayMode;
  expanded: boolean;
}

const STORAGE_KEY = 'myblog-music';

export const initialState: MusicState = {
  currentIndex: 0,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.8,
  mode: 'order',
  expanded: false,
};

export function isBrowser() {
  return typeof window !== 'undefined';
}

export function loadStoredState(): Partial<MusicState> {
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

export function saveState(state: MusicState) {
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
