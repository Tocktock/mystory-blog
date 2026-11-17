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
  resting: '쉬는 중',
  complete: '완결',
} as const satisfies Record<SeriesStatus, string>;

export const series = {
  'ai-working-notes': {
    slug: 'ai-working-notes',
    title: 'AI와 일하는 방식',
    description: 'AI를 업무와 개발문화 속에서 어떻게 다룰지 고민한 기록',
    category: 'thought',
    purpose:
      'AI가 일하는 방식을 바꾸는 걸 보면서, 팀과 개인이 무엇을 책임져야 할지 고민한 글들이에요.',
    status: 'active',
    readingPromise:
      '회사에서 AI Advisor를 맡았던 경험부터 AI로 노래를 만든 이야기까지 이어서 읽을 수 있어요.',
  },
  'ai-agent-lab': {
    slug: 'ai-agent-lab',
    title: 'AI Agent 실험실',
    description: 'Agent를 만들고 실험하며 배운 것들',
    category: 'tech',
    purpose:
      'Agent를 직접 만들어 보면서, 실제 업무에 자동화를 넣었을 때 어디까지 되고 어디서 막히는지 확인한 글들이에요.',
    status: 'active',
    readingPromise:
      '무엇을 해 보려 했는지, 어떻게 만들었는지, 어디서 실패했는지 같이 볼 수 있어요.',
  },
  'backend-notes': {
    slug: 'backend-notes',
    title: 'Backend 설계 노트',
    description: '서버, 구조, 문제 해결에 대한 기록',
    category: 'tech',
    purpose:
      '서버에서 만난 문제를 증상, 원인, 결정 순서로 정리해 뒀어요. 비슷한 문제가 생기면 다시 꺼내 보려고요.',
    status: 'active',
    readingPromise: 'Node.js와 백엔드 설계 이야기를 문제를 푼 과정 위주로 읽을 수 있어요.',
  },
  'nestjs-blog': {
    slug: 'nestjs-blog',
    title: 'NestJS 블로그 만들기',
    description: 'NestJS로 블로그 API를 만들며 정리한 백엔드 학습 기록',
    category: 'tech',
    purpose: 'NestJS로 블로그 API를 만들면서 백엔드 기본기를 코드로 익힌 기록이에요.',
    status: 'complete',
    readingPromise:
      '요구사항 정리부터 모듈, DB, CRUD, 테스트까지 API를 만드는 순서대로 따라갈 수 있어요.',
  },
  'react-redux': {
    slug: 'react-redux',
    title: 'react-redux',
    description: 'React와 Redux 상태 관리를 공부하며 정리한 기록',
    category: 'tech',
    purpose: '백엔드 개발자로서 React와 Redux 상태 관리를 직접 써 보며 익힌 기록이에요.',
    status: 'resting',
    readingPromise: 'React에서 상태가 어디서 생기고 어떻게 전달되는지 기본부터 볼 수 있어요.',
  },
  algorithms: {
    slug: 'algorithms',
    title: 'Algorithms',
    description: '알고리즘 문제를 풀며 정리한 접근과 풀이 기록',
    category: 'tech',
    purpose: '알고리즘 문제를 풀면서 쓴 접근법과 자주 한 실수를 모아 두는 곳이에요.',
    status: 'active',
    readingPromise: '정답보다, 조건을 나누고 방법을 좁혀 가는 과정을 볼 수 있어요.',
  },
  'spring-backend-notes': {
    slug: 'spring-backend-notes',
    title: 'Spring Backend 노트',
    description: 'Spring 기반 백엔드 개발에서 마주한 문제와 해결 기록',
    category: 'tech',
    purpose:
      'Spring에서 요청 처리, 검증, 외부 연동을 하다 만난 문제를 실제 증상 위주로 정리했어요.',
    status: 'complete',
    readingPromise: '검증이나 외부 연동처럼 운영하다 자주 만나는 문제를 빠르게 다시 볼 수 있어요.',
  },
  'spring-persistence': {
    slug: 'spring-persistence',
    title: 'Spring Persistence 정리',
    description: 'Spring의 영속성 계층과 데이터 접근 방식을 정리한 기록',
    category: 'tech',
    purpose: 'JPA 연관관계처럼 Spring에서 데이터를 다루는 방식을 정리했어요.',
    status: 'complete',
    readingPromise: '데이터를 어떻게 다루느냐에 따라 코드 구조가 어떻게 달라지는지 볼 수 있어요.',
  },
  'mysql-to-postgres': {
    slug: 'mysql-to-postgres',
    title: 'MySQL에서 PostgreSQL로',
    description: 'MySQL과 PostgreSQL을 비교하고 마이그레이션 과정을 정리한 기록',
    category: 'tech',
    purpose: 'MySQL과 PostgreSQL을 직접 비교해 보고, 어떤 기준으로 옮기기로 했는지 적었어요.',
    status: 'complete',
    readingPromise: '비교, 도구 고르기, 실제로 옮기는 과정까지 차례대로 볼 수 있어요.',
  },
  'kotlin-notes': {
    slug: 'kotlin-notes',
    title: 'Kotlin 노트',
    description: 'Kotlin 문법과 사용 경험을 정리한 짧은 기술 기록',
    category: 'tech',
    purpose: 'Java와 Spring을 쓰던 입장에서 Kotlin 문법과 사용감을 확인해 본 기록이에요.',
    status: 'resting',
    readingPromise: '작은 문법 차이가 평소 코드를 쓸 때 어떻게 느껴지는지 볼 수 있어요.',
  },
  'kotlin-mapper-lab': {
    slug: 'kotlin-mapper-lab',
    title: 'Kotlin Mapper 실험실',
    description: 'Kotlin으로 객체 변환과 매핑 구조를 실험하며 남긴 기록',
    category: 'project',
    purpose: 'Kotlin으로 객체 변환 코드를 실험하면서 반복 코드를 줄이는 방법을 찾아본 기록이에요.',
    status: 'complete',
    readingPromise: '리플렉션으로 변환 로직을 어디까지 자동화할 수 있는지 실험한 과정을 따라가요.',
  },
  'devops-lab': {
    slug: 'devops-lab',
    title: 'DevOps 실험실',
    description: '로컬 Kubernetes와 운영 환경을 실험하며 남긴 기록',
    category: 'tech',
    purpose: '로컬 Kubernetes나 빌드 머신을 직접 띄워 보면서 배포와 운영을 익히는 기록이에요.',
    status: 'active',
    readingPromise: '내 맥에서 운영 환경을 비슷하게 만들어 보고 확인하는 과정을 볼 수 있어요.',
  },
  elasticsearch: {
    slug: 'elasticsearch',
    title: 'Elasticsearch',
    description: 'Elasticsearch를 배우고 실습하며 정리한 기록',
    category: 'tech',
    purpose: 'Elasticsearch를 설치하고 색인, 쿼리, 전처리까지 직접 실습한 기록이에요.',
    status: 'complete',
    readingPromise: '설치부터 검색 쿼리까지 기본을 차례대로 따라갈 수 있어요.',
  },
  'record-room-making': {
    slug: 'record-room-making',
    title: '기록실을 만드는 기록',
    description: '이 블로그와 기록 시스템을 만들며 배운 것들',
    category: 'project',
    purpose: '이 블로그를 직접 만들고 고치면서 내린 결정들을 적었어요.',
    status: 'active',
    readingPromise: '글을 쓰는 이 공간을 어떻게 만들고 바꿔 왔는지 볼 수 있어요.',
  },
  'solve-again': {
    slug: 'solve-again',
    title: '문제를 다시 푸는 법',
    description: '삽질, 디버깅, 트러블슈팅, 일하는 방식에 대한 회고',
    category: 'thought',
    purpose: '삽질하고 실패했던 일을 다시 꺼내, 원인과 그때의 판단을 정리했어요.',
    status: 'active',
    readingPromise: '문제가 생겼을 때 당황하지 않고 다시 풀어 가는 방법을 볼 수 있어요.',
  },
  'running-log': {
    slug: 'running-log',
    title: '달리는 기록',
    description: '몸을 움직이며 배운 것들과 준비 과정을 남긴 기록',
    category: 'life',
    purpose: '달리기를 준비하고 회복한 과정을 개발할 때처럼 꼼꼼히 적어 봤어요.',
    status: 'active',
    readingPromise: '꾸준히 뛰는 법과 컨디션을 어떻게 기록하는지 볼 수 있어요.',
  },
  'manyang-gureum-log': {
    slug: 'manyang-gureum-log',
    title: '만냥구름 관찰일지',
    description: '고양이와 함께 살며 배운 관찰의 기록',
    category: 'cats',
    purpose: '만냥이와 구름이를 지켜보며 알게 된 작은 변화들을 적어 두려고 해요.',
    status: 'resting',
    readingPromise: '아직 글은 없어요. 앞으로 하나씩 채워 갈게요.',
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
