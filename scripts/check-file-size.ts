import fs from 'node:fs';
import path from 'node:path';

const MAX_LINES = 250;
const MAX_LINES_EXCEPTION = 600;
const MAX_EXCEPTION_FILES = 3;

const TARGET_DIRS = ['src/components', 'src/hooks', 'src/lib'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.astro']);

function walk(dir: string, callback: (file: string) => void): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, callback);
    } else if (entry.isFile() && EXTENSIONS.has(path.extname(entry.name))) {
      callback(full);
    }
  }
}

function countLines(file: string): number {
  return fs.readFileSync(file, 'utf-8').split(/\r?\n/).length;
}

function main(): void {
  const exceptions: { file: string; lines: number }[] = [];
  const violations: { file: string; lines: number }[] = [];

  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) continue;
    walk(dir, (file) => {
      const lines = countLines(file);
      if (lines > MAX_LINES_EXCEPTION) {
        violations.push({ file, lines });
      } else if (lines > MAX_LINES) {
        exceptions.push({ file, lines });
      }
    });
  }

  let exitCode = 0;

  if (violations.length > 0) {
    console.error('❌ Files exceeding absolute maximum lines:');
    for (const { file, lines } of violations) {
      console.error(`  ${file}: ${lines} lines (max ${MAX_LINES_EXCEPTION})`);
    }
    exitCode = 1;
  }

  if (exceptions.length > MAX_EXCEPTION_FILES) {
    console.error(`❌ Too many files exceed ${MAX_LINES} lines:`);
    for (const { file, lines } of exceptions) {
      console.error(`  ${file}: ${lines} lines (max ${MAX_LINES})`);
    }
    exitCode = 1;
  } else if (exceptions.length > 0) {
    console.warn(
      `⚠️ ${exceptions.length} file(s) exceed ${MAX_LINES} lines (allowed exceptions: ${MAX_EXCEPTION_FILES}):`
    );
    for (const { file, lines } of exceptions) {
      console.warn(`  ${file}: ${lines} lines`);
    }
  }

  if (exitCode === 0) {
    // eslint-disable-next-line no-console
    console.log('✅ File size check passed.');
  }

  process.exit(exitCode);
}

main();
