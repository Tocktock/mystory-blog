// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

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

// https://astro.build/config
export default defineConfig({
  site: 'https://ji-yong.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'vitesse-black',
      transformers: [raiseLowContrastCodeColors],
    },
  },
});
