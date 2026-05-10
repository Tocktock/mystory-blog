import type { ImageMetadata } from 'astro';

import type { CatId } from './cats';

import galleryImage1 from '../assets/gallery/1.jpg';
import galleryImage2 from '../assets/gallery/2.jpg';
import galleryImage3 from '../assets/gallery/3.jpg';
import galleryImage4 from '../assets/gallery/4.jpg';
import galleryImage5 from '../assets/gallery/5.jpg';
import galleryImage6 from '../assets/gallery/6.jpg';

export type CatMood = 'nap' | 'window' | 'play' | 'desk' | 'together';

export const catMoodLabels: Record<CatMood, string> = {
	nap: '낮잠',
	window: '창밖 관찰',
	play: '장난',
	desk: '책상 점령',
	together: '함께 있는 순간',
};

export interface CatPhoto {
	image: ImageMetadata;
	alt: string;
	caption: string;
	cats: CatId[];
	mood: CatMood;
	featured?: boolean;
}

export const catPhotos: CatPhoto[] = [
	{
		image: galleryImage1,
		alt: 'Cat lounging near a window with soft lighting.',
		caption: '창가 근처에서 조용히 시간을 보내는 만냥이.',
		cats: ['manyang'],
		mood: 'window',
		featured: true,
	},
	{
		image: galleryImage2,
		alt: 'Curious cat peeking through a fence.',
		caption: '틈 사이로 세상을 살피는 구름이.',
		cats: ['gureum'],
		mood: 'window',
	},
	{
		image: galleryImage3,
		alt: 'Playful kitten reaching for a toy.',
		caption: '장난감을 향해 손을 뻗는 순간.',
		cats: ['gureum'],
		mood: 'play',
	},
	{
		image: galleryImage4,
		alt: 'Cat resting comfortably on a blanket.',
		caption: '기록실의 가장 편한 자리를 찾아낸 만냥이.',
		cats: ['manyang'],
		mood: 'nap',
	},
	{
		image: galleryImage5,
		alt: 'Two cats sharing a quiet moment together.',
		caption: '둘이 함께 조용한 시간을 나누는 장면.',
		cats: ['manyang', 'gureum'],
		mood: 'together',
	},
	{
		image: galleryImage6,
		alt: 'Cat gazing outside with bright eyes.',
		caption: '밖을 바라보며 무언가를 관찰하는 눈빛.',
		cats: ['manyang'],
		mood: 'desk',
	},
];
