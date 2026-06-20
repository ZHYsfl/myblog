import type { CategoryId } from './constants';
import { CATEGORIES } from './constants';

export function formatDate(date: Date, locale: string = 'zh-CN'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function estimateReadingTime(text: string): number {
  const charsPerMinute = 500;
  const minutes = Math.ceil(text.length / charsPerMinute);
  return Math.max(1, minutes);
}

export function getCategoryMeta(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export function getCategoryName(id: CategoryId, lang: 'zh' | 'en' = 'zh'): string {
  return getCategoryMeta(id).name[lang];
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
