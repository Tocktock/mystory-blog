# 지용의 기록실 리뉴얼 구현 Phase 문서

좋아. 이제부터는 **구현 phase 문서**처럼 가져가자.
각 phase는 독립적으로 PR을 만들 수 있게 나누고, phase마다 **Goal / Scope / Checklist / Done 기준 / 주의사항**을 명확하게 잡을게.

현재 저장소는 Astro 기반이고, `build`, `check`, `lint`, `test:e2e`, `audit:web` 같은 검증 스크립트가 이미 준비되어 있어.
또 글 데이터는 `src/content.config.ts`의 Content Collection schema로 관리되고, 현재는 `title`, `description`, `pubDate`, `updatedDate`, `heroImage`, `lang`, `tags`를 지원하는 상태야.
따라서 이 리뉴얼은 “기능을 새로 다 뜯어고치는 작업”이 아니라, **기존 구조를 단계적으로 확장하는 작업**으로 진행하면 된다.

---

# 전체 Phase 개요

```text
Phase 0. 리뉴얼 기준선 잡기
Phase 1. 브랜드/전역 구조 전환
Phase 2. /blog → /records 라우트 전환
Phase 3. 콘텐츠 스키마 확장
Phase 4. 기록 목록/카테고리/태그 구조 정리
Phase 5. 시리즈 기능 구현
Phase 6. 홈 리디자인
Phase 7. 만냥구름 페이지 강화
Phase 8. 글 상세 경험 개선
Phase 9. 404/검색/마스코트 UX 정리
Phase 10. 최종 QA, SEO, 접근성, 배포 점검
```

추천 진행 방식은 **Phase 0 → 1 → 2**를 먼저 묶어서 “기록실 전환 1차 PR”로 만들고, 이후 phase는 독립 PR로 쪼개는 방식이야.

---

# Phase 0. 리뉴얼 기준선 잡기

## Goal

현재 블로그의 기능과 라우팅이 어떤 상태인지 기준선을 잡는다.
이 phase의 목적은 “수정”이 아니라 **리뉴얼 전 상태를 안전하게 확인하는 것**이야.

## Scope

* 현재 빌드 가능 여부 확인
* 기존 주요 페이지 확인
* 기존 글 목록/태그/검색/RSS 상태 확인
* 리뉴얼 후 깨지기 쉬운 경로 목록 정리

현재 프로젝트에는 빌드, 린트, 타입 체크, Playwright, Lighthouse/Axe/Linkinator 감사 스크립트가 이미 존재한다.

## Checklist

### Repository baseline

* [ ] 리뉴얼 작업 브랜치 생성
  예: `feature/record-room-renewal`
* [ ] 의존성 설치 상태 확인
* [ ] `npm run check` 실행
* [ ] `npm run lint` 실행
* [ ] `npm run build` 실행
* [ ] 가능하면 `npm run test:e2e` 실행
* [ ] 현재 주요 URL 접속 확인

### 현재 주요 URL

* [ ] `/`
* [ ] `/blog`
* [ ] `/blog/[slug]`
* [ ] `/cat-pics`
* [ ] `/about`
* [ ] `/search`
* [ ] `/tags`
* [ ] `/tags/[tag]`
* [ ] `/rss.xml`

### 깨지기 쉬운 지점 확인

* [ ] `/blog` 링크가 사용되는 파일 목록 확인
* [ ] `/cat-pics` 링크가 사용되는 파일 목록 확인
* [ ] RSS의 글 링크 확인
* [ ] 태그 상세 페이지의 글 링크 확인
* [ ] Playwright 테스트에서 `/blog` 경로를 쓰는지 확인
* [ ] Pagefind 검색이 build 이후 정상 동작하는지 확인

현재 RSS는 글 링크를 `/blog/${post.id}/`로 만들고 있으므로, 이후 `/records/${post.id}/`로 바꿔야 한다.
태그 상세 페이지도 현재 글 링크를 `/blog/${post.id}/`로 만들고 있어서, Phase 2에서 반드시 변경해야 한다.

## Done 기준

* [ ] 리뉴얼 전 build가 통과한다.
* [ ] 기존 주요 페이지가 정상 접속된다.
* [ ] `/blog`, `/cat-pics`가 사용되는 위치를 파악했다.
* [ ] Phase 1 이후 비교할 기준 상태가 준비됐다.

## 주의사항

이 phase에서는 디자인이나 구조를 바꾸지 않는다.
나중에 문제가 생겼을 때 “리뉴얼 때문에 깨진 것인지, 원래 깨져 있던 것인지”를 구분하기 위한 단계다.

---

# Phase 1. 브랜드/전역 구조 전환

## Goal

사이트의 정체성을 `Ji Yong's Tech Blog`에서 **지용의 기록실**로 바꾼다.

현재 전역 타이틀은 `Ji Yong's Tech Blog`, 설명은 `Kubernetes, DevOps, Backend, and AI notes by Ji Yong`이다.
이 phase에서 사이트 이름, 설명, 메뉴, 푸터, 기본 문구를 새 방향에 맞게 전환한다.

## Scope

* 사이트 타이틀/설명 변경
* Header 메뉴명 변경
* Footer 문구 변경
* 전역 route helper 추가
* 검색/버튼/문구의 한국어화 방향 잡기

## 변경 대상 파일

```text
src/consts.ts
src/components/Header.astro
src/components/Footer.astro
src/utils/routes.ts
src/data/siteNavigation.ts
```

## Checklist

### 1. 사이트 상수 변경

* [ ] `SITE_TITLE` 변경

```ts
export const SITE_TITLE = '지용의 기록실';
```

* [ ] `SITE_DESCRIPTION` 변경

```ts
export const SITE_DESCRIPTION =
  'AI, Backend, Agent, 그리고 만냥구름. 배우고 만들고 사랑하는 것들을 기록합니다.';
```

* [ ] `SITE_AUTHOR` 유지

```ts
export const SITE_AUTHOR = 'Ji Yong';
```

### 2. route helper 추가

* [ ] `src/utils/routes.ts` 생성
* [ ] 주요 route 상수 정의

```ts
export const routes = {
  home: '/',
  records: '/records',
  record: (id: string) => `/records/${id}/`,
  series: '/series',
  seriesDetail: (slug: string) => `/series/${slug}/`,
  manyangGureum: '/manyang-gureum',
  about: '/about',
  search: '/search',
  tags: '/tags',
  tag: (slug: string) => `/tags/${slug}/`,
  category: (slug: string) => `/categories/${slug}/`,
} as const;
```

### 3. navigation 데이터 분리

* [ ] `src/data/siteNavigation.ts` 생성
* [ ] 메뉴를 한국어로 변경

```ts
export const navLinks = [
  { href: routes.home, label: '홈' },
  { href: routes.records, label: '기록' },
  { href: routes.series, label: '시리즈' },
  { href: routes.manyangGureum, label: '만냥구름' },
  { href: routes.about, label: '소개' },
  { href: routes.search, label: '검색' },
];
```

현재 Header는 `navLinks` 배열에서 `Home`, `Blog`, `Search`, `Cat Pics`, `About`을 관리하고 있다.

### 4. Header 수정

* [ ] `Header.astro`에서 기존 `navLinks` 직접 선언 제거
* [ ] `siteNavigation.ts`에서 import
* [ ] 브랜드명 `지용의 기록실` 정상 출력 확인
* [ ] 모바일 메뉴 정상 동작 확인
* [ ] 다크모드 토글 정상 동작 확인

Header에는 이미 모바일 메뉴와 다크모드 토글이 구현되어 있으므로, 로직은 유지하고 메뉴 데이터만 바꾸는 것이 안전하다.

### 5. Footer 수정

* [ ] Footer 문구 변경
* [ ] GitHub 링크 유지
* [ ] 기록실 카피 추가

예:

```text
© 2026 Ji Yong. 지용의 기록실.
배운 것, 만든 것, 사랑하는 것들을 오래 기록합니다.
```

Footer는 현재 저작권과 GitHub 링크 중심이다.

## Done 기준

* [ ] 사이트 타이틀이 `지용의 기록실`로 바뀐다.
* [ ] Header 메뉴가 `홈 / 기록 / 시리즈 / 만냥구름 / 소개 / 검색`으로 보인다.
* [ ] 기존 Header의 모바일 메뉴와 다크모드가 깨지지 않는다.
* [ ] `npm run check` 통과
* [ ] `npm run build` 통과

## 주의사항

이 phase에서는 아직 `/records`, `/series`, `/manyang-gureum` 페이지가 없을 수 있다.
따라서 Phase 1과 Phase 2는 가능하면 같은 PR에서 묶는 게 좋다.

---

# Phase 2. `/blog` → `/records` 라우트 전환

## Goal

블로그 경로를 새 정체성에 맞게 `/records`로 전환한다.

현재 개별 글은 `/blog/[...slug].astro`에서 생성되고, 이 파일이 글 본문 렌더링과 Giscus 댓글을 담당하고 있다.

## Scope

* `/records` 목록 페이지 생성
* `/records/[slug]` 상세 페이지 생성
* 기존 `/blog` 경로 redirect 처리
* RSS 링크 수정
* 태그 상세 링크 수정

## 변경 대상 파일

```text
src/pages/blog/index.astro
src/pages/blog/[...slug].astro
src/pages/records/index.astro
src/pages/records/[...slug].astro
src/pages/rss.xml.js
src/pages/tags/[tag].astro
vercel.json
```

## Checklist

### 1. records 디렉터리 생성

* [ ] `src/pages/records/index.astro` 생성
* [ ] 기존 `src/pages/blog/index.astro` 내용을 기반으로 이전
* [ ] 페이지 제목을 `Blog`에서 `기록`으로 변경
* [ ] 설명 문구 변경

예:

```text
기술, 일상, 생각, 프로젝트, 만냥구름의 기록을 모았습니다.
```

현재 `/blog/index.astro`는 글 목록을 최신순으로 가져오고, 첫 글을 featured card처럼 보여준다.

### 2. records 상세 라우트 생성

* [ ] `src/pages/records/[...slug].astro` 생성
* [ ] 기존 `src/pages/blog/[...slug].astro` 구조 이전
* [ ] `getStaticPaths()` 유지
* [ ] `BlogPost` layout 유지
* [ ] `GiscusComments` 유지

기존 상세 라우트는 `getCollection('blog')`, `render(post)`, `BlogPost`, `GiscusComments`를 사용한다.

### 3. 기존 blog 라우트 처리

선택지는 둘 중 하나.

#### 추천: Vercel redirect 사용

* [ ] `vercel.json`에 redirect 추가

```json
{
  "redirects": [
    {
      "source": "/blog",
      "destination": "/records",
      "permanent": true
    },
    {
      "source": "/blog/:path*",
      "destination": "/records/:path*",
      "permanent": true
    }
  ]
}
```

현재 `vercel.json`은 CSP와 cache header만 가지고 있다.

### 4. RSS 링크 변경

* [ ] `src/pages/rss.xml.js`에서 링크 변경

현재:

```js
link: `/blog/${post.id}/`,
```

변경:

```js
link: `/records/${post.id}/`,
```

### 5. 태그 상세 링크 변경

* [ ] `src/pages/tags/[tag].astro`의 글 링크 변경

현재:

```astro
<a href={`/blog/${post.id}/`}>
```

변경:

```astro
<a href={`/records/${post.id}/`}>
```

또는:

```astro
<a href={routes.record(post.id)}>
```

### 6. 내부 링크 검색

* [ ] `/blog` 문자열 전체 검색
* [ ] `/cat-pics` 문자열 전체 검색
* [ ] 남아 있는 구 경로 제거 또는 redirect 처리

## Done 기준

* [ ] `/records`에서 글 목록이 보인다.
* [ ] `/records/[slug]`에서 글 상세가 보인다.
* [ ] 글 상세 댓글 영역이 유지된다.
* [ ] `/blog`가 `/records`로 redirect된다.
* [ ] `/blog/[slug]`가 `/records/[slug]`로 redirect된다.
* [ ] RSS의 글 링크가 `/records` 기준이다.
* [ ] 태그 상세 페이지의 글 링크가 `/records` 기준이다.
* [ ] `npm run check` 통과
* [ ] `npm run build` 통과

## 주의사항

`/blog` 페이지 파일을 바로 삭제하면 로컬 Astro 라우팅에서는 redirect가 안 보일 수 있다.
배포 환경에서는 Vercel redirect가 동작하지만, 로컬 테스트에서는 직접 `/records`를 확인하면 된다.

---

# Phase 3. 콘텐츠 스키마 확장

## Goal

글을 “기록실” 구조에 맞게 분류할 수 있도록 `category`, `series`, `seriesOrder`를 추가한다.

현재 schema에는 `tags`만 있고, 카테고리와 시리즈 정보는 없다.

## Scope

* category 필드 추가
* series 필드 추가
* seriesOrder 필드 추가
* 카테고리 데이터 정의
* 시리즈 데이터 정의

## 변경 대상 파일

```text
src/content.config.ts
src/data/categories.ts
src/data/series.ts
```

## Checklist

### 1. category schema 추가

* [ ] `content.config.ts`에 category 추가

```ts
category: z
  .enum(['tech', 'life', 'thought', 'project', 'cats'])
  .default('thought'),
```

### 2. series schema 추가

* [ ] `series` 필드 추가

```ts
series: z.string().optional(),
```

### 3. seriesOrder schema 추가

* [ ] `seriesOrder` 필드 추가

```ts
seriesOrder: z.number().int().positive().optional(),
```

### 4. categories 데이터 생성

* [ ] `src/data/categories.ts` 생성

```ts
export const categories = {
  tech: {
    slug: 'tech',
    label: '기술',
    description: 'AI, Backend, Agent와 문제 해결에 대한 기록입니다.',
  },
  life: {
    slug: 'life',
    label: '일상',
    description: '살아가며 남기고 싶은 일상의 기록입니다.',
  },
  thought: {
    slug: 'thought',
    label: '생각',
    description: '몰입, 관찰, 배움에 대한 글입니다.',
  },
  project: {
    slug: 'project',
    label: '프로젝트',
    description: '만들고 실험한 것들을 기록합니다.',
  },
  cats: {
    slug: 'cats',
    label: '만냥구름',
    description: '만냥이와 구름이의 기록입니다.',
  },
} as const;
```

### 5. series 데이터 생성

* [ ] `src/data/series.ts` 생성

```ts
export const series = {
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
  'solve-again': {
    slug: 'solve-again',
    title: '문제를 다시 푸는 법',
    description: '삽질, 디버깅, 트러블슈팅 회고',
    category: 'thought',
  },
  'manyang-gureum-log': {
    slug: 'manyang-gureum-log',
    title: '만냥구름 관찰일지',
    description: '고양이와 함께 살며 배운 관찰의 기록',
    category: 'cats',
  },
} as const;
```

### 6. 기존 글 frontmatter 점진 업데이트

* [ ] 기존 글에 category 추가
* [ ] 시리즈에 포함할 글에 series 추가
* [ ] 시리즈 순서가 필요한 글에 seriesOrder 추가
* [ ] tags는 기존 구조 유지

## Done 기준

* [ ] 기존 글이 category 없이도 build 된다.
* [ ] 새 글은 category/series/seriesOrder를 사용할 수 있다.
* [ ] `npm run check` 통과
* [ ] `npm run build` 통과

## 주의사항

처음부터 모든 글에 category를 강제하면 build가 깨질 수 있다.
그래서 `default('thought')`를 둔 뒤, 기존 글을 천천히 정리하는 게 안전하다.

---

# Phase 4. 기록 목록/카테고리/태그 구조 정리

## Goal

`/records`를 단순 글 목록이 아니라, 기록실의 중심 페이지로 만든다.

## Scope

* 기록 목록 카드 개선
* 카테고리 네비게이션 추가
* 태그 링크 정리
* `/categories/[slug]` 페이지 생성
* 기존 `/tags` 문구 개선

## 변경 대상 파일

```text
src/pages/records/index.astro
src/pages/categories/[slug].astro
src/pages/tags/index.astro
src/pages/tags/[tag].astro
src/components/records/RecordCard.astro
src/components/records/CategoryNav.astro
src/components/records/TagList.astro
src/styles/records.css
src/styles/tags.css
src/styles/tag-detail.css
```

## Checklist

### 1. RecordCard 컴포넌트 생성

* [ ] `src/components/records/RecordCard.astro` 생성
* [ ] 제목 표시
* [ ] 설명 표시
* [ ] 날짜 표시
* [ ] category 표시
* [ ] tags 표시
* [ ] series가 있으면 series badge 표시
* [ ] 링크는 `/records/[id]`

### 2. CategoryNav 컴포넌트 생성

* [ ] `src/components/records/CategoryNav.astro` 생성
* [ ] `전체` 링크
* [ ] `기술`
* [ ] `일상`
* [ ] `생각`
* [ ] `프로젝트`
* [ ] `만냥구름`

### 3. `/records` 목록 개선

* [ ] 페이지 제목 `기록`
* [ ] intro 문구 추가
* [ ] CategoryNav 추가
* [ ] RecordCard 목록 렌더링
* [ ] 최신순 정렬 유지

### 4. category 상세 페이지 생성

* [ ] `src/pages/categories/[slug].astro` 생성
* [ ] `getStaticPaths()`에서 category별 route 생성
* [ ] category별 글 필터링
* [ ] 최신순 정렬
* [ ] 글이 없을 때 empty state 표시

### 5. tags index 문구 변경

현재 태그 목록 페이지는 `Tags`, `Explore posts grouped by topic.` 문구를 사용한다.

* [ ] 제목 `태그`로 변경
* [ ] 설명 변경

```text
비슷한 기록들을 태그로 모아봤습니다.
```

### 6. tags detail 문구 변경

* [ ] breadcrumb 한국어화
* [ ] 제목/설명 한국어화
* [ ] 링크 `/records/[id]` 유지

## Done 기준

* [ ] `/records`에서 모든 글이 보인다.
* [ ] `/categories/tech` 등 카테고리 페이지가 생성된다.
* [ ] `/tags`가 정상 동작한다.
* [ ] `/tags/[tag]`에서 `/records` 링크로 이동한다.
* [ ] 글 카드에 category/tags/series 정보가 보인다.
* [ ] `npm run check` 통과
* [ ] `npm run build` 통과

## 주의사항

카테고리와 태그의 역할을 분리해야 한다.

```text
category = 큰 책장
tag = 작은 라벨
series = 이어지는 책 묶음
```

---

# Phase 5. 시리즈 기능 구현

## Goal

기술 글을 시리즈 중심으로 탐색할 수 있게 만든다.

이번 리뉴얼에서 기술 글의 위치는 “시리즈 중심”으로 정했기 때문에, `/series`는 핵심 페이지가 된다.

## Scope

* `/series` 페이지 생성
* `/series/[slug]` 페이지 생성
* 시리즈 카드 UI
* 시리즈 상세 글 목록
* 글 상세에 시리즈 정보 표시

## 변경 대상 파일

```text
src/pages/series/index.astro
src/pages/series/[slug].astro
src/components/records/SeriesCard.astro
src/components/records/SeriesBadge.astro
src/components/records/SeriesProgress.astro
src/data/series.ts
src/layouts/BlogPost.astro
src/styles/series.css
```

## Checklist

### 1. SeriesCard 생성

* [ ] `src/components/records/SeriesCard.astro` 생성
* [ ] 시리즈 제목
* [ ] 설명
* [ ] 글 개수
* [ ] 카테고리 표시
* [ ] `/series/[slug]` 링크

### 2. `/series/index.astro` 생성

* [ ] 전체 시리즈 목록 표시
* [ ] “기록실 책장” 콘셉트 문구 추가
* [ ] 글 개수 계산
* [ ] 글이 없는 시리즈도 보여줄지 결정

추천: 글이 없는 시리즈는 숨기지 말고 `준비 중`으로 보여줘도 좋다.

### 3. `/series/[slug].astro` 생성

* [ ] `getStaticPaths()`로 시리즈별 페이지 생성
* [ ] 해당 series 글 필터링
* [ ] `seriesOrder` 기준 정렬
* [ ] `seriesOrder`가 없으면 pubDate 기준 fallback
* [ ] 글 목록 표시

### 4. SeriesBadge 생성

* [ ] 글 카드에서 series가 있으면 badge 표시
* [ ] badge 클릭 시 `/series/[slug]`

### 5. 글 상세에 SeriesProgress 추가

* [ ] 같은 시리즈 글 목록 표시
* [ ] 현재 글 강조
* [ ] 이전/다음 시리즈 글 링크 표시

예:

```text
이 글은 “AI Agent 실험실” 시리즈의 2번째 기록입니다.

1. Agent를 왜 만들고 싶은가
2. Agent를 만들며 배운 것
3. Backend에서 Agent를 다루는 방법
```

## Done 기준

* [ ] `/series`가 정상 렌더링된다.
* [ ] `/series/[slug]`가 정상 렌더링된다.
* [ ] series가 있는 글 상세에 시리즈 정보가 보인다.
* [ ] 시리즈 글 순서가 `seriesOrder` 기준으로 정렬된다.
* [ ] `npm run check` 통과
* [ ] `npm run build` 통과

## 주의사항

frontmatter의 `series` 값은 사람이 읽는 제목이 아니라 slug로 관리한다.

좋음:

```yaml
series: "ai-agent-lab"
```

피하는 게 좋음:

```yaml
series: "AI Agent 실험실"
```

---

# Phase 6. 홈 리디자인

## Goal

홈을 “글 목록 입구”가 아니라 **지용의 기록실 입구**로 만든다.

현재 홈은 큰 이미지, `지용, 만냥구름 공간`, 그리고 `Latest Posts`, `About`, `Cat Pics` 버튼으로 구성되어 있다.
이 phase에서 홈을 “큰 서재 이미지 + 짧은 문장 + 기록실 책장 + 최근 기록 + 만냥구름 한 컷” 구조로 바꾼다.

## Scope

* HeroSection 구현
* BookshelfSection 구현
* RecentRecords 구현
* ManyangGureumCard 구현
* 홈 대표 이미지 교체 준비
* 홈 CTA 변경

## 변경 대상 파일

```text
src/pages/index.astro
src/components/home/HeroSection.astro
src/components/home/BookshelfSection.astro
src/components/home/RecentRecords.astro
src/components/home/ManyangGureumCard.astro
src/styles/home.css
src/assets/heroes/record-room-hero.jpg
```

## Checklist

### 1. 홈 HeroSection

* [ ] `HeroSection.astro` 생성
* [ ] 대표 이미지 연결
* [ ] H1: `지용의 기록실`
* [ ] 문구 추가

```text
AI, Backend, Agent, 그리고 만냥구름.
배우고 만들고 사랑하는 것들을 기록합니다.
```

* [ ] CTA 3개 추가

```text
기록 보기 → /records
시리즈 보기 → /series
만냥구름 만나기 → /manyang-gureum
```

### 2. 대표 이미지 준비

* [ ] 임시 이미지 사용
* [ ] 추후 AI 합성 이미지로 교체
* [ ] 파일 위치 결정

추천:

```text
src/assets/heroes/record-room-hero.jpg
```

### 3. BookshelfSection

* [ ] `BookshelfSection.astro` 생성
* [ ] 4개 카드 구성

```text
AI & Agent
Backend
생각과 일상
만냥구름
```

* [ ] 각 카드에 링크 연결

```text
AI & Agent → /series
Backend → /categories/tech
생각과 일상 → /categories/thought
만냥구름 → /manyang-gureum
```

### 4. RecentRecords

* [ ] 최신 글 3~4개 표시
* [ ] `RecordCard` 재사용
* [ ] `/records`로 이동하는 링크 추가

### 5. ManyangGureumCard

* [ ] 대표 고양이 사진 1장 표시
* [ ] 짧은 문구 추가

```text
오늘도 기록실 어딘가를 차지하고 있습니다.
```

* [ ] `/manyang-gureum` 링크 추가

## Done 기준

* [ ] 홈 첫 화면이 “기록실” 정체성을 전달한다.
* [ ] 홈에서 `/records`, `/series`, `/manyang-gureum`로 이동할 수 있다.
* [ ] 최신 글이 정상 표시된다.
* [ ] 이미지 최적화가 Astro Image로 처리된다.
* [ ] 모바일에서도 hero가 깨지지 않는다.
* [ ] `npm run check` 통과
* [ ] `npm run build` 통과

## 주의사항

이미지 안에 텍스트를 넣지 않는다.
H1과 설명 문구는 HTML로 올리는 게 접근성, SEO, 반응형 대응에 더 좋다.

---

# Phase 7. 만냥구름 페이지 강화

## Goal

기존 `Cat Pics`를 단순 사진 모음이 아니라, **사이트 전체의 마스코트 공간**으로 강화한다.

현재 `cat-pics.astro`는 `catPhotos`를 가져와 사진 그리드를 렌더링하는 구조다.
데이터는 `src/data/catGallery.ts`에서 관리하고, 현재 각 사진은 `image`, `alt`만 가진다.

## Scope

* `/manyang-gureum` 페이지 생성
* 기존 `/cat-pics` redirect
* 고양이 프로필 데이터 추가
* 사진 데이터 확장
* 갤러리 UI 개선
* 관찰일지 글 연결

## 변경 대상 파일

```text
src/pages/manyang-gureum.astro
src/pages/cat-pics.astro
src/data/cats.ts
src/data/catGallery.ts
src/components/cats/CatProfileCard.astro
src/components/cats/CatGallery.astro
src/components/cats/CatPhotoCard.astro
src/styles/manyang-gureum.css
vercel.json
```

## Checklist

### 1. `/manyang-gureum` 페이지 생성

* [ ] 기존 `cat-pics.astro` 기반으로 새 페이지 생성
* [ ] 제목 `만냥구름`
* [ ] 설명 문구 추가

```text
기록실을 함께 쓰는 두 고양이입니다.
```

### 2. `/cat-pics` redirect 추가

* [ ] `vercel.json`에 redirect 추가

```json
{
  "source": "/cat-pics",
  "destination": "/manyang-gureum",
  "permanent": true
}
```

### 3. cats 데이터 생성

* [ ] `src/data/cats.ts` 생성
* [ ] 만냥이 프로필 추가
* [ ] 구름이 프로필 추가
* [ ] 추후 사진 리소스 연결 가능하게 설계

예:

```ts
export const cats = [
  {
    id: 'manyang',
    name: '만냥이',
    description: '기록실의 조용한 관찰자.',
    likes: ['창밖 보기', '편한 자리 차지하기'],
  },
  {
    id: 'gureum',
    name: '구름이',
    description: '기록실 곳곳을 누비는 작은 마스코트.',
    likes: ['책상 근처', '집사 감시하기'],
  },
] as const;
```

### 4. catGallery 데이터 확장

* [ ] `caption` 추가
* [ ] `cats` 추가
* [ ] `mood` 추가
* [ ] `featured` 추가

예:

```ts
export interface CatPhoto {
  image: ImageMetadata;
  alt: string;
  caption?: string;
  cats?: Array<'manyang' | 'gureum'>;
  mood?: 'nap' | 'window' | 'play' | 'desk' | 'together';
  featured?: boolean;
}
```

### 5. 프로필 카드 구현

* [ ] `CatProfileCard.astro` 생성
* [ ] 이름
* [ ] 설명
* [ ] 좋아하는 것
* [ ] 대표 사진

### 6. 사진 갤러리 개선

* [ ] `CatGallery.astro` 생성
* [ ] `CatPhotoCard.astro` 생성
* [ ] caption 표시
* [ ] mood 필터는 1차에서는 UI만 준비하거나 생략 가능

### 7. 관찰일지 연결

* [ ] category가 `cats`인 글 가져오기
* [ ] `/records` 글 카드로 표시
* [ ] 없으면 empty state 표시

## Done 기준

* [ ] `/manyang-gureum`에서 고양이 프로필과 사진이 보인다.
* [ ] `/cat-pics`가 `/manyang-gureum`으로 redirect된다.
* [ ] 홈에서 `/manyang-gureum`으로 이동 가능하다.
* [ ] category `cats` 글이 있으면 관찰일지로 표시된다.
* [ ] `npm run check` 통과
* [ ] `npm run build` 통과

## 주의사항

고양이는 “사진 중심 마스코트”다.
과한 일러스트나 캐릭터화는 피하고, 실제 사진과 짧은 문구로 개성을 만든다.

---

# Phase 8. 글 상세 경험 개선

## Goal

개별 글 페이지를 “일반 블로그 글”이 아니라, 기록실 안의 하나의 기록처럼 보이게 만든다.

현재 `BlogPost.astro`는 제목, 날짜, hero image, 본문, JSON-LD, breadcrumb를 처리한다.
여기에 category, tags, series 정보를 추가하면 글 탐색성이 좋아진다.

## Scope

* 글 상단 meta 개선
* category 표시
* tags 표시
* series 표시
* 같은 시리즈 글 목록
* 이전/다음 글
* 댓글 영역 유지

## 변경 대상 파일

```text
src/layouts/BlogPost.astro
src/components/records/PostMeta.astro
src/components/records/SeriesProgress.astro
src/components/records/RelatedRecords.astro
src/pages/records/[...slug].astro
```

## Checklist

### 1. PostMeta 추가

* [ ] category 표시
* [ ] tags 표시
* [ ] series badge 표시
* [ ] updatedDate 표시 유지

### 2. SeriesProgress 추가

* [ ] 같은 series 글 목록 가져오기
* [ ] 현재 글 강조
* [ ] 이전 글 링크
* [ ] 다음 글 링크

### 3. RelatedRecords 추가

* [ ] 같은 category 글 추천
* [ ] 같은 tag 글 추천
* [ ] 최대 3개 정도만 표시

### 4. Giscus 유지

* [ ] 기존 GiscusComments 유지
* [ ] placeholder 정상 표시 확인

댓글은 Giscus 환경변수가 없으면 placeholder를 렌더링하는 구조라서 안전하다.

## Done 기준

* [ ] 글 상세에서 category/tags/series가 보인다.
* [ ] 시리즈 글은 시리즈 진행 목록이 보인다.
* [ ] 댓글 영역이 유지된다.
* [ ] JSON-LD가 깨지지 않는다.
* [ ] `npm run check` 통과
* [ ] `npm run build` 통과

## 주의사항

이 phase에서는 레이아웃을 너무 크게 바꾸지 않는다.
먼저 meta와 series 탐색을 붙이고, 디자인 고도화는 이후에 해도 된다.

---

# Phase 9. 404/검색/마스코트 UX 정리

## Goal

사이트 곳곳에 “만냥구름이 있는 기록실” 느낌을 자연스럽게 넣는다.

## Scope

* 검색 문구 변경
* 검색 결과 없음 문구 변경
* 404 페이지 추가
* footer/empty state 문구 정리
* 마스코트 톤 통일

## 변경 대상 파일

```text
src/pages/search.astro
src/pages/404.astro
src/components/Footer.astro
src/components/common/EmptyState.astro
```

## Checklist

### 1. 검색 페이지 문구 변경

현재 검색 페이지는 `Search`, `Find posts by keyword...` 문구를 사용하고 있다.

* [ ] 제목 변경

```text
기록 찾기
```

* [ ] 설명 변경

```text
기억나는 단어를 입력해보세요.
기술 노트, 일상 기록, 만냥구름 이야기까지 함께 찾아봅니다.
```

* [ ] Pagefind placeholder 변경

```ts
placeholder: '기록실에서 찾아볼게요…',
zero_results: '만냥구름도 못 찾았어요. 다른 단어로 다시 찾아볼까요?',
```

### 2. 404 페이지 추가

* [ ] `src/pages/404.astro` 생성
* [ ] 제목

```text
비어 있는 서랍입니다
```

* [ ] 문구

```text
찾으려던 기록이 없거나,
구름이가 어딘가에 숨겨둔 것 같아요.
```

* [ ] CTA

```text
기록으로 돌아가기
검색하기
```

### 3. EmptyState 컴포넌트 추가

* [ ] `src/components/common/EmptyState.astro` 생성
* [ ] 기록 없음
* [ ] 시리즈 없음
* [ ] 검색 결과 없음
* [ ] 카테고리 글 없음

### 4. 마스코트 문구 톤 통일

* [ ] 유치하지 않게 짧게 사용
* [ ] 고양이 농담은 empty state나 404에만 제한
* [ ] 기술 글 본문 UX에는 과하게 넣지 않기

## Done 기준

* [ ] `/search` 문구가 기록실 톤으로 바뀐다.
* [ ] 검색 결과 없음 문구가 바뀐다.
* [ ] `/404` 페이지가 존재한다.
* [ ] Empty state 문구가 통일된다.
* [ ] `npm run check` 통과
* [ ] `npm run build` 통과

## 주의사항

마스코트 UX는 “양념”이다.
너무 많이 넣으면 사이트가 장난스러워지고, 기술 글의 신뢰감이 떨어질 수 있다.

---

# Phase 10. 최종 QA, SEO, 접근성, 배포 점검

## Goal

리뉴얼된 사이트가 안정적으로 빌드되고, 검색/SEO/접근성/기존 링크가 문제없이 동작하는지 확인한다.

## Scope

* 전체 빌드
* 타입 체크
* 린트
* E2E 테스트
* Lighthouse/Axe/Linkinator 감사
* RSS 확인
* sitemap 확인
* redirect 확인
* 검색 확인

## Checklist

### 1. 기본 검증

* [ ] `npm run check`
* [ ] `npm run lint`
* [ ] `npm run build`
* [ ] `npm run preview`

### 2. E2E

* [ ] `npm run test:e2e`
* [ ] 테스트 경로가 `/blog`가 아니라 `/records` 기준인지 확인
* [ ] 검색 테스트가 여전히 통과하는지 확인
* [ ] 댓글 placeholder 테스트가 있으면 정상 동작 확인

### 3. 감사

* [ ] `npm run audit:web`

이 스크립트는 production preview를 띄운 뒤 Lighthouse, Axe, Linkinator 감사를 실행하도록 되어 있다.

### 4. 라우팅 확인

* [ ] `/`
* [ ] `/records`
* [ ] `/records/[slug]`
* [ ] `/series`
* [ ] `/series/[slug]`
* [ ] `/manyang-gureum`
* [ ] `/about`
* [ ] `/search`
* [ ] `/tags`
* [ ] `/tags/[tag]`
* [ ] `/categories/tech`
* [ ] `/rss.xml`

### 5. Redirect 확인

* [ ] `/blog` → `/records`
* [ ] `/blog/[slug]` → `/records/[slug]`
* [ ] `/cat-pics` → `/manyang-gureum`

### 6. SEO 확인

* [ ] canonical URL 확인
* [ ] OG title 확인
* [ ] OG image 확인
* [ ] RSS link 확인
* [ ] sitemap 생성 확인
* [ ] JSON-LD 오류 없는지 확인

`BaseHead.astro`는 canonical, RSS, OG, Twitter, language, font preload 등을 담당하므로, SEO 관련 변경 시 이 파일이 핵심이다.

### 7. 접근성 확인

* [ ] hero image alt 확인
* [ ] 고양이 사진 alt 확인
* [ ] 버튼 focus-visible 확인
* [ ] 모바일 메뉴 aria-expanded 확인
* [ ] 다크모드 버튼 aria-label 확인
* [ ] axe 위반 없음 확인

## Done 기준

* [ ] `npm run build` 통과
* [ ] `npm run check` 통과
* [ ] 핵심 URL 정상 접속
* [ ] 기존 `/blog`, `/cat-pics` 링크 redirect 정상
* [ ] RSS가 `/records` 링크를 사용
* [ ] 검색 정상 동작
* [ ] 모바일 메뉴 정상
* [ ] 다크모드 정상
* [ ] Lighthouse/Axe/Linkinator 주요 오류 없음

---

# 추천 PR 단위

실제 작업은 phase 그대로 나누면 너무 많을 수 있으니, PR은 이렇게 묶는 게 좋아.

## PR 1. 기록실 전환 기반

포함 phase:

```text
Phase 0
Phase 1
Phase 2
```

목표:

```text
사이트 이름 변경
메뉴 변경
/blog → /records 전환
/cat-pics redirect 준비
RSS/태그 링크 수정
```

검증:

```text
npm run check
npm run lint
npm run build
```

---

## PR 2. 콘텐츠 구조 확장

포함 phase:

```text
Phase 3
Phase 4
```

목표:

```text
category/series/seriesOrder schema 추가
카테고리 페이지
기록 목록 개선
태그 문구 개선
```

검증:

```text
npm run check
npm run build
```

---

## PR 3. 시리즈 책장

포함 phase:

```text
Phase 5
```

목표:

```text
/series
/series/[slug]
글 상세 시리즈 정보
```

검증:

```text
npm run check
npm run build
```

---

## PR 4. 홈 리디자인

포함 phase:

```text
Phase 6
```

목표:

```text
큰 hero 이미지
기록실 책장
최근 기록
만냥구름 한 컷
```

검증:

```text
npm run check
npm run build
```

---

## PR 5. 만냥구름 공간

포함 phase:

```text
Phase 7
```

목표:

```text
/manyang-gureum
고양이 프로필
사진 갤러리 개선
관찰일지 연결
```

검증:

```text
npm run check
npm run build
```

---

## PR 6. 마무리 UX와 QA

포함 phase:

```text
Phase 8
Phase 9
Phase 10
```

목표:

```text
글 상세 경험 개선
404
검색 문구
empty state
최종 QA
```

검증:

```text
npm run check
npm run lint
npm run build
npm run test:e2e
npm run audit:web
```

---

# 가장 먼저 시작할 작업

첫 구현은 아래 순서가 좋아.

```text
1. Phase 0 기준선 확인
2. Phase 1 사이트 이름/메뉴/route helper 적용
3. Phase 2 /records 라우트 생성
4. RSS와 태그 상세 링크 수정
5. vercel.json redirect 추가
6. npm run check
7. npm run build
```

이렇게 하면 리뉴얼의 뼈대가 바로 잡힌다.

최초 작업 단위는 **PR 1: 기록실 전환 기반**으로 잡자.
