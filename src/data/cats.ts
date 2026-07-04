import type { ImageMetadata } from 'astro';

import gureumProfileImage from '../assets/gallery/1.jpg';
import manyangProfileImage from '../assets/gallery/2.jpg';

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
    id: 'gureum',
    name: '구름이',
    role: '기록실의 조용한 관찰자',
    description: '이불 아래와 소파 위에서 작은 불편과 안정의 신호를 조용히 보여주는 고양이입니다.',
    personality: ['차분함', '느긋함', '작은 변화에 민감함'],
    likes: ['이불 아래', '편한 자리 차지하기', '조용한 돌봄'],
    image: gureumProfileImage,
    imageAlt: '분홍 이불 아래에서 앞발을 뻗고 쉬는 구름이',
  },
  {
    id: 'manyang',
    name: '만냥이',
    role: '기록실의 변화를 알려주는 동거인',
    description:
      '자리를 바꾸고 시선을 보내는 방식으로 지금 필요한 관심과 돌봄을 알려주는 고양이입니다.',
    personality: ['호기심 많음', '표현이 분명함', '관찰을 부르는 편'],
    likes: ['파란 이불', '분홍 이불', '관심 받는 낮잠'],
    image: manyangProfileImage,
    imageAlt: '파란 이불 위에 누워 카메라를 바라보는 만냥이',
  },
];

export const catMap = cats.reduce(
  (acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  },
  {} as Record<CatId, CatProfile>,
);
