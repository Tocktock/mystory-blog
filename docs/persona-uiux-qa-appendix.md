# JiYong Persona UI/UX QA Appendix

Status: compact committed evidence manifest.
Date: 2026-07-04

This appendix preserves the review-relevant output from local QA without committing bulky generated assets under `dist/`, `.reports/`, or `output/`. Full screenshots and reports remain local ignored artifacts; this file is the committed summary reviewers can inspect in Git.

## Command Evidence

| Command                                                                            | Observed Result                                                                                                                                                                   | Evidence Label                       |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `npm run check`                                                                    | `Result (94 files): 0 errors, 0 warnings, 0 hints`                                                                                                                                | Verified                             |
| `npm run lint`                                                                     | `eslint . --ext .ts,.tsx,.astro --max-warnings=0` exited 0                                                                                                                        | Verified                             |
| `git diff --check`                                                                 | exited 0 with no whitespace errors                                                                                                                                                | Verified                             |
| `npm run build`                                                                    | 138 static pages built; Pagefind indexed 138 pages and 13,756 words                                                                                                               | Verified                             |
| `npm run test:e2e -- --project=chromium`                                           | 30 Chromium tests passed in 21.9s                                                                                                                                                 | Verified                             |
| `npm run audit:web`                                                                | ran `npm run build`, publication safety, static links, Lighthouse, axe, keyboard, responsive, and link checks                                                                     | Verified                             |
| `PERSONA_PRODUCTION_BASE_URL=http://127.0.0.1:4321 npm run audit:production-smoke` | local-preview harness checked 11 routes, 176 critical assets, 2 Pagefind assets, acceptable Giscus placeholder, and 0 issues                                                      | Verified local harness only          |
| `PERSONA_PRODUCTION_BASE_URL=https://ji-yong.com npm run audit:production-smoke`   | current live domain checked 11 routes and assets, but failed 6 required persona-text checks                                                                                       | Human/external verification required |
| `npm run audit:persona-contract`                                                   | 13 source requirements, 17 source scenarios, 10 backlog slices, 10 slice contracts, 13 completion-audit requirement references, 17 completion-audit scenario references, 0 issues | Verified                             |
| `npm run audit:axe`                                                                | 11 routes checked; expected statuses matched; 0 violations detected                                                                                                               | Verified                             |
| `npm run audit:keyboard`                                                           | 3 routes checked; 36 visible focus stops; 0 invisible stops; 0 missing focus indicators                                                                                           | Verified                             |
| `npm run audit:publication-safety`                                                 | 180 files scanned; 0 blocked publication paths; 0 disallowed secret-like tokens; 31 documented public env references                                                              | Verified                             |
| `npm run audit:responsive`                                                         | 66 screenshots across 11 routes and 6 widths; 0 status/text/overflow issues                                                                                                       | Verified                             |
| `npm run audit:static-links`                                                       | 138 generated HTML files; 4,533 static local references; 0 broken                                                                                                                 | Verified                             |
| `npm audit --omit=dev`                                                             | 0 vulnerabilities                                                                                                                                                                 | Verified                             |
| `.github/workflows/ci.yml`                                                         | push trigger includes `master` and `main`; `pull_request` remains enabled                                                                                                         | Verified                             |

Important boundary: these are local command/config results. The production-smoke evidence above proves only the harness against local preview; it does not prove GitHub-hosted CI execution, human persona acceptance, deployment success, CDN behavior, or production search.

Live-domain boundary: the `https://ji-yong.com` smoke attempt proves only the current public site state. It failed required persona-text checks, so it does not prove this branch is deployed or production-ready.

## Responsive Screenshot Manifest

Source summary: `.reports/responsive/report.json`.

| Metric                   | Result                         |
| ------------------------ | ------------------------------ |
| Screenshot count         | 66                             |
| Route count              | 11                             |
| Widths                   | 360, 390, 430, 768, 1024, 1440 |
| Missing screenshots      | 0                              |
| Measured overflow issues | 0                              |
| Missing text checks      | 0                              |
| Status mismatches        | 0                              |

Routes captured at every listed width:

| Route label          | Path                                             | Screenshot file pattern                                                                                 |
| -------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| home                 | `/`                                              | `.reports/responsive/screenshots/0360-home.png` through `1440-home.png`                                 |
| records              | `/records/`                                      | `.reports/responsive/screenshots/0360-records.png` through `1440-records.png`                           |
| series               | `/series/`                                       | `.reports/responsive/screenshots/0360-series.png` through `1440-series.png`                             |
| series-detail        | `/series/ai-working-notes/`                      | `.reports/responsive/screenshots/0360-series-detail.png` through `1440-series-detail.png`               |
| record-detail-new    | `/records/meta/ai-advisor-writing-partner/`      | `.reports/responsive/screenshots/0360-record-detail-new.png` through `1440-record-detail-new.png`       |
| record-detail-legacy | `/records/kubernetes-on-mac/k3s-with-multipass/` | `.reports/responsive/screenshots/0360-record-detail-legacy.png` through `1440-record-detail-legacy.png` |
| about                | `/about/`                                        | `.reports/responsive/screenshots/0360-about.png` through `1440-about.png`                               |
| career               | `/career/`                                       | `.reports/responsive/screenshots/0360-career.png` through `1440-career.png`                             |
| manyang              | `/manyang-gureum/`                               | `.reports/responsive/screenshots/0360-manyang.png` through `1440-manyang.png`                           |
| search               | `/search/?q=kubernetes`                          | `.reports/responsive/screenshots/0360-search.png` through `1440-search.png`                             |
| not-found            | `/missing-record-drawer-for-i09/`                | `.reports/responsive/screenshots/0360-not-found.png` through `1440-not-found.png`                       |

Responsive verifier command: `npm run audit:responsive` against a running preview. The script shares the persona audit route list with the axe audit, checks expected route status, verifies route-specific visible text, captures a screenshot for each route-width pair, and fails on any measured horizontal overflow.

## Accessibility, Performance, and Link Reports

Source reports: `.reports/lighthouse/report.report.json`, `.reports/axe/report.json`, `.reports/keyboard/report.json`, `.reports/persona-contract/report.json`, `.reports/production-smoke/report.json`, `.reports/publication-safety/report.json`, `.reports/responsive/report.json`, `.reports/static-links/report.json`, `.reports/linkinator/report.json`, and `output/playwright/i09-final-qa-20260704/axe-summary.json`.

| Check                                    | Result                        | Evidence Label                       |
| ---------------------------------------- | ----------------------------- | ------------------------------------ |
| Lighthouse URL                           | `http://127.0.0.1:4321/`      | Verified                             |
| Lighthouse fetch time                    | `2026-07-04T09:21:23.455Z`    | Verified                             |
| Lighthouse performance                   | 100                           | Verified                             |
| Lighthouse accessibility                 | 100                           | Verified                             |
| Lighthouse SEO                           | 100                           | Verified                             |
| axe route count                          | 11                            | Verified                             |
| axe violation count                      | 0                             | Verified                             |
| axe route statuses                       | all expected statuses matched | Verified                             |
| axe status mismatches                    | 0                             | Verified                             |
| Publication safety scanned files         | 180                           | Verified                             |
| Publication safety blocked paths         | 0                             | Verified                             |
| Publication safety disallowed findings   | 0                             | Verified                             |
| Static local HTML files                  | 138                           | Verified                             |
| Static local references                  | 4,533                         | Verified                             |
| Static local broken references           | 0                             | Verified                             |
| Linkinator total links                   | 694                           | Verified                             |
| Linkinator OK                            | 367                           | Verified                             |
| Linkinator skipped external/non-preview  | 327                           | Verified                             |
| Linkinator broken                        | 0                             | Verified                             |
| Production-smoke route count             | 11                            | Verified local harness only          |
| Production-smoke critical assets         | 176                           | Verified local harness only          |
| Production-smoke broken assets           | 0                             | Verified local harness only          |
| Production-smoke Pagefind assets         | 2                             | Verified local harness only          |
| Live-domain route text issues            | 6                             | Human/external verification required |
| Persona-contract source requirements     | 13                            | Verified                             |
| Persona-contract completion requirements | 13                            | Verified                             |
| Persona-contract completion scenarios    | 17                            | Verified                             |

axe target routes:

- `/`
- `/records/`
- `/series/`
- `/series/ai-working-notes/`
- `/records/meta/ai-advisor-writing-partner/`
- `/records/kubernetes-on-mac/k3s-with-multipass/`
- `/about/`
- `/career/`
- `/manyang-gureum/`
- `/search/?q=kubernetes`
- `/missing-record-drawer-for-i09/` with expected 404 status

## Keyboard and Navigation Evidence

Source summary: `.reports/keyboard/report.json` plus `tests/e2e/navigation.spec.ts`.

| Surface                     | Result                                               | Evidence Label |
| --------------------------- | ---------------------------------------------------- | -------------- |
| Home keyboard spot check    | 12 visible focus stops                               | Verified       |
| Records keyboard spot check | 12 visible focus stops                               | Verified       |
| Search keyboard spot check  | 12 visible focus stops                               | Verified       |
| Invisible focus stops       | 0                                                    | Verified       |
| Missing focus indicators    | 0                                                    | Verified       |
| Search input label          | JS Pagefind input and no-JS fallback expose `검색어` | Verified       |
| Mobile collapsed nav        | hidden links are not focusable while collapsed       | Verified       |
| Mobile opened nav           | links become visible and focusable after menu opens  | Verified       |
| Theme toggle                | dark mode can be selected and persists after reload  | Verified       |

The mobile nav regression is covered by `collapsed mobile navigation keeps hidden links out of focus order` in `tests/e2e/navigation.spec.ts`.

## Feed and SEO Regression Evidence

| Surface          | Result                                                                                            | Evidence Label |
| ---------------- | ------------------------------------------------------------------------------------------------- | -------------- |
| Sitemap          | canonical record URLs are present; legacy `/blog/` and `/cat-pics/` URLs are absent               | Verified       |
| RSS feed         | `/rss.xml` publishes canonical `/records/` links and does not publish legacy `/blog/` links       | Verified       |
| RSS feed title   | feed title remains `지용의 기록실`                                                                | Verified       |
| Dark-mode script | theme toggle sets `data-theme="dark"`, updates ARIA state, stores preference, and survives reload | Verified       |

## Remaining Non-Local Gates

- Human/external verification required: JiYong first-viewport identity and emotional fit.
- Human/external verification required: design token, typography, warmth, and technical-credibility balance.
- Human/external verification required: optional record metadata schema review before broad content migration.
- Human/external verification required: deterministic visual and first-viewport asset direction.
- Human/external verification required: vocabulary, series shelf copy, About copy, career privacy/credibility, and 만냥구름 tone.
- Human/external verification required: deployment URL behavior, `PERSONA_PRODUCTION_BASE_URL=https://<deployed-url> npm run audit:production-smoke`, CDN/static assets, production search, and public-release approval.
