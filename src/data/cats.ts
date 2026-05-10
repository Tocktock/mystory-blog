import type { ImageMetadata } from 'astro';

import manyangProfileImage from '../assets/gallery/1.jpg';
import gureumProfileImage from '../assets/gallery/2.jpg';

export type CatId = 'manyang' | 'gureum';

export interface CatProfile {
	id: CatId;
	name: string;
	role: string;
	description: string;
	personality: string[];
	likes: string[];
	image: ImageMetadata;
	imageAlt: string;
}

export const cats: CatProfile[] = [
	{
		id: 'manyang',
		name: '만냥이',
		role: '기록실의 조용한 관찰자',
		description:
			'이불 아래와 소파 위에 자리를 잡고, 기록실의 분위기를 천천히 바꾸는 고양이입니다.',
		personality: ['차분함', '느긋함', '관찰형'],
		likes: ['이불 아래', '편한 자리 차지하기', '조용한 시간'],
		image: manyangProfileImage,
		imageAlt: '분홍 이불 아래에서 앞발을 뻗고 쉬는 만냥이',
	},
	{
		id: 'gureum',
		name: '구름이',
		role: '기록실 곳곳을 누비는 작은 마스코트',
		description:
			'이불 위에 편하게 누워 있다가도 카메라를 또렷하게 바라보며 기록실에 생동감을 더해주는 고양이입니다.',
		personality: ['호기심 많음', '느긋함', '시선 집중형'],
		likes: ['파란 이불', '분홍 이불', '편한 낮잠'],
		image: gureumProfileImage,
		imageAlt: '파란 이불 위에 누워 카메라를 바라보는 구름이',
	},
];

export const catMap = cats.reduce(
	(acc, cat) => {
		acc[cat.id] = cat;
		return acc;
	},
	{} as Record<CatId, CatProfile>,
);
