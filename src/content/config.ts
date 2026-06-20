import { defineCollection, z } from 'astro:content';
import { CATEGORY_IDS } from '@/lib/constants';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
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
