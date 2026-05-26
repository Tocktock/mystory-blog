import type { CollectionEntry } from 'astro:content';

export const sortSeriesPosts = (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => {
  const aOrder = a.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
};

export const sortSeriesPostsByLatest = (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => {
  const dateDiff = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

  if (dateDiff !== 0) {
    return dateDiff;
  }

  return sortSeriesPosts(a, b);
};
