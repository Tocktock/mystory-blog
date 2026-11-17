import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import { SITE_DESCRIPTION, SITE_TITLE } from '../../consts';

// Midnight Observatory share cards: serif text over the deep-field backdrop rendered by
// scripts/create_observatory_art.mjs (which also draws the bottom kicker and rule).
// The font comes from the installed Fontsource package, so builds need no network fetch.
// CanvasKit reports this subset under its source instance name, "Noto Serif KR ExtraLight".
const FONT_FILE =
  './node_modules/@fontsource/noto-serif-kr/files/noto-serif-kr-korean-500-normal.woff';
const FONT_FAMILY = 'Noto Serif KR ExtraLight';

// Emoji are not in the font and would render as empty boxes.
const stripUnsupported = (text: string) =>
  text
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

// Rough visual width: Hangul and Han glyphs are about twice as wide as Latin ones.
const charWidth = (char: string) => (/[\p{Script=Hangul}\p{Script=Han}]/u.test(char) ? 2 : 1);
const visualWidth = (text: string) =>
  Array.from(text).reduce((sum, char) => sum + charWidth(char), 0);

const truncate = (text: string, maxWidth: number) => {
  let used = 0;
  const kept: string[] = [];
  for (const char of Array.from(text)) {
    used += charWidth(char);
    if (used > maxWidth) return `${kept.join('').trimEnd()}…`;
    kept.push(char);
  }
  return text;
};

// CanvasKit breaks Hangul between any two syllables; word joiners keep words whole (CSS keep-all).
const keepAll = (text: string) =>
  text.replace(/(?<=\p{Script=Hangul})(?=\S)|(?<=\S)(?=\p{Script=Hangul})/gu, '\u2060');

// Width budgets keep the title to three lines and the description to two above the footer rule.
const TITLE_MAX = 110;
const TITLE_LARGE_MAX = 70;
const DESCRIPTION_MAX = 136;

type OgPage = { title: string; description: string };

const posts = await getCollection('blog');

const pages: Record<string, OgPage> = {
  site: { title: SITE_TITLE, description: SITE_DESCRIPTION },
  ...Object.fromEntries(
    posts.map((entry) => [
      entry.id,
      { title: entry.data.title, description: entry.data.description ?? SITE_DESCRIPTION },
    ]),
  ),
};

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page: OgPage) => {
    const title = truncate(stripUnsupported(page.title), TITLE_MAX);
    const description = truncate(stripUnsupported(page.description), DESCRIPTION_MAX);
    return {
      title: keepAll(title),
      description: keepAll(description),
      bgGradient: [[2, 3, 4]],
      bgImage: { path: './src/assets/observatory/og-background.jpg', fit: 'cover' },
      padding: 72,
      fonts: [FONT_FILE],
      font: {
        title: {
          families: [FONT_FAMILY],
          size: visualWidth(title) > TITLE_LARGE_MAX ? 50 : 58,
          lineHeight: 1.4,
          color: [232, 232, 230],
        },
        description: {
          families: [FONT_FAMILY],
          size: 28,
          lineHeight: 1.7,
          color: [154, 163, 168],
        },
      },
    };
  },
});
