import { useEffect } from 'react';
import { useLang } from '@/lib/useLang';
import { Playlist } from '@/components/music/Playlist';
import { SITE } from '@/lib/constants';

export function MusicPage() {
  const [lang] = useLang();

  useEffect(() => {
    document.title = lang === 'en' ? `Music | ${SITE.authorEn}` : `音乐 | ${SITE.authorEn}`;
  }, [lang]);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-40 pt-32 sm:px-6 lg:px-8">
      <header className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          <span data-lang-block="zh">音乐</span>
          <span data-lang-block="en">Music</span>
        </h1>
        <p className="mx-auto max-w-md text-base leading-relaxed text-muted">
          <span data-lang-block="zh">
            唱歌是另一种记录方式。这里放着一些我唱过的歌，算是把某些心情留了下来。
          </span>
          <span data-lang-block="en">
            Singing is another way to keep a record. Here are some songs I&apos;ve sung, little
            snapshots of moods along the way.
          </span>
        </p>
      </header>
      <Playlist />
    </div>
  );
}
