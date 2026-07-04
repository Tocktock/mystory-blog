import type { CategorySlug } from '../data/categories';
import placeholder2 from '../assets/placeholders/blog-placeholder-2.jpg';
import placeholder3 from '../assets/placeholders/blog-placeholder-3.jpg';
import placeholder4 from '../assets/placeholders/blog-placeholder-4.jpg';
import placeholder5 from '../assets/placeholders/blog-placeholder-5.jpg';

const categoryCoverImages = {
  tech: placeholder2,
  life: placeholder3,
  thought: placeholder4,
  project: placeholder5,
  cats: placeholder3,
} as const satisfies Record<CategorySlug, typeof placeholder2>;

export const getCategoryCoverImage = (category?: string) => {
  if (category && category in categoryCoverImages) {
    return categoryCoverImages[category as CategorySlug];
  }

  return categoryCoverImages.thought;
};
