import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog')).filter(p => p.data.published !== false);
  const baseUrl = context.site?.toString().replace(/\/$/, '') || 'https://rkmidigilabs.vercel.app';

  const staticPages = [
    '',
    '/courses/',
    '/courses/iso-42001-lead-implementer-masterclass/',
    '/courses/eu-ai-act-technical-compliance-risk-assessment/',
    '/courses/nist-ai-rmf-generative-ai-governance/',
    '/company-profile/',
    '/services/',
    '/frameworks/',
    '/about/',
    '/contact/',
    '/blog/',
  ];

  const postUrls = posts.map(p => `/blog/${p.slug}/`);
  const allUrls = [...staticPages, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${baseUrl}${url}</loc>
    <changefreq>${url === '' || url.startsWith('/courses') ? 'daily' : 'weekly'}</changefreq>
    <priority>${url === '' ? '1.0' : url.startsWith('/courses') ? '0.95' : url.startsWith('/blog/') ? '0.85' : '0.9'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}