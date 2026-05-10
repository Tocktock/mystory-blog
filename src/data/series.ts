export const series = {
	'ai-agent-lab': {
		slug: 'ai-agent-lab',
		title: 'AI Agent 실험실',
		description: 'Agent를 만들고 실험하며 배운 것들',
		category: 'tech',
	},
	'backend-notes': {
		slug: 'backend-notes',
		title: 'Backend 설계 노트',
		description: '서버, 구조, 문제 해결에 대한 기록',
		category: 'tech',
	},
	'solve-again': {
		slug: 'solve-again',
		title: '문제를 다시 푸는 법',
		description: '삽질, 디버깅, 트러블슈팅 회고',
		category: 'thought',
	},
	'manyang-gureum-log': {
		slug: 'manyang-gureum-log',
		title: '만냥구름 관찰일지',
		description: '고양이와 함께 살며 배운 관찰의 기록',
		category: 'cats',
	},
} as const;

export type SeriesSlug = keyof typeof series;
export type SeriesEntry = (typeof series)[SeriesSlug];

export const seriesList = Object.values(series);

export const getSeries = (slug?: string): SeriesEntry | undefined => {
	if (!slug || !(slug in series)) {
		return undefined;
	}

	return series[slug as SeriesSlug];
};
