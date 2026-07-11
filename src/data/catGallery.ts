import type { ImageMetadata } from 'astro';

import type { CatId } from './cats';

import galleryImage1 from '../assets/gallery/1.jpg';
import galleryImage2 from '../assets/gallery/2.jpg';
import galleryImage3 from '../assets/gallery/3.jpg';
import galleryImage4 from '../assets/gallery/4.jpg';
import galleryImage5 from '../assets/gallery/5.jpg';
import galleryImage6 from '../assets/gallery/6.jpg';

export type CatMood = 'blanket' | 'nap' | 'stretch' | 'together';

export const catMoodLabels: Record<CatMood, string> = {
  blanket: '이불 위 시간',
  nap: '낮잠',
  stretch: '앞발 쭉',
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
    alt: '분홍 이불 아래에서 앞발을 뻗고 엎드려 있는 회색 고양이.',
    caption: '분홍 이불 아래에서 앞발을 쭉 뻗은 구름이.',
    cats: ['gureum'],
    mood: 'stretch',
    featured: true,
  },
  {
    image: galleryImage2,
    alt: '파란 이불 위에 누워 카메라를 바라보는 삼색 고양이.',
    caption: '파란 이불 위에서 카메라를 바라보는 만냥이.',
    cats: ['manyang'],
    mood: 'blanket',
  },
  {
    image: galleryImage3,
    alt: '분홍 이불 위에서 몸을 웅크리고 쉬는 삼색 고양이.',
    caption: '분홍 이불 위에서 조용히 쉬는 만냥이.',
    cats: ['manyang'],
    mood: 'nap',
  },
  {
    image: galleryImage4,
    alt: '분홍 이불 위에서 눈을 감고 쉬는 삼색 고양이.',
    caption: '분홍 이불 위에서 잠깐 눈을 붙인 만냥이.',
    cats: ['manyang'],
    mood: 'nap',
  },
  {
    image: galleryImage5,
    alt: '소파 위에서 회색 고양이는 앞쪽에, 삼색 고양이는 뒤쪽에 함께 쉬는 모습.',
    caption: '소파 위에서 나란히 쉬는 구름이와 만냥이.',
    cats: ['gureum', 'manyang'],
    mood: 'together',
  },
  {
    image: galleryImage6,
    alt: '회색 고양이가 눈을 감고 쉬고 뒤쪽에 삼색 고양이가 함께 있는 모습.',
    caption: '구름이가 눈을 감고 쉬는 동안 만냥이도 뒤쪽에 함께 머문 장면.',
    cats: ['gureum', 'manyang'],
    mood: 'together',
  },
];
