import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { CATEGORY_IDS } from './lib/constants';

const postsCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: 'src/content/posts',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(CATEGORY_IDS as [string, ...string[]]),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['zh', 'en']),
    slug: z.string(),
    translationOf: z.string().optional(),
    readingTime: z.number().int().positive().optional(),
    description: z.string().optional(),
    cover: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
