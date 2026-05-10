import type { ImageMetadata } from 'astro';

import manyangProfileImage from '../assets/gallery/1.jpg';
import gureumProfileImage from '../assets/gallery/5.jpg';

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
			'조용히 자리를 차지하고, 창밖을 오래 바라보고, 기록실의 분위기를 천천히 바꾸는 고양이입니다.',
		personality: ['차분함', '섬세함', '관찰형'],
		likes: ['창밖 보기', '편한 자리 차지하기', '조용한 시간'],
		image: manyangProfileImage,
		imageAlt: '창가 근처에서 편하게 쉬고 있는 만냥이',
	},
	{
		id: 'gureum',
		name: '구름이',
		role: '기록실 곳곳을 누비는 작은 마스코트',
		description:
			'궁금한 곳을 먼저 살피고, 책상 근처를 맴돌고, 기록실에 생동감을 더해주는 고양이입니다.',
		personality: ['호기심 많음', '장난기', '집사 감시형'],
		likes: ['책상 근처', '장난감', '집사 방해하기'],
		image: gureumProfileImage,
		imageAlt: '기록실 근처에서 구름이와 만냥이가 함께 쉬는 모습',
	},
];

export const catMap = cats.reduce(
	(acc, cat) => {
		acc[cat.id] = cat;
		return acc;
	},
	{} as Record<CatId, CatProfile>,
);
