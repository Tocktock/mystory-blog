export const careerProfile = {
  eyebrow: 'JIYONG PARK',
  role: 'Backend SW Engineer',
  thesis: '운영과 가까운 백엔드를 만들고 있습니다.',
  summary: [
    '최근에는 화물 물류 도메인에서 운송관리, 차주 매칭, 정산, 지도 검색처럼 실제 업무 흐름과 맞닿은 기능을 다뤄왔습니다.',
    '공개 가능한 작업을 중심으로, 제가 맡았던 일과 그 과정의 고민을 정리했습니다.',
  ],
  workStyle:
    '기능을 만드는 것만큼, 동료와 운영자가 이해하기 쉬운 기준을 남기는 일을 중요하게 생각합니다.',
  meta: ['센디', '2021 - 현재', 'Backend SW Engineer / Lead'],
  overview: [
    {
      label: '현재',
      value: '센디 제품팀 · Backend SW Engineer / Lead',
    },
    {
      label: '맡고 있는 분야',
      value: '운송관리 도메인, 차주 매칭, 성능 최적화, 업무 자동화',
    },
    {
      label: '주요 스택',
      value: 'Kotlin, Spring, PostgreSQL, Redis, OpenSearch, AWS',
    },
    {
      label: '관심 있는 주제',
      value: '운영 자동화, LLM/RAG 기반 업무 도구',
    },
  ],
  actions: [
    {
      label: 'GitHub',
      href: 'https://github.com/Tocktock',
      external: true,
    },
    {
      label: '글과 기록',
      href: '#selected-projects',
    },
  ],
} as const;

export const careerEntries = [
  {
    company: '센디',
    role: 'Backend SW Engineer',
    position: 'Lead',
    period: '2021 - 현재',
    summary: '제품팀에서 운송관리 도메인과 운영 도구에 필요한 백엔드 개발을 맡고 있습니다.',
    details: [
      {
        title: '조직',
        items: [
          { label: '주조직', value: '제품팀' },
          { label: '겸임 조직', value: '백엔드파트, 제품본부' },
        ],
      },
      {
        title: '역할',
        items: [
          { label: '직무', value: 'Backend SW Engineer' },
          { label: '직위', value: '리드' },
        ],
      },
    ],
    highlights: [
      '운송관리, 차주 매칭, 성능 최적화, 업무 자동화처럼 운영과 가까운 기능을 다뤘습니다.',
      '일부 도메인에서는 설계와 운영 기준을 정리하는 역할도 함께 맡았습니다.',
    ],
    projects: [] as Array<{ title: string; href: string }>,
  },
] as const;

export const companyWorkAreas = [
  {
    number: '01',
    label: '제품 도메인',
    title: '운송관리 흐름을 하나의 기준으로 맞췄습니다.',
    proofs: [
      {
        label: '다룬 범위',
        value: '운송 요청 · 차주 매칭 · 배차 · 기사 앱 · 운영 도구',
      },
    ],
    summary: [
      '운송 요청, 차주 매칭, 배차, 기사 앱, 운영 도구가 같은 운송 정보를 기준으로 움직이도록 Dispatch의 상태와 데이터 흐름을 맞췄습니다.',
      '신규 제품 출범 과정에서도 이 기준을 사용할 수 있도록 관련 API와 조회 흐름을 함께 정리했습니다.',
    ],
    items: [
      '운송 요청 → 차주 매칭 → 배차로 이어지는 상태 흐름 정리',
      '기사 앱과 운영 도구가 함께 보는 운송 기준 데이터 정리',
      '신규 제품에서 사용할 운송관리 API와 조회 흐름 정리',
    ],
  },
  {
    number: '02',
    label: '데이터와 성능',
    title: '메인 DB를 PostgreSQL로 옮기고 지도 검색을 개선했습니다.',
    proofs: [
      {
        label: '지도 검색 안정화',
        value: '1초 이상 요청 0건',
      },
      {
        label: '관찰 구간 최대 응답',
        value: '약 239ms',
      },
    ],
    summary: [
      '메인 DB 마이그레이션 과정에서 타임존, SQL, 인덱스, 비동기 조회처럼 서비스 동작과 연결된 문제를 다뤘습니다.',
      'PostgreSQL 전환 이후 지도 검색 쿼리와 인덱스를 정리하고, 실제 요청 기준으로 응답 시간을 확인하며 개선했습니다.',
    ],
    items: ['DB 전환 절차와 SQL 호환성 검증', '지도 검색 쿼리와 응답 안정성 검증'],
    links: [
      {
        label: '마이그레이션 상세 기록',
        href: '/records/mysql-to-postgres/mysql-to-postgres-realworld/',
      },
    ],
  },
  {
    number: '03',
    label: '운영과 자동화',
    title: '배포, 로그, 사내 데이터 활용 기준을 정리했습니다.',
    proofs: [
      {
        label: '운영 영역',
        value: 'ECS · CI/CD · APM',
      },
    ],
    summary: [
      '서비스를 운영하면서 배포, 로그, 데이터 확인 방식이 여러 곳에 흩어져 있었습니다.',
      'ECS, CI/CD, APM, 로그 수집, Metabase/n8n/CLI 기반 조회 흐름을 정리해 개발자와 운영자가 필요한 정보를 더 쉽게 확인할 수 있도록 했습니다.',
    ],
    items: ['배포·로그·관측성 운영 기준 정리', '사내 데이터 조회와 자동화 흐름 정리'],
  },
] as const;

export const otherWorkItems = [
  {
    area: 'AI / 자동화',
    period: '2024',
    title: 'LLM 기반 오더폼 자동완성 시스템',
    description:
      '운송 등록에 필요한 입력값을 LLM으로 보완해 오더폼 작성 과정의 반복 입력을 줄이는 흐름을 실험했습니다.',
  },
  {
    area: '데이터·지표 가시화',
    title: 'Metabase 기반 비즈니스 지표 대시보드',
    description:
      '전사적으로 관리할 매출·주문 등 주요 지표를 self-hosted Metabase로 시각화해 운영 현황과 제품 성과를 확인할 수 있도록 구성했습니다.',
  },
  {
    area: '데이터·지표 가시화',
    title: '디비딥 Text to SQL 기능 구현',
    description:
      'n8n·LangGraph·Metabase를 연결한 디비딥에서 자연어로 필요한 지표를 조회할 수 있도록 Text-to-SQL 기능을 구현했습니다. self-hosted n8n과 LangGraph 기반 워크플로우를 구성해 지표 생성, Metabase 연동, 데이터 수집 흐름을 자동화하고 반복 업무의 처리 효율을 개선했습니다.',
  },
  {
    area: '운송관리 / 매칭',
    period: '2024~2025',
    title: '매칭 프로세스 개선과 드라이버 피드 적용',
    description:
      '매칭 흐름, 드라이버 피드, DX 드라이버 앱과 Dispatch 도메인이 이어지는 기준을 맞췄습니다.',
  },
  {
    area: '운영 도구',
    period: '2025~2026',
    title: '차주용 커뮤니티·어드민 플랫폼',
    description:
      '차주 대상 기능과 내부 운영 화면이 함께 움직이도록 API와 관리 도구를 연결했습니다.',
  },
  {
    area: '운영·관측성',
    title: 'Self-hosted JAR -> Container 기반 ECS 전환 — CI/CD·Datadog·OpenSearch',
    description:
      'JAR 직접 실행 서비스를 ECS 컨테이너 기반으로 전환하고, CI/CD와 Datadog APM, OpenSearch 로그 수집 체계를 구축했습니다.',
  },
] as const;

export const nowNext = {
  title: 'Cornerstone',
  description: [
    '흩어진 기록과 작업 맥락을 검색하고 이어볼 수 있도록 만드는 개인 프로젝트입니다.',
    '지금은 시나리오 기반 검증, CLI, 감사 로그, ConnectorHub 연계를 중심으로 조금씩 실험하고 있습니다.',
  ],
  links: [
    {
      label: 'GitHub',
      href: 'https://github.com/Tocktock/Cornerstone',
      external: true,
    },
  ],
} as const;

export const careerLinks = {
  links: [
    {
      label: 'GitHub',
      href: 'https://github.com/Tocktock',
      external: true,
    },
    {
      label: '소개 보기',
      href: '/about/',
    },
  ],
} as const;
