import type { CollectionEntry } from 'astro:content';

type BlogPostData = CollectionEntry<'blog'>['data'];

export const getPostHeroImageAlt = (
  post: Pick<BlogPostData, 'heroImage' | 'heroImageAlt' | 'title'>,
) => (post.heroImage ? (post.heroImageAlt ?? `${post.title} 대표 이미지`) : '');
