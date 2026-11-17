export const categories = {
  tech: {
    slug: 'tech',
    label: '기술',
    description: 'AI, 백엔드, Agent를 다루며 겪은 문제와 해결 과정을 적었어요.',
  },
  life: {
    slug: 'life',
    label: '일상',
    description: '남겨 두고 싶은 일상 이야기예요.',
  },
  thought: {
    slug: 'thought',
    label: '생각',
    description: '일하고 배우면서 든 생각을 적었어요.',
  },
  project: {
    slug: 'project',
    label: '프로젝트',
    description: '직접 만들어 보고 실험한 것들이에요.',
  },
  cats: {
    slug: 'cats',
    label: '만냥구름',
    description: '만냥이와 구름이 이야기예요.',
  },
} as const;

export type CategorySlug = keyof typeof categories;
export type Category = (typeof categories)[CategorySlug];

export const categoryList = Object.values(categories);

export const getCategory = (slug?: string): Category => {
  if (!slug || !(slug in categories)) {
    return categories.thought;
  }

  return categories[slug as CategorySlug];
};
