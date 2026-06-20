import type { CategoryId, Language } from '@/lib/constants';

export interface PostFrontmatter {
  title: string;
  date: Date;
  category: CategoryId;
  tags?: string[];
  lang: Language;
  slug: string;
  translationOf?: string;
  readingTime?: number;
  description?: string;
  cover?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  date: Date;
  category: CategoryId;
  tags: string[];
  lang: Language;
  translationOf?: string;
  readingTime: number;
  description: string;
  cover?: string;
  body: string;
  assetDir?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  originalArtist?: string;
  file: string;
  duration?: number;
}

export interface CategoryMeta {
  id: CategoryId;
  name: { zh: string; en: string };
  color: string;
  description: { zh: string; en: string };
}

export interface NavItem {
  href: string;
  label: { zh: string; en: string };
}
