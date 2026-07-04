export const PERSONA_AUDIT_ROUTES = [
  {
    name: 'home',
    route: '/',
    expectedStatus: 200,
    requiredText: ['지용의 기록실', 'Backend와 AI Agent 실험', '기록실 책장'],
  },
  {
    name: 'records',
    route: '/records/',
    expectedStatus: 200,
    requiredText: ['기록', '기록 갈래', '생각 기록'],
  },
  {
    name: 'series',
    route: '/series/',
    expectedStatus: 200,
    requiredText: ['시리즈', '기록실 책장', 'AI와 일하는 방식'],
  },
  {
    name: 'series-detail',
    route: '/series/ai-working-notes/',
    expectedStatus: 200,
    requiredText: ['AI와 일하는 방식', '이 선반의 목적', '읽는 길'],
  },
  {
    name: 'record-detail-new',
    route: '/records/meta/ai-advisor-writing-partner/',
    expectedStatus: 200,
    requiredText: ['회사에서 AI Advisor로 보낸 3개월 회고', '기록 갈래', '생각 기록'],
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
    requiredText: ['몰입, 관찰, 그리고 배움', '내가 문제를 보고, 풀고, 다시 기록하는 방식'],
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
    requiredText: ['만냥구름', '관찰과 돌봄으로 남긴 기준'],
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
    requiredText: ['비어 있는 서랍입니다', '기록으로 돌아가기'],
  },
];

export const RESPONSIVE_WIDTHS = [360, 390, 430, 768, 1024, 1440];
