import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: isGitHubPages ? 'https://rkmextentia.github.io' : 'https://portfolio-one-gamma-qdcgxg6rsj.vercel.app',
  base: isGitHubPages ? '/RKMIDIGILABS' : '/',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});