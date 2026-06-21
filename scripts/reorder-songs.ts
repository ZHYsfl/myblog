import fs from 'node:fs';

interface Song {
  id: string;
  title: string;
  artist: string;
  originalArtist?: string;
  file: string;
}

// Songs removed from the playlist entirely. Chinese titles are matched exactly;
// "Valentine's Day" is matched by prefix to avoid the curly-apostrophe character.
const DELETE_EXACT = new Set([
  '爱爱爱',
  '爱错',
  '爱无所不在',
  '爱在',
  '当你',
  '飞翔吧少年',
  '关于爱的定义',
  '就忘了吧',
  '起风了',
  '瞬',
  '心乱飞',
]);

function shouldDelete(s: Song): boolean {
  return DELETE_EXACT.has(s.title) || s.title.startsWith('Valentine');
}

// Pinned to the top, in this exact order. Everything else is shuffled.
const PIN_FIRST = '会长大的幸福';
const PIN_SECOND = 'Supermarket Flowers';

const songs = JSON.parse(fs.readFileSync('src/data/songs.json', 'utf8')) as Song[];

const removed = songs.filter(shouldDelete);
const kept = songs.filter((s) => !shouldDelete(s));

const first = kept.find((s) => s.title === PIN_FIRST);
const second = kept.find((s) => s.title === PIN_SECOND);
if (!first) throw new Error(`Pinned song not found: ${PIN_FIRST}`);
if (!second) throw new Error(`Pinned song not found: ${PIN_SECOND}`);

const rest = kept.filter((s) => s !== first && s !== second);

// Fisher–Yates shuffle of the remaining songs.
for (let i = rest.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [rest[i], rest[j]] = [rest[j], rest[i]];
}

const final = [first, second, ...rest];
fs.writeFileSync('src/data/songs.json', JSON.stringify(final, null, 2), 'utf8');

// eslint-disable-next-line no-console
console.log(`Removed ${removed.length}: ${removed.map((s) => s.title).join(', ')}`);
// eslint-disable-next-line no-console
console.log(`Kept ${final.length} songs. Top two: ${final[0].title}, ${final[1].title}`);
