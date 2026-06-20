import { describe, it, expect } from 'vitest';
import { formatDate, estimateReadingTime, slugify, cn, getCategoryName } from './utils';
import { CATEGORIES } from './constants';

describe('formatDate', () => {
  it('formats date in Chinese by default', () => {
    const date = new Date('2026-06-01');
    expect(formatDate(date)).toContain('2026');
    expect(formatDate(date)).toContain('6');
  });

  it('formats date in English when locale is en', () => {
    const date = new Date('2026-06-01');
    const formatted = formatDate(date, 'en-US');
    expect(formatted).toContain('2026');
  });
});

describe('estimateReadingTime', () => {
  it('returns at least 1 minute', () => {
    expect(estimateReadingTime('')).toBe(1);
  });

  it('estimates based on 500 chars per minute', () => {
    const text = 'a'.repeat(1000);
    expect(estimateReadingTime(text)).toBe(2);
  });
});

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('Hello, World! 2026')).toBe('hello-world-2026');
  });
});

describe('cn', () => {
  it('joins truthy classes', () => {
    const shouldInclude = false;
    expect(cn('a', 'b', shouldInclude && 'c', null, 'd')).toBe('a b d');
  });
});

describe('getCategoryName', () => {
  it('returns Chinese name by default', () => {
    expect(getCategoryName('ai-infra')).toBe(CATEGORIES[0].name.zh);
  });

  it('returns English name when requested', () => {
    expect(getCategoryName('ai-infra', 'en')).toBe(CATEGORIES[0].name.en);
  });
});
