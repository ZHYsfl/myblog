import fs from 'node:fs';
import path from 'node:path';

const SRC = 'mysong';
const OUT = 'public/songs';
const DATA = 'src/data';

interface Song {
  id: string;
  title: string;
  artist: string;
  originalArtist?: string;
  file: string;
}

function parseTitle(file: string): { title: string; originalArtist?: string } {
  const base = path.basename(file, path.extname(file));
  const withoutArtist = base.replace(/_周浩洋$/, '');
  const parts = withoutArtist.split('_');
  if (parts.length >= 2) {
    return { title: parts[0].replace(/-/g, ' '), originalArtist: parts[1] };
  }
  return { title: withoutArtist.replace(/-/g, ' ') };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
}

function main(): void {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(DATA, { recursive: true });

  // Clean up songs removed from source
  const srcFiles = new Set(fs.readdirSync(SRC));
  for (const file of fs.readdirSync(OUT)) {
    if (!srcFiles.has(file)) {
      fs.unlinkSync(path.join(OUT, file));
    }
  }

  const songs: Song[] = [];
  for (const file of fs.readdirSync(SRC)) {
    if (!file.endsWith('.m4a')) continue;
    const srcFile = path.join(SRC, file);
    const { title, originalArtist } = parseTitle(file);
    const id = slugify(title);
    const outFile = path.join(OUT, file);
    fs.copyFileSync(srcFile, outFile);
    songs.push({
      id,
      title,
      artist: '周浩洋',
      originalArtist,
      file: `/songs/${file}`,
    });
  }

  songs.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
  fs.writeFileSync(path.join(DATA, 'songs.json'), JSON.stringify(songs, null, 2), 'utf-8');
  // eslint-disable-next-line no-console
  console.log(`Prepared ${songs.length} songs.`);
}

main();
