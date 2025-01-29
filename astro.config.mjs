// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // ...other Astro config

  site: 'https://ji-yong.com',
  integrations: [mdx(), sitemap()],
  vite: {
    // If you’re using a virtual import, you could inject UTTERANCES_CONFIG
    plugins: [
      {
        name: 'inject-utterances-config',
        resolveId(id) {
          if (id === 'virtual:astro/config') {
            return id;
          }
        },
        load(id) {
          if (id === 'virtual:astro/config') {
            return `
              export const UTTERANCES_CONFIG = {
                repo: 'Tocktock/mystory-blog',
                issueTerm: 'title',  // or 'url', 'title', etc.
                label: 'comments',      // label that Utterances adds to issues
                theme: 'github-light'   // or 'github-dark', etc.
              };
            `;
          }
        },
      },
    ],
  },
});
