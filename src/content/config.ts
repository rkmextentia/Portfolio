import { defineCollection, z } from 'astro:content';

const postSchema = z.object({
  title: z.string(),
  date: z.date(),
  summary: z.string(),
  category: z.enum(['AI Governance', 'Enterprise GRC', 'Corporate Training', 'Regulatory Alerts']),
  tags: z.array(z.string()),
  youtubeUrl: z.string().optional(),
  image: z.string().optional(),
  readTime: z.string().default('4 min read'),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  author: z.string().default('RKMIDIGILABS'),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: postSchema,
});

export const collections = {
  blog: blogCollection,
};