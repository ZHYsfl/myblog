import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@content': path.resolve(__dirname, './src/content'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // Long-term goal is >95%; current threshold is a pragmatic floor for the
      // bootstrap phase while Astro pages and WebGL/R3F islands are covered via
      // Playwright E2E rather than unit tests.
      thresholds: {
        statements: 43,
        branches: 57,
        functions: 60,
        lines: 43,
      },
      exclude: [
        'node_modules/',
        'dist/',
        '.astro/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.mjs',
        'scripts/',
        'playwright.config.ts',
        // Astro pages and interactive/WebGL islands are better covered by E2E tests.
        'src/pages/**/*.astro',
        'src/layouts/**/*.astro',
        'src/components/**/*.astro',
        'src/components/home/**/*.tsx',
        'src/components/about/**/*.tsx',
        'src/components/music/**/*.tsx',
        'src/lib/musicStore.ts',
        'src/lib/useTheme.ts',
        'src/types/**/*.ts',
      ],
    },
  },
});
