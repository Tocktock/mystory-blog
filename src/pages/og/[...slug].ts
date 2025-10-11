import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import { SITE_DESCRIPTION } from '../../consts';

const collectionEntries = await getCollection('blog');

const pages = Object.fromEntries(
  collectionEntries.map((entry) => {
    const slug = entry.id;

    return [
      slug,
      {
        title: entry.data.title,
        description: entry.data.description ?? SITE_DESCRIPTION,
        lang: entry.data.lang ?? 'ko',
      },
    ];
  }),
);

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'slug',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    dir: page.lang === 'ar' || page.lang === 'he' ? 'rtl' : 'ltr',
    bgGradient: [
      [12, 18, 44],
      [48, 69, 141],
    ],
    border: {
      color: [255, 255, 255],
      width: 16,
      side: 'block-end',
    },
    font: {
      title: {
        size: 72,
        lineHeight: 80,
      },
      description: {
        size: 40,
        lineHeight: 46,
      },
    },
  }),
});
