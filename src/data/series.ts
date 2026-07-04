import type { CategorySlug } from './categories';

export type SeriesStatus = 'planned' | 'active' | 'resting' | 'complete';

export type SeriesDefinition = {
  slug: string;
  title: string;
  description: string;
  category: CategorySlug;
  purpose?: string;
  status?: SeriesStatus;
  readingPromise?: string;
};

export const seriesStatusLabels = {
  planned: '계획 중',
  active: '진행 중',
  resting: '잠시 보관',
  complete: '정리됨',
} as const satisfies Record<SeriesStatus, string>;

export const series = {
  'ai-working-notes': {
    slug: 'ai-working-notes',
    title: 'AI와 일하는 방식',
    description: 'AI를 업무와 개발문화 속에서 어떻게 다룰지 고민한 기록',
    category: 'thought',
    purpose:
      'AI를 도구가 아니라 일하는 방식의 변화로 관찰하며, 팀과 개인이 무엇을 책임져야 하는지 남기는 선반입니다.',
    status: 'active',
    readingPromise:
      'AI Advisor 경험에서 창작 실험까지, AI를 쓰는 사람의 판단 기준을 따라 읽을 수 있습니다.',
  },
  'ai-agent-lab': {
    slug: 'ai-agent-lab',
    title: 'AI Agent 실험실',
    description: 'Agent를 만들고 실험하며 배운 것들',
    category: 'tech',
    purpose:
      'Agent를 만들어보며 자동화가 실제 업무 흐름에 들어올 때 생기는 가능성과 한계를 검증하는 선반입니다.',
    status: 'active',
    readingPromise: '실험의 목표, 구현 감각, 실패 지점을 함께 볼 수 있습니다.',
  },
  'backend-notes': {
    slug: 'backend-notes',
    title: 'Backend 설계 노트',
    description: '서버, 구조, 문제 해결에 대한 기록',
    category: 'tech',
    purpose:
      '서버 문제를 증상, 구조, 결정으로 나눠 다음 문제 앞에서 바로 꺼내보는 기술 선반입니다.',
    status: 'active',
    readingPromise: 'Node.js와 백엔드 설계 기록을 문제 해결 관점으로 연결해 읽습니다.',
  },
  'nestjs-blog': {
    slug: 'nestjs-blog',
    title: 'NestJS 블로그 만들기',
    description: 'NestJS로 블로그 API를 만들며 정리한 백엔드 학습 기록',
    category: 'tech',
    purpose:
      'NestJS 블로그 API를 만들며 백엔드 기본기를 실제 코드 흐름으로 확인한 학습 선반입니다.',
    status: 'complete',
    readingPromise: '요구사항에서 모듈, DB, CRUD, 테스트까지 API가 자라는 순서를 따라갑니다.',
  },
  'react-redux': {
    slug: 'react-redux',
    title: 'react-redux',
    description: 'React와 Redux 상태 관리를 공부하며 정리한 기록',
    category: 'tech',
    purpose: '상태 관리 개념을 직접 손에 익히며 프론트 흐름을 백엔드 시야로 이해한 선반입니다.',
    status: 'resting',
    readingPromise: 'React 상태가 어디에서 생기고 어떻게 전달되는지 기본 구조를 다시 확인합니다.',
  },
  algorithms: {
    slug: 'algorithms',
    title: 'Algorithms',
    description: '알고리즘 문제를 풀며 정리한 접근과 풀이 기록',
    category: 'tech',
    purpose: '문제를 다시 풀 때 떠올릴 접근과 실수 패턴을 축적하는 선반입니다.',
    status: 'active',
    readingPromise: '풀이보다 먼저 조건을 쪼개고 선택지를 좁히는 사고 흐름을 봅니다.',
  },
  'spring-backend-notes': {
    slug: 'spring-backend-notes',
    title: 'Spring Backend 노트',
    description: 'Spring 기반 백엔드 개발에서 마주한 문제와 해결 기록',
    category: 'tech',
    purpose: 'Spring에서 만난 요청, 검증, 연동 문제를 실제 증상 중심으로 정리한 선반입니다.',
    status: 'complete',
    readingPromise: '검증과 외부 연동처럼 운영에서 자주 부딪히는 백엔드 문제를 빠르게 복기합니다.',
  },
  'spring-persistence': {
    slug: 'spring-persistence',
    title: 'Spring Persistence 정리',
    description: 'Spring의 영속성 계층과 데이터 접근 방식을 정리한 기록',
    category: 'tech',
    purpose: '영속성 계층을 데이터 흐름과 경계 관점으로 정리한 선반입니다.',
    status: 'complete',
    readingPromise: '데이터 접근 방식이 코드 구조와 책임 분리에 어떤 영향을 주는지 따라갑니다.',
  },
  'mysql-to-postgres': {
    slug: 'mysql-to-postgres',
    title: 'MySQL에서 PostgreSQL로',
    description: 'MySQL과 PostgreSQL을 비교하고 마이그레이션 과정을 정리한 기록',
    category: 'tech',
    purpose: 'MySQL과 PostgreSQL의 차이를 직접 비교하고 이전 판단 기준을 남긴 선반입니다.',
    status: 'complete',
    readingPromise: '비교, 도구 선택, 실제 이전 과정에서 확인해야 할 지점을 순서대로 봅니다.',
  },
  'kotlin-notes': {
    slug: 'kotlin-notes',
    title: 'Kotlin 노트',
    description: 'Kotlin 문법과 사용 경험을 정리한 짧은 기술 기록',
    category: 'tech',
    purpose: 'Kotlin 문법과 사용감을 Java/Spring 배경 위에 얹어보며 확인한 선반입니다.',
    status: 'resting',
    readingPromise: '작은 문법 차이가 일상적인 코드 판단에 어떤 느낌을 주는지 확인합니다.',
  },
  'kotlin-mapper-lab': {
    slug: 'kotlin-mapper-lab',
    title: 'Kotlin Mapper 실험실',
    description: 'Kotlin으로 객체 변환과 매핑 구조를 실험하며 남긴 기록',
    category: 'project',
    purpose:
      '객체 변환과 매핑 구조를 Kotlin으로 실험하며 반복 코드를 줄이는 방법을 찾은 선반입니다.',
    status: 'complete',
    readingPromise: '리플렉션과 변환 로직을 어디까지 자동화할 수 있는지 실험 흐름을 따라갑니다.',
  },
  'devops-lab': {
    slug: 'devops-lab',
    title: 'DevOps 실험실',
    description: '로컬 Kubernetes와 운영 환경을 실험하며 남긴 기록',
    category: 'tech',
    purpose: '로컬 Kubernetes와 운영 환경을 직접 만져 배포와 운영 감각을 쌓는 선반입니다.',
    status: 'active',
    readingPromise: '개발 장비 위에서 운영 환경의 제약을 재현하고 검증하는 흐름을 봅니다.',
  },
  elasticsearch: {
    slug: 'elasticsearch',
    title: 'Elasticsearch',
    description: 'Elasticsearch를 배우고 실습하며 정리한 기록',
    category: 'tech',
    purpose:
      '검색 엔진의 설치, 색인, 쿼리, 전처리까지 실습하며 검색 시스템 감각을 만든 선반입니다.',
    status: 'complete',
    readingPromise: '설치에서 검색 쿼리까지 Elasticsearch의 기본 동선을 차례대로 확인합니다.',
  },
  'record-room-making': {
    slug: 'record-room-making',
    title: '기록실을 만드는 기록',
    description: '이 블로그와 기록 시스템을 만들며 배운 것들',
    category: 'project',
    purpose:
      '이 블로그를 기록 시스템으로 바꾸며 설계, 생성, 렌더링의 결정을 남기는 메타 선반입니다.',
    status: 'active',
    readingPromise: '기록을 쓰는 공간 자체를 어떻게 만들고 고쳤는지 구현 흐름으로 읽습니다.',
  },
  'solve-again': {
    slug: 'solve-again',
    title: '문제를 다시 푸는 법',
    description: '삽질, 디버깅, 트러블슈팅, 일하는 방식에 대한 회고',
    category: 'thought',
    purpose: '삽질과 실패를 다시 꺼내 원인, 판단, 회복 과정을 정리하는 선반입니다.',
    status: 'active',
    readingPromise: '문제가 생겼을 때 감정이 아니라 구조로 다시 접근하는 방식을 봅니다.',
  },
  'running-log': {
    slug: 'running-log',
    title: '달리는 기록',
    description: '몸을 움직이며 배운 것들과 준비 과정을 남긴 기록',
    category: 'life',
    purpose: '몸으로 겪은 준비와 회복을 개발자의 기록 습관으로 이어보는 생활 선반입니다.',
    status: 'active',
    readingPromise: '달리기를 통해 꾸준함과 컨디션을 어떻게 기록하는지 읽습니다.',
  },
  'manyang-gureum-log': {
    slug: 'manyang-gureum-log',
    title: '만냥구름 관찰일지',
    description: '고양이와 함께 살며 배운 관찰의 기록',
    category: 'cats',
    purpose: '만냥이와 구름이를 관찰하며 작은 변화와 생활의 온도를 남기는 선반입니다.',
    status: 'resting',
    readingPromise: '아직 묶인 글은 없지만, 이후 만냥구름 기록을 모을 기준을 남겨둡니다.',
  },
} as const satisfies Record<string, SeriesDefinition>;

export type SeriesSlug = keyof typeof series;
export type SeriesEntry = SeriesDefinition & { slug: SeriesSlug };

export const seriesList = Object.values(series) as SeriesEntry[];

export const getSeriesStatusLabel = (status?: SeriesStatus) =>
  status ? seriesStatusLabels[status] : undefined;

export const getSeries = (slug?: string): SeriesEntry | undefined => {
  if (!slug || !(slug in series)) {
    return undefined;
  }

  return series[slug as SeriesSlug] as SeriesEntry;
};
