export const careerProfile = {
  eyebrow: 'JIYONG PARK',
  role: 'Backend SW Engineer · Platform / AI Systems',
  thesis: '제품과 운영 사이의 복잡한 흐름을 백엔드로 정리합니다.',
  summary: [
    '최근에는 화물 물류 도메인에서 운송관리, 차주 매칭, 데이터 전환, 배포·관측성, LLM 기반 업무 자동화를 다뤄왔습니다.',
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
      value: '운송관리 도메인, 차주 매칭, 데이터 전환, 플랫폼 운영',
    },
    {
      label: '주요 스택',
      value: 'Kotlin, Spring, PostgreSQL, Redis, OpenSearch, AWS',
    },
    {
      label: '관심 있는 주제',
      value: '운영 자동화, 데이터 플랫폼, LLM 기반 업무 도구',
    },
  ],
  actions: [
    {
      label: '대표 작업',
      href: '#company-work',
    },
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
    summary:
      '제품팀에서 운송관리 도메인, 차주 매칭, 운영 도구, 데이터 조회, 배포·관측성 개선에 필요한 백엔드 개발을 맡고 있습니다.',
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
      '기능 구현뿐 아니라 도메인 상태 기준, API 조회 흐름, 운영자가 확인하는 데이터 기준을 함께 다뤘습니다.',
      '일부 도메인에서는 설계와 운영 기준 정리, 배포 이후의 관측 흐름 개선까지 맡았습니다.',
    ],
    projects: [] as Array<{ title: string; href: string }>,
  },
] as const;

export const companyWorkAreas = [
  {
    number: '01',
    label: 'AI 제품 시스템',
    title: '비정형 운송 요청을 표준 오더 데이터로 변환했습니다.',
    proofs: [
      {
        label: '처리 범위',
        value: '일정 · 경로 · 주소 · 차량 옵션',
      },
      {
        label: '운영 기준',
        value: '필드 단위 실패 처리 · 요청/응답 저장',
      },
    ],
    summary: [
      '기업 고객의 자연어 운송 요청에서 일정, 경로, 주소, 차량 옵션, 작업 조건을 추출해 표준 오더 스키마로 조합하는 LLM 기반 자동완성 흐름을 설계·구현했습니다.',
      '주소 DB 보정, 누락 옵션 제안, 필드 단위 실패 처리, 요청·응답 저장을 함께 구성해 품질 개선에 필요한 데이터를 남겼습니다.',
    ],
    items: [
      '정보 추출 영역 분리와 병렬 처리 흐름 구성',
      '주소 보정과 누락 옵션 제안 흐름 설계',
      '부분 실패를 허용하는 필드 단위 결과 처리',
    ],
  },
  {
    number: '02',
    label: '데이터와 성능',
    title: 'PostgreSQL 전환과 지도 검색 성능을 안정화했습니다.',
    proofs: [
      {
        label: '지도 검색',
        value: '운영 관찰 구간 1초 이상 요청 0건',
      },
      {
        label: '관찰 구간 최대 응답',
        value: '약 239ms',
      },
    ],
    summary: [
      'Aurora MySQL에서 PostgreSQL로 전환하는 과정에서 SQL 호환성, 타입 매핑, 타임존, 공간정보, 인덱스 문제를 점검하고 정비했습니다.',
      '전환 이후 지도 검색 API의 실행계획과 인덱스를 개선해 운영 관찰 구간에서 1초 이상 요청을 0건으로 줄이고, 최대 응답 시간을 약 239ms 수준으로 안정화했습니다.',
    ],
    items: ['DB 전환 절차와 애플리케이션 SQL 호환성 검증', '공간 쿼리 실행계획과 인덱스 개선'],
    links: [
      {
        label: '마이그레이션 상세 기록',
        href: '/records/mysql-to-postgres/mysql-to-postgres-realworld/',
      },
    ],
  },
  {
    number: '03',
    label: '플랫폼 운영',
    title: '배포와 관측성 기준을 ECS 중심으로 전환했습니다.',
    proofs: [
      {
        label: '배포 전환',
        value: 'Docker · ECS · GitHub Actions',
      },
      {
        label: '관측/로그',
        value: 'Datadog APM · Filebeat → OpenSearch',
      },
    ],
    summary: [
      'JAR 직접 실행 기반으로 운영되던 서비스를 Docker/ECS 기반 배포 흐름으로 전환하고, GitHub Actions CI/CD, Datadog APM, Filebeat→OpenSearch 로그 수집을 연결했습니다.',
      '배포 이후의 상태, 장애, 로그를 개발자와 운영자가 같은 기준으로 확인할 수 있도록 운영 기준을 표준화했습니다.',
    ],
    items: [
      'Docker/ECS 기반 배포 흐름 전환',
      'CI/CD 자동화와 환경별 배포 기준 정리',
      'APM과 중앙 로그 수집 파이프라인 구성',
    ],
  },
  {
    number: '04',
    label: '운송 도메인',
    title: '운송 실행 흐름을 Dispatch 기준으로 정리했습니다.',
    proofs: [
      {
        label: '다룬 범위',
        value: '운송 요청 · 차주 매칭 · 배차 · 기사 앱 · 운영 도구',
      },
    ],
    summary: [
      '운송 요청, 차주 매칭, 배차, 기사 앱, 운영 도구가 서로 다른 기준으로 운송 상태를 해석하던 문제를 Dispatch 중심의 상태 흐름과 기준 데이터로 정리했습니다.',
      '새로운 운송관리 흐름에서도 같은 기준을 재사용할 수 있도록 운송관리 API와 조회 흐름을 함께 정비했습니다.',
    ],
    items: [
      '운송 요청 → 차주 매칭 → 배차로 이어지는 상태 흐름 정리',
      '기사 앱과 운영 도구가 함께 보는 운송 기준 데이터 정리',
      '신규 제품 흐름에서 사용할 운송관리 API와 조회 흐름 정리',
    ],
  },
] as const;

export const otherWorkItems = [
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
