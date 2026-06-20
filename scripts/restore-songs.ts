import fs from 'node:fs';
import path from 'node:path';

const OLD_SONGS = 'C:/Users/Zane/AppData/Local/Temp/old_norm2/songs';
const SRC = 'mysong';
const OUT = 'public/songs';

function main(): void {
  const current = new Set(fs.readdirSync(SRC));
  let copied = 0;
  for (const file of fs.readdirSync(OLD_SONGS)) {
    if (current.has(file)) continue;
    fs.copyFileSync(path.join(OLD_SONGS, file), path.join(SRC, file));
    fs.copyFileSync(path.join(OLD_SONGS, file), path.join(OUT, file));
    copied++;
  }
  console.log(`Restored ${copied} songs from old dist.`);
}

main();
