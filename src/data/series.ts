export const series = {
  'ai-working-notes': {
    slug: 'ai-working-notes',
    title: 'AI와 일하는 방식',
    description: 'AI를 업무와 개발문화 속에서 어떻게 다룰지 고민한 기록',
    category: 'thought',
  },
  'ai-agent-lab': {
    slug: 'ai-agent-lab',
    title: 'AI Agent 실험실',
    description: 'Agent를 만들고 실험하며 배운 것들',
    category: 'tech',
  },
  'backend-notes': {
    slug: 'backend-notes',
    title: 'Backend 설계 노트',
    description: '서버, 구조, 문제 해결에 대한 기록',
    category: 'tech',
  },
  'spring-backend-notes': {
    slug: 'spring-backend-notes',
    title: 'Spring Backend 노트',
    description: 'Spring 기반 백엔드 개발에서 마주한 문제와 해결 기록',
    category: 'tech',
  },
  'spring-persistence': {
    slug: 'spring-persistence',
    title: 'Spring Persistence 정리',
    description: 'Spring의 영속성 계층과 데이터 접근 방식을 정리한 기록',
    category: 'tech',
  },
  'mysql-to-postgres': {
    slug: 'mysql-to-postgres',
    title: 'MySQL에서 PostgreSQL로',
    description: 'MySQL과 PostgreSQL을 비교하고 마이그레이션 과정을 정리한 기록',
    category: 'tech',
  },
  'kotlin-notes': {
    slug: 'kotlin-notes',
    title: 'Kotlin 노트',
    description: 'Kotlin 문법과 사용 경험을 정리한 짧은 기술 기록',
    category: 'tech',
  },
  'kotlin-mapper-lab': {
    slug: 'kotlin-mapper-lab',
    title: 'Kotlin Mapper 실험실',
    description: 'Kotlin으로 객체 변환과 매핑 구조를 실험하며 남긴 기록',
    category: 'project',
  },
  'devops-lab': {
    slug: 'devops-lab',
    title: 'DevOps 실험실',
    description: '로컬 Kubernetes와 운영 환경을 실험하며 남긴 기록',
    category: 'tech',
  },
  'record-room-making': {
    slug: 'record-room-making',
    title: '기록실을 만드는 기록',
    description: '이 블로그와 기록 시스템을 만들며 배운 것들',
    category: 'project',
  },
  'solve-again': {
    slug: 'solve-again',
    title: '문제를 다시 푸는 법',
    description: '삽질, 디버깅, 트러블슈팅, 일하는 방식에 대한 회고',
    category: 'thought',
  },
  'running-log': {
    slug: 'running-log',
    title: '달리는 기록',
    description: '몸을 움직이며 배운 것들과 준비 과정을 남긴 기록',
    category: 'life',
  },
  'manyang-gureum-log': {
    slug: 'manyang-gureum-log',
    title: '만냥구름 관찰일지',
    description: '고양이와 함께 살며 배운 관찰의 기록',
    category: 'cats',
  },
} as const;

export type SeriesSlug = keyof typeof series;
export type SeriesEntry = (typeof series)[SeriesSlug];

export const seriesList = Object.values(series);

export const getSeries = (slug?: string): SeriesEntry | undefined => {
  if (!slug || !(slug in series)) {
    return undefined;
  }

  return series[slug as SeriesSlug];
};
