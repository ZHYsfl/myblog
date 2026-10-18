interface VinylProps {
  sizeClass: string;
  isPlaying: boolean;
}

export function Vinyl({ sizeClass, isPlaying }: VinylProps) {
  return (
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
}
