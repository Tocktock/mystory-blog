export const categories = {
  tech: {
    slug: 'tech',
    label: '기술',
    description: 'AI, Backend, Agent와 문제 해결에 대한 기록입니다.',
  },
  life: {
    slug: 'life',
    label: '일상',
    description: '살아가며 남기고 싶은 일상의 기록입니다.',
  },
  thought: {
    slug: 'thought',
    label: '생각',
    description: '몰입, 관찰, 배움에 대한 글입니다.',
  },
  project: {
    slug: 'project',
    label: '프로젝트',
    description: '만들고 실험한 것들을 기록합니다.',
  },
  cats: {
    slug: 'cats',
    label: '만냥구름',
    description: '만냥이와 구름이의 기록입니다.',
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
