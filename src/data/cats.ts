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
    role: '조용하고 느긋한 고양이',
    description: '이불 속이나 소파 위에 있는 걸 좋아하고, 작은 변화에도 금방 반응해요.',
    personality: ['차분함', '느긋함', '작은 변화에 민감함'],
    likes: ['이불 아래', '편한 자리 차지하기', '조용한 손길'],
    image: gureumProfileImage,
    imageAlt: '분홍 이불 아래에서 앞발을 뻗고 쉬는 구름이',
  },
  {
    id: 'manyang',
    name: '만냥이',
    role: '호기심 많고 표현이 확실한 고양이',
    description: '원하는 게 있으면 자리를 옮기거나 빤히 쳐다보면서 확실하게 알려 줘요.',
    personality: ['호기심 많음', '표현이 분명함'],
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
