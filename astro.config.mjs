// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { existsSync, readFileSync } from 'node:fs';

/*
  vitesse-black suits the near-black reading surface, but a few of its token colours
  (comments, delimiters, quote punctuation, type names) fall below WCAG AA 4.5:1 on
  the #0a0d0f code panel. Remap just those to brighter tones of the same hue.
*/
const codeColorReplacements = {
  '#758575dd': '#879787',
  '#444444': '#8a9398',
  '#c98a7d77': '#c98a7d',
  '#b8a96577': '#b8a965',
  '#6872ab': '#8690c4',
};

/** @type {import('shiki').ShikiTransformer} */
const raiseLowContrastCodeColors = {
  name: 'observatory-code-contrast',
  span(node) {
    const style = node.properties?.style;
    if (typeof style !== 'string') return;
    node.properties.style = style.replace(/#[0-9a-f]{3,8}\b/gi, (color) => {
      return (
        codeColorReplacements[
          /** @type {keyof typeof codeColorReplacements} */ (color.toLowerCase())
        ] ?? color
      );
    });
  },
};

/*
  The sitemap reads each page's built HTML so the page stays the single source of truth:
  pages marked `noindex` (site search, one-post tags) are left out, and posts get `lastmod`
  from their `article:modified_time`. It runs after every page is written to `dist/`.
*/
const outDir = new URL('./dist/', import.meta.url);

/** @param {import('@astrojs/sitemap').SitemapItem} item */
function serializeSitemapItem(item) {
  const { pathname } = new URL(item.url);
  const htmlFile = new URL(`.${decodeURIComponent(pathname)}index.html`, outDir);
  if (!existsSync(htmlFile)) return item;

  const html = readFileSync(htmlFile, 'utf8');
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) return undefined;

  const modified = html.match(/<meta property="article:modified_time" content="([^"]+)"/);
  return modified ? { ...item, lastmod: modified[1] } : item;
}

// https://astro.build/config
export default defineConfig({
  site: 'https://ji-yong.com',
  integrations: [mdx(), sitemap({ serialize: serializeSitemapItem })],
  markdown: {
    shikiConfig: {
      theme: 'vitesse-black',
      transformers: [raiseLowContrastCodeColors],
    },
  },
});
