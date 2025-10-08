> **현재 관찰 요약 (2025‑10‑08)**
>
> - 홈/블로그/어바웃 3개의 단순 내비 구조, 글은 한국어 위주. 홈에 “Cute Cat Gallery” 섹션, 블로그 목록/상세 정상 노출. **댓글 위젯은 부재**(Utterances/Giscus 모두 미탐). ([ji-yong.com][1])
> - Vercel에 배포 중이라는 요구사항(사용자 진술)에 맞춰 캐싱/헤더 전략을 포함. Vercel은 정적 자산을 **디플로이 수명 동안 에지 캐시**하며, 필요 시 `vercel.json`으로 Cache‑Control 제어 가능. ([Vercel][2])

---

## 전체 로드맵 (Phase‑by‑Phase)

### Phase 0 — 베이스라인·계측·안전망 (가볍게 시작)

**목표:** 현재 상태를 수치화하고, 바꾸더라도 쉽게 되돌릴 안전망과 자동 검증 파이프라인을 깔아둠.

**해야 할 일**

- **브랜치 전략:** `revamp/2025-q4` 분기 브랜치 생성, Vercel 프리뷰 연결(프리뷰 URL 자동).
- **진단 툴:** Lighthouse(모바일), Axe(접근성), Linkinator(링크체커) 로컬 스크립트 추가.
- **애널리틱스(선택):** Plausible/Umami 같은 경량 분석 or Vercel Analytics.
- **서치 콘솔:** Google Search Console 등록 + 도메인 소유권 검증, sitemaps 제출 계획 수립(@astrojs/sitemap 적용 시). ([Astro Docs][3])

**DoD**

- `npm run audit:web` 한 번으로 **Lighthouse(모바일 90+), SEO 90+ 리포트** 저장(artifacts).
- Vercel 프리뷰에서 **모든 페이지 200/OK**, 404 커스텀 페이지 표시.

---

### Phase 1 — 모바일 퍼스트 UI·가독성 (핵심)

**목표:** “깔끔하고 모던”, “모바일 친화”, “내용을 잘 보이게”를 한 번에 달성.

**핵심 변경**

1. **타이포 스케일 & 줄간격**

   - 본문: `clamp(18px, 1.8vw, 20px)` / line-height 1.7.
   - 제목 계층(H1/H2/H3) 명확화(시각 크기와 **시맨틱 태그** 일치). 블로그 목록 페이지 **H1=“Blog”**, 각 포스트 카드 **H2**.

2. **코드 가독성**

   - 전역: `code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace }`
   - `pre { overflow-x: auto }` 로 모바일 코드 줄바꿈 대신 **수평 스크롤**.

3. **터치 타깃 & 내비게이션**

   - 탭 타깃 최소 40px, 모바일 <480px에서 **햄버거 토글**(필요 시).

4. **언어 표기**

   - 페이지 **lang="ko"** 기본값(영문 포스트는 frontmatter로 `lang: en`). 이는 접근성·SEO 모두에 중요.

5. **다크 모드(선택)**

   - CSS 변수 기반 `data-theme="dark"` 토글(시스템 선호도 매칭).

6. **이미지 반응형 규칙**

   - `img{max-width:100%; height:auto}` 보장, CLS 방지 위해 폭/높이 속성 지정.

**DoD**

- iPhone SE ~ 데스크톱까지 **수평 스크롤 없음**. 포커스 링 유지. H 계층 검사 통과.
- 포스트의 코드 블록이 **폰에서 끊김 없이 읽힘**.

---

### Phase 2 — SEO·국제화·메타데이터 (핵심)

**목표:** 기본이 아니라 “잘 되는 SEO”. 구조화 데이터·사이트맵·RSS·언어를 체계화.

**해야 할 일**

1. **사이트 전역 메타**

   - 홈 타이틀/설명 강화(키워드 명시):
     `SITE_TITLE = "Ji Yong’s Tech Blog"`
     `SITE_DESCRIPTION = "Kubernetes, DevOps, Backend, and AI notes by Ji Yong"`

2. **언어/국제화**

   - 레이아웃에서 `<html lang={pageLang || 'ko'}>`; 한국어 기본.

3. **구조화 데이터(JSON‑LD)**

   - 포스트: `BlogPosting`(Article) 스키마(제목, 설명, 작성/수정일, author, url, og:image).
   - 전역: `WebSite` + `Person`(author), 필요하면 `BreadcrumbList`. Google 가이드에 부합하도록 **JSON‑LD 권장**. ([Google for Developers][4])
   - 예시(포스트 레이아웃 하단):

     ```astro
     <script type="application/ld+json">
     {JSON.stringify({
       "@context":"https://schema.org",
       "@type":"BlogPosting",
       "headline": frontmatter.title,
       "description": frontmatter.description,
       "datePublished": frontmatter.pubDate,
       "dateModified": frontmatter.updatedDate ?? frontmatter.pubDate,
       "author": {"@type":"Person","name":"Ji Yong"},
       "url": new URL(Astro.url, Astro.site).toString(),
       "image": frontmatter.hero?.src && new URL(frontmatter.hero.src, Astro.site).toString()
     })}
     </script>
     ```

4. **사이트맵 & RSS**

   - `@astrojs/sitemap` 통합(astro.config에 `site` 정확히 지정).
   - `@astrojs/rss`로 `/rss.xml` 생성(콘텐츠 컬렉션에서 아이템 생성). ([Astro Docs][3])

5. **robots.txt**

   - `public/robots.txt`에 `Sitemap: https://ji-yong.com/sitemap-index.xml` 혹은 `/sitemap.xml` 경로 명시.

**DoD**

- Rich Results Test(수동)에서 **에러 0**.
- 서치 콘솔에서 **사이트맵 인식**, 커버리지 경고 없음.

---

### Phase 3 — 댓글(깃허브 연동) 및 참여 유도

**권장:** **Giscus** 채택(깃허브 Discussions 기반, 스레드형·i18n 지원). 유사한 Utterances는 Issues 기반으로 단순/경량하지만 스레딩·현행성 측면에서 Giscus가 유리. ([giscus.app][5])

**절차**

1. 리포지토리 **Discussions 활성화** + “Comments” 카테고리 생성.
2. **giscus.app**에서 스니펫 생성(`data-mapping="pathname"`, `data-lang="ko"`, `data-theme="preferred_color_scheme"`). ([giscus.app][5])
3. 포스트 레이아웃 하단에 스크립트 삽입:

   ```html
   <script
     src="https://giscus.app/client.js"
     data-repo="Tocktock/mystory-blog"
     data-repo-id=".../from giscus.app..."
     data-category="Comments"
     data-category-id=".../from giscus.app..."
     data-mapping="pathname"
     data-reactions-enabled="1"
     data-emit-metadata="0"
     data-input-position="bottom"
     data-lang="ko"
     data-theme="preferred_color_scheme"
     crossorigin="anonymous"
     async
   ></script>
   ```

4. (Utterances에서 이전 코멘트가 있다면) GitHub의 “Convert to discussion”로 **마이그레이션**(수기 소수건).
5. 포스트 말미에 짧은 **참여 유도 문구**(“💬 궁금한 점은 아래 댓글로!”).

**DoD**

- 프리뷰/프로덕션에서 **로그인 안내 → 댓글 작성 → 즉시 표시** 플로우 정상.
- 다크/라이트 테마 전환 시 위젯도 동기화.

---

### Phase 4 — 검색과 탐색성 (콘텐츠가 쌓일수록 중요)

**권장:** **Pagefind**(정적 사이트용 초경량 검색, 빌드 후 인덱싱·클라이언트 UI 제공). Astro와도 문제없이 연동됩니다. ([pagefind.app][6])

**절차**

1. 설치: `npm i -D pagefind`
2. 빌드 후 인덱싱:

   - `package.json`:

     ```json
     {
       "scripts": {
         "build": "astro build",
         "postbuild": "npx pagefind --source dist"
       }
     }
     ```

3. 검색 UI 페이지 추가(`/search`):

   ```astro
   ---
   import "../styles/search.css";
   ---
   <link rel="stylesheet" href="/pagefind/pagefind-ui.css">
   <div id="search"></div>
   <script src="/pagefind/pagefind-ui.js" type="module"></script>
   <script type="module">
     import { PagefindUI } from '/pagefind/pagefind-ui.js';
     new PagefindUI({ element: "#search", showImages: true, mergeIndex: true });
   </script>
   ```

4. 내비게이션에 **Search** 링크 추가.
5. 포스트 frontmatter에 `tags: ['kubernetes','ci-cd']` 도입 → `/tags/[tag]/` **태그 인덱스 페이지** 생성.

**DoD**

- `/search`에서 한국어 키워드 검색 **150ms 이내 자동완성/결과**(로컬).
- 태그 페이지 자동 생성 및 내부 링크 증가.

---

### Phase 5 — 이미지·성능 최적화 (Core Web Vitals)

**권장:** Astro의 빌트인 **`astro:assets`**(`<Image/>`,`<Picture/>`)로 **WebP, 사이즈 세트, lazy‑load**를 자동화. 기존 `public/`의 갤러리/썸네일은 리사이즈·압축. ([Astro Docs][7])

**해야 할 일**

- 로컬 자산:

  ```astro
  ---
  import { Image } from 'astro:assets';
  import hero from '../../assets/hero.jpg';
  ---
  <Image src={hero} alt="..." widths={[400, 800, 1200]} sizes="(max-width: 768px) 100vw, 720px" loading="lazy" />
  ```

- **OG 이미지 자동 생성**(선택): Satori/플러그인으로 포스트별 OpenGraph 카드 빌드타임 생성. ([TechSquidTV][8])
- Vercel 캐시: 정적 파일은 자동 에지 캐시. 필요 시 `vercel.json`로 `Cache‑Control`/`CDN-Cache-Control` 조절(예: `/assets/*` 1년 immutable). ([Vercel][2])

**DoD**

- LCP/CLS 개선(모바일 LCP < 2.5s, CLS ~0). Lighthouse **성능 95+**.

---

### Phase 6 — 접근성·보안·품질 보증

**해야 할 일**

- **스크린리더 문구 정정:** 헤더 GitHub 아이콘의 sr‑only 텍스트를 “Ji Yong’s GitHub” 등으로 정확화.
- **포커스 가시성 유지**, 대비(AA 4.5:1+) 점검.
- **CSP**(선택): `script-src 'self' https://giscus.app` 등 최소 허용.
- **테스트/CI:** `astro check`, ESLint/Prettier, 링크체커, Lighthouse CI.

**DoD**

- Axe 자동 점검 **심각/중대한 0건**.
- 메인 플로우(CRUD 없음) Playwright 연기 테스트 3건(네비·검색·댓글).

---

## 파일/설정 변경 요약 (핵심만)

- `astro.config.*`

  - `site: "https://ji-yong.com"` (sitemap/RSS가 정확 URL을 생성)
  - `integrations: [sitemap(), /* 필요 시 vercel() */]` ([Astro Docs][3])

- `src/layouts/BaseLayout.astro`

  - `<html lang={Astro.props.lang ?? 'ko'}>`
  - 본문 그리드/폭, `clamp()` 타이포, 코드 스타일.

- `src/layouts/BlogPost.astro`

  - JSON‑LD(Article, BreadcrumbList 옵션), Giscus 스크립트 삽입.

- `src/pages/rss.xml.js`

  - `@astrojs/rss`로 컬렉션 기반 RSS. ([Astro Docs][9])

- `src/pages/search.astro`

  - Pagefind UI 로더 + 컨테이너.

- `public/robots.txt`

  - `Sitemap: https://ji-yong.com/sitemap-index.xml` (또는 `/sitemap.xml`)

- `vercel.json`(선택)

  - 정적 자산 헤더 최적화:

    ```json
    {
      "headers": [
        {
          "source": "/assets/(.*)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "public, max-age=31536000, immutable"
            },
            { "key": "CDN-Cache-Control", "value": "max-age=31536000" }
          ]
        }
      ]
    }
    ```

  ([Vercel][10])

---

## 리스크 & 우회 전략

- **URL 매핑 변경(댓글):** Giscus `pathname` 매핑은 URL이 바뀌면 스레드가 분리됨 → **영구 슬러그** 유지.
- **이미지 경로 변경:** `astro:assets`로 옮길 때 게시물 내 상대경로 확인(빌드 에러 시 경고).
- **i18n 혼합 언어:** `lang`을 포스트별 frontmatter로 제어—검색 노출에 유리(ko/en 혼재 시).

---

## 측정 지표(KPI)

- **Core Web Vitals:** 모바일 LCP < 2.5s, CLS < 0.05.
- **검색성:** 인덱싱 유효 URL 100%, 커버리지 오류 0, 브랜드 질의 CTR 상승.
- **참여:** 포스트 하단 Giscus **반응/댓글 발생률**, 평균 체류 시간 증가.
- **내부 탐색:** `/search` 사용률, 태그 페이지 경유 세션 비중.

---

## 무엇이 “최신”인지 (근거 정리 · 2025‑10‑08 접속)

- **Giscus**: GitHub Discussions 기반, 스레드/리액션/i18n 지원. ([giscus.app][5])
- **Utterances**: GitHub Issues 기반의 경량 위젯(대안) — OAuth 필요, 이슈 자동 생성. ([utteranc.es][11])
- **Pagefind**: 정적 사이트 빌드 후 인덱싱·초경량 검색/기본 UI 제공. ([pagefind.app][6])
- **Astro 이미지/사이트맵/RSS**: `astro:assets`(Image/Picture), `@astrojs/sitemap`, `@astrojs/rss`. ([Astro Docs][7])
- **Vercel 캐시/헤더**: 정적 파일 에지 캐시 기본, 필요 시 `vercel.json`으로 세밀 제어. ([Vercel][2])
- **구조화 데이터 가이드**: Article/Breadcrumb JSON‑LD 권장. ([Google for Developers][4])

---

### 바로 시작하려면 (제안되는 순서)

1. **Phase 0 실행**(브랜치·계측) → 2) **Phase 1/2 동시 진행**(UI+SEO) → 3) **Phase 3**(Giscus) → 4) **Phase 4**(검색/태그) → 5) **Phase 5/6**(성능·접근성).
   당장 임팩트가 큰 건 **Phase 1(모바일 가독성)**과 **Phase 2(언어/스키마/사이트맵/RSS)**, 그리고 **Phase 3(Giscus)**입니다.

필요하면 제가 각 페이즈별 **구체 PR 템플릿(체크리스트+테스트 항목)**, `diff` 예시, 그리고 **한 파일씩 적용 가이드**도 바로 적어드릴게요.

[1]: https://ji-yong.com/ "Ji Yong's Blog"
[2]: https://vercel.com/docs/edge-cache?utm_source=chatgpt.com "Vercel Cache"
[3]: https://docs.astro.build/en/guides/integrations-guide/sitemap/?utm_source=chatgpt.com "astrojs/sitemap - Astro Docs"
[4]: https://developers.google.com/search/docs/appearance/structured-data/article?utm_source=chatgpt.com "Learn About Article Schema Markup | Google Search Central"
[5]: https://giscus.app/?utm_source=chatgpt.com "giscus"
[6]: https://pagefind.app/?utm_source=chatgpt.com "Pagefind | Pagefind — Static low-bandwidth search at scale"
[7]: https://docs.astro.build/en/guides/images/?utm_source=chatgpt.com "Images - Astro Docs"
[8]: https://techsquidtv.com/blog/generating-open-graph-images-for-astro/?utm_source=chatgpt.com "How I generate Open Graph images for my Astro-based blog"
[9]: https://docs.astro.build/en/recipes/rss/?utm_source=chatgpt.com "Add an RSS feed - Astro Docs"
[10]: https://vercel.com/docs/headers/cache-control-headers?utm_source=chatgpt.com "Cache-Control headers"
[11]: https://utteranc.es/?utm_source=chatgpt.com "utterances"
