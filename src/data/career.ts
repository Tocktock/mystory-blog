export interface CareerLink {
  label: string;
  href: string;
  external?: boolean;
}

interface CareerProfile {
  eyebrow: string;
  role: string;
  thesis: string;
  summary: readonly string[];
  workStyle: string;
  meta: readonly string[];
  overview: ReadonlyArray<{
    label: string;
    value: string;
  }>;
  actions: readonly CareerLink[];
}

interface CareerEntry {
  company: string;
  role: string;
  position: string;
  period: string;
  headline: string;
  summary: string;
  details: ReadonlyArray<{
    title: string;
    items: ReadonlyArray<{
      label: string;
      value: string;
    }>;
  }>;
  highlights: readonly string[];
  projects: readonly CareerLink[];
}

interface CompanyWorkArea {
  number: string;
  label: string;
  title: string;
  proofs: ReadonlyArray<{
    label: string;
    value: string;
  }>;
  summary: readonly string[];
  items: readonly string[];
  links?: readonly CareerLink[];
  relatedRecords?: readonly CareerLink[];
}

interface OtherWorkItem {
  area: string;
  period?: string;
  title: string;
  description: string;
}

interface NowNext {
  title: string;
  description: readonly string[];
  links: readonly CareerLink[];
}

interface CareerLinks {
  links: readonly CareerLink[];
}

export const careerProfile: CareerProfile = {
  eyebrow: 'JIYONG PARK',
  role: 'Backend SW Engineer · Platform & AI Automation',
  thesis: '제품과 운영 사이의 복잡한 흐름을 백엔드로 정리합니다.',
  summary: [
    '화물 물류 도메인에서 운송관리, 차주 매칭, 데이터 전환, 배포·관측성, LLM 기반 업무 자동화를 다뤄왔습니다.',
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
      label: 'GitHub',
      href: 'https://github.com/Tocktock',
      external: true,
    },
    {
      label: '대표 작업',
      href: '#company-work',
    },
    {
      label: '글과 기록',
      href: '#selected-projects',
    },
    {
      label: '소개',
      href: '/about/',
    },
  ],
};

export const careerEntries: readonly CareerEntry[] = [
  {
    company: '센디',
    role: 'Backend SW Engineer',
    position: 'Lead',
    period: '2021 - 현재',
    headline: '운송관리와 플랫폼 운영에 필요한 백엔드를 맡고 있습니다.',
    summary:
      '제품팀에서 운송관리 도메인, 차주 매칭, 운영 도구, 데이터 조회, 배포·관측성 개선을 다뤄왔습니다.',
    details: [
      {
        title: '역할',
        items: [
          { label: '담당', value: '운송관리·차주 매칭·운영 도구 백엔드' },
          { label: '범위', value: '도메인 상태 기준 수립, API 조회 흐름 정비, 배포·관측성 개선' },
        ],
      },
    ],
    highlights: [
      '도메인 상태 기준과 API 조회 흐름 정리',
      '운영자가 확인하는 데이터 기준 정리',
      '배포 이후 관측 흐름 개선',
    ],
    projects: [],
  },
] as const;

export const companyWorkAreas: readonly CompanyWorkArea[] = [
  {
    number: '01',
    label: 'AI 기반 오더 자동화',
    title: '비정형 운송 요청을 표준 오더 데이터로 변환했습니다.',
    proofs: [
      {
        label: '처리 범위',
        value: '일정 · 경로 · 주소 · 차량 옵션',
      },
      {
        label: '실패 처리',
        value: '필드별 실패 격리와 재검증',
      },
      {
        label: '보완 방식',
        value: '과거 입력 패턴 기반 누락 필드 후보 제안',
      },
    ],
    summary: [
      '기업 고객의 자연어 운송 요청에서 일정, 경로, 주소, 차량 옵션, 작업 조건을 추출하고, 이를 표준 오더 스키마로 변환하는 LLM 기반 자동완성 흐름을 설계·구현했습니다.',
      '주소 보정, 누락 필드 후보 제안, 필드별 실패 격리, 검증 결과 저장 흐름을 함께 구성했습니다.',
    ],
    items: [
      '정보 추출 영역 분리와 병렬 처리 흐름 구성',
      '과거 입력 패턴 기반 정보 보완 후보 제안',
      '주소 보정과 LLM 결과 검증 흐름 설계',
      '부분 실패를 허용하는 필드 단위 결과 처리',
    ],
    relatedRecords: [
      {
        label: 'AI Advisor 회고',
        href: '/records/meta/ai-advisor-writing-partner/',
      },
    ],
  },
  {
    number: '02',
    label: '데이터와 성능',
    title: 'PostgreSQL 전환과 지도 검색 성능을 안정화했습니다.',
    proofs: [
      {
        label: '지도 검색 API',
        value: '1초 이상 요청 520건 → 0건',
      },
      {
        label: '관찰 구간 최대 응답',
        value: '약 239ms',
      },
      {
        label: '성능 개선',
        value: '실행계획 · 인덱스 정비',
      },
    ],
    summary: [
      'Aurora MySQL에서 PostgreSQL로 전환하는 과정에서 SQL 호환성, 타입 매핑, 타임존, 공간정보, 인덱스 이슈를 점검하고 애플리케이션 쿼리와 실행계획을 정비했습니다.',
      '전환 이후 지도 검색 API의 실행계획과 인덱스를 개선해 운영 관찰 구간 기준 1초 이상 요청을 520건에서 0건으로 줄이고, 같은 구간 최대 응답을 약 239ms로 안정화했습니다.',
    ],
    items: ['DB 전환 절차와 애플리케이션 SQL 호환성 검증', '공간 쿼리 실행계획과 인덱스 개선'],
    relatedRecords: [
      {
        label: '마이그레이션 충돌기',
        href: '/records/mysql-to-postgres/mysql-to-postgres-realworld/',
      },
      {
        label: 'pgloader 사용 기록',
        href: '/records/mysql-to-postgres/how-to-use-pgloader/',
      },
    ],
  },
  {
    number: '03',
    label: '플랫폼 운영',
    title: '배포·관측성 흐름을 ECS 중심으로 전환했습니다.',
    proofs: [
      {
        label: '배포 전환',
        value: 'Docker · ECS · GitHub Actions',
      },
      {
        label: '관측/로그',
        value: 'APM · 중앙 로그 수집',
      },
    ],
    summary: [
      'JAR 직접 실행 기반으로 운영되던 대상 서비스를 Docker/ECS 기반 배포 흐름으로 전환하고, CI/CD와 APM, 중앙 로그 수집을 연결했습니다.',
      '배포 이후의 상태, 장애, 로그를 개발자와 운영자가 같은 기준으로 확인할 수 있도록 배포 체크리스트와 관측 기준을 정리했습니다.',
    ],
    items: [
      'Docker/ECS 기반 배포 흐름 전환',
      'CI/CD 자동화와 환경별 배포 체크리스트 정리',
      'APM 대시보드와 로그 조회 기준 구성',
    ],
  },
] as const;

export const otherWorkItems: readonly OtherWorkItem[] = [
  {
    area: 'AI 업무 자동화',
    title: 'LLM 파인튜닝 기반 개체명 인식 적용',
    description:
      '운송 요청 문장의 개체명 인식 모델을 파인튜닝하고, 추출 결과를 오더폼 자동완성의 필드 후보 생성 흐름에 연결했습니다.',
  },
  {
    area: '데이터·지표 가시화',
    title: 'Metabase 기반 비즈니스 지표 대시보드',
    description:
      '분석 환경을 운영·확장하며 반복적으로 확인하던 매출·주문 등 주요 비즈니스 지표를 대시보드화했습니다.',
  },
  {
    area: '데이터·지표 가시화',
    title: '사내 Text-to-SQL 흐름 구성',
    description:
      '사내 자연어 지표 조회 도구를 공동 개발하며 워크플로우, 쿼리 카탈로그, SQL 생성·검증, 대시보드 연동 흐름을 구성했습니다.',
  },
  {
    area: '운송관리 / 매칭',
    period: '2024~2025',
    title: '매칭 프로세스 개선과 드라이버 피드 적용',
    description:
      '매칭 후보 노출, 드라이버 피드, 기사 앱 진입 흐름이 Dispatch 상태와 어긋나지 않도록 API 조회 기준과 상태 연결 방식을 정리했습니다.',
  },
  {
    area: '차주 커뮤니티',
    title: '차주 커뮤니티 소통 창구 구축',
    description:
      '차주와 소통할 수 있는 커뮤니티 창구를 만들고, 내부에서 커뮤니티 내용을 관리할 수 있도록 API와 관리 화면 흐름을 연결했습니다.',
  },
] as const;

export const nowNext: NowNext = {
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
};

export const careerLinks: CareerLinks = {
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
};
