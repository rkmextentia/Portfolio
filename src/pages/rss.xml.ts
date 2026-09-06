import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog')).filter(p => p.data.published !== false);
  const sortedPosts = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'RKMIDIGILABS — AI Governance & GRC Blog',
    description: 'Daily analysis and video breakdowns on EU AI Act, NIST AI RMF, ISO 42001, and Enterprise GRC by RKMIDIGILABS.',
    site: context.site || 'https://rkmidigilabs.vercel.app',
    items: sortedPosts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/blog/${post.slug}/`,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: `<language>en-us</language>`,
  });
}