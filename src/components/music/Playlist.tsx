import { useMusic } from '@/lib/musicStore';
import { Play, Pause, Music } from 'lucide-react';
import { useLang } from '@/lib/useLang';

export function Playlist() {
  const { songs, currentIndex, isPlaying, playIndex, togglePlay } = useMusic();
  const [lang] = useLang();

  return (
    <div className="space-y-2">
      {songs.map((song, index) => {
        const isCurrent = index === currentIndex;
        const active = isCurrent && isPlaying;
        return (
          <button
            key={`${index}-${song.title}`}
            type="button"
            data-play-index={index}
            onClick={() => (isCurrent ? togglePlay() : playIndex(index))}
            className={`group flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition-all ${
              isCurrent
                ? 'border-accent/30 bg-accent/[0.04]'
                : 'border-border bg-transparent hover:border-muted hover:bg-surface'
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                isCurrent ? 'bg-accent text-white' : 'bg-border/60 text-muted group-hover:text-fg'
              }`}
            >
              {active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`truncate font-medium ${isCurrent ? 'text-accent' : 'text-fg'}`}>
                {song.title}
              </p>
              <p className="truncate text-xs text-muted">
                {lang === 'en' ? 'HaoYang Zhou' : song.artist}{' '}
                {song.originalArtist && (
                  <span>
                    · {lang === 'zh' ? '原唱' : 'Original'} {song.originalArtist}
                  </span>
                )}
              </p>
            </div>
            {isCurrent && (
              <div className="flex items-end gap-0.5">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-0.5 animate-pulse rounded-full bg-accent"
                    style={{
                      height: `${6 + i * 4}px`,
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </button>
        );
      })}
      {songs.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-muted">
          <Music className="h-10 w-10" />
          <p>{lang === 'zh' ? '暂无歌曲' : 'No songs yet'}</p>
        </div>
      )}
    </div>
  );
}
