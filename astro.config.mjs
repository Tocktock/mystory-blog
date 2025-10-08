// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // ...other Astro config

  site: 'https://ji-yong.com',
  integrations: [mdx(), sitemap()],
});
