import { Play, Pause } from 'lucide-react';

interface AudioCardProps {
  title: string;
  artist: string;
  originalArtist?: string;
  isPlaying: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

export function AudioCard({
  title,
  artist,
  originalArtist,
  isPlaying,
  isCurrent,
  onClick,
}: AudioCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all hover:shadow-md ${
        isCurrent ? 'border-accent bg-accent/5' : 'border-border bg-surface hover:border-accent/30'
      }`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
          isCurrent ? 'bg-accent text-white' : 'bg-border text-muted group-hover:text-fg'
        }`}
      >
        {isPlaying && isCurrent ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-medium ${isCurrent ? 'text-accent' : 'text-fg'}`}>{title}</p>
        <p className="truncate text-sm text-muted">
          {artist} {originalArtist && `· 原唱 ${originalArtist}`}
        </p>
      </div>
    </button>
  );
}
