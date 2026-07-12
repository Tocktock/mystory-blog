import type { ImageMetadata } from 'astro';

import dalWieseoCover from '../assets/creations/dal-wieseo.jpg';
import hanBakjaNeutgeCover from '../assets/creations/han-bakja-neutge.jpg';
import jeoHaneulWiroCover from '../assets/creations/jeo-haneul-wiro.jpg';
import lowMoonCover from '../assets/creations/low-moon.jpg';
import makeItGoldCover from '../assets/creations/make-it-gold.jpg';
import minsuJapianaCover from '../assets/creations/minsu-japiana.jpg';
import onBitWieCover from '../assets/creations/on-bit-wie.jpg';
import openStarGateCover from '../assets/creations/open-star-gate.jpg';
import starDoorOpenCover from '../assets/creations/star-door-open.jpg';
import unansweredLightCover from '../assets/creations/unanswered-light.jpg';
import { routes } from '../utils/routes';

export interface Creation {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: ImageMetadata;
  imageAlt: string;
  href: string;
  tags: readonly string[];
  relatedRecord?: string;
  featured?: boolean;
}

export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/channel/UC41i7l-rQ_VWZjxoLnKROIQ';

export const creations: readonly Creation[] = [
  {
    slug: 'on-bit-wie',
    title: '온 빛 위에',
    subtitle: 'Korean Dream-Noir Art Pop',
    description:
      '어두운 방 안으로 스며드는 빛을 차분한 시네마틱 사운드로 그렸습니다. 정밀한 가사 싱크와 절제된 화면 호흡에 집중했습니다.',
    image: onBitWieCover,
    imageAlt: '어두운 방의 열린 창과 흔들리는 커튼, 바닥에 비친 따뜻한 빛',
    href: 'https://www.youtube.com/watch?v=Ql_veOA1NjI',
    tags: ['AI Song', 'Dream Noir', 'Art Pop'],
  },
  {
    slug: 'han-bakja-neutge',
    title: '한 박자 늦게',
    subtitle: 'Korean Piano-Rock Ballad',
    description:
      '늦여름에 입사해 다음 여름이 오기 전 떠나는 동료를 위해 만든 헌정곡입니다. 자연스럽게 제 부사수 역할까지 맡아 고생한 시간과, 그 동료가 좋아하는 피아노 록 발라드의 취향을 담았습니다.',
    image: hanBakjaNeutgeCover,
    imageAlt: '노을 진 시골 버스 정류장에 멈춘 버스와 세워진 자전거',
    href: 'https://www.youtube.com/watch?v=IVLs6LoiBD0',
    tags: ['Tribute', 'Piano Rock', 'Farewell'],
  },
  {
    slug: 'low-moon',
    title: '낮은 달',
    subtitle: 'Korean-English Art Pop',
    description:
      '검은 물 위에 떠 있는 한 장의 사진처럼, 숨겨 둔 자아가 다시 떠오르는 순간을 어두운 아트 팝으로 만들었습니다.',
    image: lowMoonCover,
    imageAlt: '어두운 물 위에 떠 있는 달빛 아래 두 사람의 폴라로이드 사진',
    href: 'https://www.youtube.com/watch?v=sFNLXfQpl8s',
    tags: ['AI Song', 'Art Pop', 'Bilingual'],
  },
  {
    slug: 'dal-wieseo',
    title: '달 위에서',
    subtitle: 'Korean Cinematic Art Pop',
    description:
      '달 표면에 선 두 존재의 대화를 몽환적인 듀엣으로 풀었습니다. 넓은 달 풍경과 작은 가사가 함께 숨 쉬도록 구성했습니다.',
    image: dalWieseoCover,
    imageAlt: '달 표면 위에서 흰 드레스와 긴 리본을 펼친 인물',
    href: 'https://www.youtube.com/watch?v=VMu6o7G4hCo',
    tags: ['AI Song', 'Cinematic', 'Duet'],
  },
  {
    slug: 'minsu-japiana',
    title: '민수야 니 자피아나',
    subtitle: 'Korean Stadium Pop',
    description:
      '퇴사하는 동료 민수에게 보내는 유쾌한 헌정곡입니다. 무한도전의 ‘자피아나’ 드립을 ‘자, 이제 피어나’로 풀어낸 말에서 시작해, 마침 겹친 월드컵 시즌의 열기를 스타디움 팝으로 옮겼습니다.',
    image: minsuJapianaCover,
    imageAlt: '가족이 식탁에 둘러앉은 기하학적 일러스트 커버',
    href: 'https://www.youtube.com/watch?v=X-VoD0Ldbdk',
    tags: ['Tribute', 'Stadium Pop', 'Wordplay'],
  },
  {
    slug: 'jeo-haneul-wiro',
    title: '저 하늘 위로',
    subtitle: 'Korean Cinematic Synth-Pop',
    description:
      '도시 위로 솟아오르는 밝은 에너지를 네온 신스 팝으로 옮겼습니다. 빠른 훅과 선명한 색으로 상승감을 밀어 올립니다.',
    image: jeoHaneulWiroCover,
    imageAlt: '분홍빛 도시 상공에서 브이 포즈를 한 인물의 밝은 일러스트',
    href: 'https://www.youtube.com/watch?v=Krw0xILNC3M',
    tags: ['AI Song', 'Synth Pop', 'Neon'],
  },
  {
    slug: 'unanswered-light',
    title: '응답 없는 빛',
    subtitle: 'Korean Dark Ambient Art Pop',
    description:
      '물속에서 닿지 않는 신호를 기다리는 감정을 낮고 차가운 사운드로 만들었습니다. 끝까지 밀폐된 듯한 긴장을 유지합니다.',
    image: unansweredLightCover,
    imageAlt: '달빛 아래 물속에서 형태가 흩어지는 어두운 인물',
    href: 'https://www.youtube.com/watch?v=zlDLmzZeLcw',
    tags: ['AI Song', 'Dark Ambient', 'Art Pop'],
  },
  {
    slug: 'open-the-star-gate',
    title: '열려라 별문',
    subtitle: 'Korean Fantasy Orchestral Pop',
    description:
      '별빛과 문이 열리는 순간을 오케스트럴 팝으로 옮긴 작업입니다. 음악에서 커버, 가사 영상까지 하나의 세계로 연결했습니다.',
    image: openStarGateCover,
    imageAlt: '별빛 아래 은빛 머리 인물이 하늘을 올려다보는 열려라 별문 커버',
    href: 'https://www.youtube.com/watch?v=VYVHObQiZWk',
    tags: ['AI Song', 'Orchestral Pop', 'Lyric Video'],
    relatedRecord: routes.record('meta/ai-music-with-suno'),
    featured: true,
  },
  {
    slug: 'make-it-gold',
    title: 'Make it Gold',
    subtitle: 'Cinematic K-Pop',
    description:
      '압박과 두려움을 스스로의 빛으로 바꾸는 순간을 시네마틱 K-pop으로 만들었습니다. 비 내리는 도시에서 시작해 큰 후렴으로 번집니다.',
    image: makeItGoldCover,
    imageAlt: '비 내리는 푸른 도시에서 하늘을 올려다보는 검은 머리 인물',
    href: 'https://www.youtube.com/watch?v=O4nuR8ohA64',
    tags: ['AI Song', 'K-Pop', 'Anthem'],
  },
  {
    slug: 'star-door-open',
    title: '별의 문을 열어',
    subtitle: 'Anime-Cinematic Electro Rock',
    description:
      '별의 문을 향해 달려가는 판타지 장면을 빠른 오케스트럴 일렉트로 록으로 완성한 첫 공개 작업입니다.',
    image: starDoorOpenCover,
    imageAlt: '별이 빛나는 거대한 문 앞에 선 금발 인물과 빛의 계단',
    href: 'https://www.youtube.com/watch?v=eSa-MdztRMA',
    tags: ['AI Song', 'Electro Rock', 'Fantasy'],
  },
];
