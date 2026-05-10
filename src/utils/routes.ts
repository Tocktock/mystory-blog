export const routes = {
	home: '/',
	records: '/records',
	record: (id: string) => `/records/${id}/`,
	series: '/series',
	seriesDetail: (slug: string) => `/series/${slug}/`,
	manyangGureum: '/manyang-gureum',
	about: '/about',
	search: '/search',
	tags: '/tags',
	tag: (slug: string) => `/tags/${slug}/`,
} as const;
