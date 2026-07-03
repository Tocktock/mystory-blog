export const routes = {
  home: '/',
  records: '/records',
  record: (id: string) => `/records/${id}/`,
  series: '/series',
  seriesDetail: (slug: string) => `/series/${slug}/`,
  career: '/career',
  manyangGureum: '/manyang-gureum',
  about: '/about',
  search: '/search',
  tags: '/tags',
  tag: (slug: string) => `/tags/${encodeURIComponent(slug)}/`,
  category: (slug: string) => `/categories/${slug}/`,
} as const;
