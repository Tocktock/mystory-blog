export const PERSONA_AUDIT_ROUTES = [
  {
    name: 'home',
    route: '/',
    expectedStatus: 200,
    requiredText: ['지용의 기록실', 'AI와 Agent로 이것저것 만들어 본', '주제별로 보기'],
  },
  {
    name: 'records',
    route: '/records/',
    expectedStatus: 200,
    requiredText: ['기록', '글 종류', '생각 기록'],
  },
  {
    name: 'series',
    route: '/series/',
    expectedStatus: 200,
    requiredText: ['시리즈', '한 주제로 이어서 쓴 글', 'AI와 일하는 방식'],
  },
  {
    name: 'series-detail',
    route: '/series/ai-working-notes/',
    expectedStatus: 200,
    requiredText: ['AI와 일하는 방식', '모은 이유', '읽고 나면'],
  },
  {
    name: 'creations',
    route: '/creations/',
    expectedStatus: 200,
    requiredText: ['My Creations', 'AI로 만드는 노래', '열려라 별문'],
  },
  {
    name: 'record-detail-new',
    route: '/records/meta/ai-advisor-writing-partner/',
    expectedStatus: 200,
    requiredText: ['회사에서 AI Advisor로 보낸 3개월 회고', '글 종류', '생각 기록'],
  },
  {
    name: 'record-detail-legacy',
    route: '/records/kubernetes-on-mac/k3s-with-multipass/',
    expectedStatus: 200,
    requiredText: ['맥에서 쿠버네티스 k3s 환경설정하기', '분류'],
  },
  {
    name: 'about',
    route: '/about/',
    expectedStatus: 200,
    requiredText: ['몰입, 관찰, 그리고 배움', '제가 일하고 생각하는 방식'],
  },
  {
    name: 'career',
    route: '/career/',
    expectedStatus: 200,
    requiredText: ['제품과 운영 사이의 복잡한 흐름을 백엔드로 정리합니다', '대표 작업'],
  },
  {
    name: 'manyang',
    route: '/manyang-gureum/',
    expectedStatus: 200,
    requiredText: ['만냥구름', '돌보면서 배운 것'],
  },
  {
    name: 'search',
    route: '/search/?q=kubernetes',
    expectedStatus: 200,
    requiredText: ['기록 찾기', '검색어'],
  },
  {
    name: 'not-found',
    route: '/missing-record-drawer-for-i09/',
    expectedStatus: 404,
    requiredText: ['페이지를 찾을 수 없어요', '기록으로 돌아가기'],
  },
];

export const RESPONSIVE_WIDTHS = [360, 390, 430, 768, 1024, 1440];
