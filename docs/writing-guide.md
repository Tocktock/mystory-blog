# Writing Guide

이 문서는 `지용의 기록실`에 새 글을 추가할 때 따라갈 기준입니다.

이 사이트는 기술 블로그라기보다 개인 기록실입니다. 글은 기술, 생각, 일상, 프로젝트, 만냥구름을 한곳에 모으되, 각 글이 어떤 책장에 꽂히는지 명확해야 합니다.

## 빠른 순서

1. 글의 성격을 정한다.
   - 큰 책장: `category`
   - 이어지는 묶음: `series`
   - 시리즈 안 읽는 순서: `seriesOrder`
2. `src/content/blog/<topic>/<slug>.md` 또는 `.mdx`를 만든다.
3. frontmatter를 먼저 채운다.
4. 본문은 `# 제목`으로 시작한다.
5. hero 이미지가 있으면 `src/assets/heroes/`에 넣고 `heroImage`로 연결한다.
6. 작성 후 `npm run check`와 `npm run build`를 실행한다.

## 파일 위치와 slug

글은 항상 아래 경로에 둡니다.

```text
src/content/blog/<topic>/<slug>.md
src/content/blog/<topic>/<slug>.mdx
```

예시:

```text
src/content/blog/ai/agent-debugging-note.md
src/content/blog/running/second-half-marathon-prep.md
src/content/blog/manyang-gureum/window-observation.md
```

route는 파일 경로에서 자동으로 만들어집니다.

```text
src/content/blog/ai/agent-debugging-note.md
→ /records/ai/agent-debugging-note/
```

한 번 공개한 slug는 되도록 바꾸지 않습니다. slug를 바꾸면 기존 링크, RSS, 검색 색인, OG 이미지 경로가 모두 달라집니다.

## 기본 frontmatter

새 글은 아래 구조를 기준으로 시작합니다.

```yaml
---
title: '글 제목'
pubDate: 2026-05-10
description: '검색, 목록, RSS, OG에 쓰일 한두 문장 요약입니다.'
heroImage: '../../../assets/heroes/example.jpeg'
lang: 'ko'
category: 'tech'
series: 'ai-agent-lab'
seriesOrder: 1
tags:
  - ai
  - agent
  - backend
---
```

필수 필드:

| Field | Required | 설명 |
|---|---:|---|
| `title` | yes | 글 제목입니다. 목록, 상세, OG에 사용됩니다. |
| `pubDate` | yes | 발행일입니다. `YYYY-MM-DD` 형식을 권장합니다. |
| `description` | yes | 목록 카드와 SEO에 쓰이는 짧은 요약입니다. |

선택 필드:

| Field | 설명 |
|---|---|
| `updatedDate` | 글을 의미 있게 수정한 날짜입니다. |
| `heroImage` | 글 대표 이미지입니다. `src/content/blog/**` 기준 상대 경로로 씁니다. |
| `lang` | `ko` 또는 `en`입니다. 생략하면 기본 한국어 흐름으로 봅니다. |
| `tags` | 태그 목록입니다. 생략하면 빈 배열로 처리됩니다. |
| `category` | 큰 책장입니다. 생략하면 `thought`로 들어갑니다. |
| `series` | 시리즈 slug입니다. 독립 글이면 생략할 수 있습니다. |
| `seriesOrder` | 시리즈 안에서 읽는 순서입니다. `series`가 있을 때만 씁니다. |

## Category 선택 기준

`category`는 글이 꽂히는 큰 책장입니다. 현재 허용값은 아래 다섯 개뿐입니다.

| category | 쓸 때 |
|---|---|
| `tech` | AI, Backend, Agent, DevOps, DB, Spring, Kotlin처럼 기술 중심인 글 |
| `life` | 러닝, 건강, 습관, 생활 변화처럼 일상과 몸에 가까운 글 |
| `thought` | 회고, 리더십, 개발문화, 일하는 방식, 관찰과 생각 정리 |
| `project` | 직접 만들거나 실험한 프로젝트, 블로그 제작기, 도구 제작기 |
| `cats` | 만냥이와 구름이 관련 기록 |

판단이 애매하면 아래 기준을 씁니다.

| 질문 | 선택 |
|---|---|
| 읽는 사람이 기술 문제 해결을 기대하나? | `tech` |
| 직접 만든 산출물이나 실험 과정이 중심인가? | `project` |
| 업무 방식, 태도, 문화, 회고가 중심인가? | `thought` |
| 몸과 생활 루틴이 중심인가? | `life` |
| 만냥구름이 본문 주제인가? | `cats` |

## Series 선택 기준

`series`는 이어서 읽히는 기록 묶음입니다. 단발성 글이면 생략해도 됩니다.

현재 시리즈:

| series | 제목 | category |
|---|---|---|
| `ai-working-notes` | AI와 일하는 방식 | `thought` |
| `ai-agent-lab` | AI Agent 실험실 | `tech` |
| `backend-notes` | Backend 설계 노트 | `tech` |
| `spring-backend-notes` | Spring Backend 노트 | `tech` |
| `spring-persistence` | Spring Persistence 정리 | `tech` |
| `mysql-to-postgres` | MySQL에서 PostgreSQL로 | `tech` |
| `kotlin-notes` | Kotlin 노트 | `tech` |
| `kotlin-mapper-lab` | Kotlin Mapper 실험실 | `project` |
| `devops-lab` | DevOps 실험실 | `tech` |
| `record-room-making` | 기록실을 만드는 기록 | `project` |
| `solve-again` | 문제를 다시 푸는 법 | `thought` |
| `running-log` | 달리는 기록 | `life` |
| `manyang-gureum-log` | 만냥구름 관찰일지 | `cats` |

새 시리즈가 필요하면 `src/data/series.ts`에 먼저 추가합니다.

```ts
'new-series-slug': {
  slug: 'new-series-slug',
  title: '새 시리즈 제목',
  description: '이 시리즈가 모으는 기록의 설명',
  category: 'tech',
},
```

그 다음 글 frontmatter에 연결합니다.

```yaml
category: 'tech'
series: 'new-series-slug'
seriesOrder: 1
```

주의할 점:

- `series`의 `category`와 글의 `category`는 되도록 맞춥니다.
- `seriesOrder`는 1부터 시작합니다.
- 시리즈 중간에 끼워 넣을 글이 생기면 기존 order를 조정해도 됩니다.
- 같은 시리즈 안에서 `seriesOrder`가 겹치지 않게 합니다.

## Tags 작성 기준

태그는 글을 다시 찾기 위한 색인입니다. 너무 많이 달지 않습니다.

권장:

```yaml
tags:
  - ai
  - agent
  - backend
```

기준:

- 2-5개 정도만 씁니다.
- 카테고리와 완전히 같은 의미의 태그만 반복하지 않습니다.
- 기술명, 문제 영역, 글의 맥락을 섞습니다.
- 한글 태그도 가능하지만, 기존 태그와 검색성을 고려합니다.

예시:

| 글 | tags |
|---|---|
| AI 업무 회고 | `ai`, `leadership`, `writing` |
| Spring 검증 글 | `spring`, `validation`, `backend` |
| 러닝 회고 | `running`, `marathon`, `habit` |
| 만냥구름 관찰 | `manyang-gureum`, `manyang`, `observation` |

## Hero 이미지

가능하면 글마다 대표 이미지를 둡니다. 이 사이트는 기록실, 사진첩, 노트의 분위기를 쓰므로 실제 사진이나 따뜻한 톤의 이미지를 우선합니다.

이미지는 보통 여기에 둡니다.

```text
src/assets/heroes/<slug>.<ext>
```

frontmatter에서는 글 파일 위치 기준 상대 경로를 씁니다.

```yaml
heroImage: '../../../assets/heroes/marathon-1.jpeg'
```

이미지가 없으면 placeholder가 사용됩니다. 다만 홈, 기록 목록, 시리즈 경험을 생각하면 중요한 글에는 hero 이미지를 넣는 것이 좋습니다.

이미지 기준:

- 실제 순간을 보여주는 사진이 가장 좋습니다.
- 어둡고 흐린 분위기용 이미지는 피합니다.
- 기술 글도 너무 SaaS 배너처럼 만들지 않습니다.
- pure blue/purple AI gradient 이미지는 피합니다.
- 만냥구름 글은 캡션으로 설명할 수 있는 사진을 우선합니다.

사진을 16:9로 정리해야 할 때는 기존 스크립트를 사용할 수 있습니다.

```bash
npm run hero:photo -- --input ~/Downloads/photo.jpg --slug my-post-hero --width 1280
```

이 스크립트가 로컬 환경에서 실패하면 이미지를 직접 `src/assets/heroes/`에 넣어도 됩니다.

## 본문 구조

본문은 너무 딱딱한 기술 문서처럼만 쓰지 않습니다. 문제, 경험, 판단, 배움을 기록하는 흐름을 권장합니다.

기본 구조:

```md
# 글 제목

짧은 도입. 왜 이 기록을 남기는지 먼저 씁니다.

## 문제 또는 배경

무슨 일이 있었는지 씁니다.

## 시도한 것

시행착오, 판단 기준, 실패한 접근을 씁니다.

## 배운 것

다음에 다시 볼 사람이 가져갈 결론을 씁니다.

## 다음에 할 것

후속 글이나 남은 질문이 있으면 짧게 남깁니다.
```

기술 글이라면 아래를 추가합니다.

```md
## 환경

- Language:
- Framework:
- Database:
- Runtime:

## 재현 방법

## 해결 방법

## 검증
```

회고 글이라면 아래 흐름이 잘 맞습니다.

```md
## 그때의 판단

## 실제로 벌어진 일

## 틀렸던 가정

## 지금 다시 한다면
```

## 글 톤

지용의 기록실 글은 아래 톤을 기본으로 합니다.

좋은 방향:

- 내가 실제로 겪은 장면에서 시작하기
- 문제를 너무 멋있게 포장하지 않기
- 실패와 판단 근거를 같이 남기기
- 독자가 다음에 다시 써먹을 수 있는 결론을 남기기
- 기술 글에서도 사람의 판단과 맥락을 지우지 않기

피할 것:

- 회사 블로그 같은 홍보 문장
- 너무 일반적인 개발 블로그 서론
- AI가 쓴 것처럼 보이는 과장된 표현
- 제목만 거창하고 경험이 없는 글
- 모든 글을 만냥구름 농담으로 끝내기

## 만냥구름 글 기준

만냥구름 글은 `category: 'cats'`를 씁니다.

관찰일지 시리즈라면 아래처럼 연결합니다.

```yaml
category: 'cats'
series: 'manyang-gureum-log'
seriesOrder: 1
tags:
  - manyang-gureum
  - manyang
  - observation
```

본문은 사진첩처럼 짧아도 됩니다. 다만 사진만 올리기보다 그 순간을 왜 남기는지 한두 문장으로 기록합니다.

```md
# 만냥이가 창밖을 오래 보는 이유

창밖을 보는 시간이 길어질수록, 나는 만냥이가 무엇을 기다리는지보다 내가 무엇을 놓치고 있는지 더 궁금해졌다.

## 오늘의 장면

## 관찰한 것

## 남은 생각
```

## 작성 전 체크리스트

- [ ] `title`이 목록에서 봐도 의미가 분명하다.
- [ ] `description`이 한두 문장으로 글의 이유를 설명한다.
- [ ] `category`가 다섯 값 중 하나다.
- [ ] `series`가 있다면 `src/data/series.ts`에 존재한다.
- [ ] `seriesOrder`가 양의 정수다.
- [ ] `tags`가 너무 많지 않다.
- [ ] hero 이미지 경로가 실제로 존재한다.
- [ ] 본문 첫 heading이 글 제목과 자연스럽게 맞는다.

## 발행 전 검증

최소 검증:

```bash
npm run check
npm run build
```

가능하면 추가:

```bash
npm run lint
npm run test:e2e
```

브라우저에서 확인할 페이지:

```text
/records
/records/<topic>/<slug>
/categories/<category>
/series/<series>
/tags/<tag>
/rss.xml
```

검색은 build 후 생성된 Pagefind 색인이 필요합니다. 검색 페이지를 확인하려면 `npm run build` 이후 preview에서 봅니다.

## 예시

### AI/업무 방식 글

```yaml
---
title: 'AI와 일하면서 놓치기 쉬운 책임'
pubDate: 2026-05-10
description: 'AI가 개발 속도를 높이는 시대에 엔지니어가 어떤 판단을 계속 책임져야 하는지 정리한 글입니다.'
lang: 'ko'
category: 'thought'
series: 'ai-working-notes'
seriesOrder: 3
tags:
  - ai
  - leadership
  - engineering
---
```

### 기술 문제 해결 글

```yaml
---
title: 'Agent 작업 큐를 다시 설계하며 배운 것'
pubDate: 2026-05-10
description: 'Agent 작업 큐에서 실패 재시도와 상태 전이를 정리하며 배운 설계 기준입니다.'
lang: 'ko'
category: 'tech'
series: 'ai-agent-lab'
seriesOrder: 1
tags:
  - ai
  - agent
  - backend
---
```

### 러닝/일상 글

```yaml
---
title: '두 번째 하프를 준비하면서 바꾼 루틴'
pubDate: 2026-05-10
description: '첫 하프 이후 훈련 루틴을 어떻게 조정했는지 남긴 기록입니다.'
heroImage: '../../../assets/heroes/second-half-marathon.jpeg'
lang: 'ko'
category: 'life'
series: 'running-log'
seriesOrder: 2
tags:
  - running
  - marathon
  - habit
---
```

