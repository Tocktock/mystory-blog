# JiYong Persona UI/UX QA Appendix

Status: compact committed evidence manifest.
Date: 2026-07-04

This appendix preserves the review-relevant output from local QA without committing bulky generated assets under `dist/`, `.reports/`, or `output/`. Full screenshots and reports remain local ignored artifacts; this file is the committed summary reviewers can inspect in Git.

## Command Evidence

| Command                                  | Observed Result                                                                  | Evidence Label |
| ---------------------------------------- | -------------------------------------------------------------------------------- | -------------- |
| `npm run check`                          | `Result (87 files): 0 errors, 0 warnings, 0 hints`                               | Verified       |
| `npm run lint`                           | `eslint . --ext .ts,.tsx,.astro --max-warnings=0` exited 0                       | Verified       |
| `git diff --check`                       | exited 0 with no whitespace errors                                               | Verified       |
| `npm run build`                          | 138 static pages built; Pagefind indexed 138 pages and 13,756 words              | Verified       |
| `npm run test:e2e -- --project=chromium` | 28 Chromium tests passed in 21.7s                                                | Verified       |
| `npm run audit:web`                      | ran `npm run build` before preview, then Lighthouse, axe, and link checks passed | Verified       |
| `npm audit --omit=dev`                   | 0 vulnerabilities                                                                | Verified       |

Important boundary: these are local command results. They do not prove human persona acceptance, deployment success, CDN behavior, or production search.

## Responsive Screenshot Manifest

Source summary: `output/playwright/i09-final-qa-20260704/responsive-screenshot-summary.json`.

| Metric                   | Result                         |
| ------------------------ | ------------------------------ |
| Screenshot count         | 66                             |
| Route count              | 11                             |
| Widths                   | 360, 390, 430, 768, 1024, 1440 |
| Missing screenshots      | 0                              |
| Measured overflow issues | 0                              |
| Missing text checks      | 0                              |

Routes captured at every listed width:

| Route label          | Path                                             | Screenshot file pattern                                                 |
| -------------------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| home                 | `/`                                              | `0360-home.png` through `1440-home.png`                                 |
| records              | `/records/`                                      | `0360-records.png` through `1440-records.png`                           |
| series               | `/series/`                                       | `0360-series.png` through `1440-series.png`                             |
| series-detail        | `/series/ai-working-notes/`                      | `0360-series-detail.png` through `1440-series-detail.png`               |
| record-detail-new    | `/records/meta/ai-advisor-writing-partner/`      | `0360-record-detail-new.png` through `1440-record-detail-new.png`       |
| record-detail-legacy | `/records/kubernetes-on-mac/k3s-with-multipass/` | `0360-record-detail-legacy.png` through `1440-record-detail-legacy.png` |
| about                | `/about/`                                        | `0360-about.png` through `1440-about.png`                               |
| career               | `/career/`                                       | `0360-career.png` through `1440-career.png`                             |
| manyang              | `/manyang-gureum/`                               | `0360-manyang.png` through `1440-manyang.png`                           |
| search               | `/search/?q=kubernetes`                          | `0360-search.png` through `1440-search.png`                             |
| not-found            | `/missing-record-drawer-for-i09/`                | `0360-not-found.png` through `1440-not-found.png`                       |

Representative home metric rows confirmed `h1: 지용의 기록실`, `Backend와 AI Agent 실험`, and `기록실 책장` at 360, 390, and 430 widths with `pageOverflow: 0`.

## Accessibility, Performance, and Link Reports

Source reports: `.reports/lighthouse/report.report.json`, `.reports/axe/report.json`, `.reports/linkinator/report.json`, and `output/playwright/i09-final-qa-20260704/axe-summary.json`.

| Check                                   | Result                     | Evidence Label |
| --------------------------------------- | -------------------------- | -------------- |
| Lighthouse URL                          | `http://127.0.0.1:4321/`   | Verified       |
| Lighthouse fetch time                   | `2026-07-04T07:46:49.725Z` | Verified       |
| Lighthouse performance                  | 100                        | Verified       |
| Lighthouse accessibility                | 100                        | Verified       |
| Lighthouse SEO                          | 100                        | Verified       |
| axe route count                         | 11                         | Verified       |
| axe violation count                     | 0                          | Verified       |
| Linkinator total links                  | 694                        | Verified       |
| Linkinator OK                           | 367                        | Verified       |
| Linkinator skipped external/non-preview | 327                        | Verified       |
| Linkinator broken                       | 0                          | Verified       |

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

Source summary: `output/playwright/i09-final-qa-20260704/keyboard-focus-spot-check.json` plus `tests/e2e/navigation.spec.ts`.

| Surface                     | Result                                              | Evidence Label |
| --------------------------- | --------------------------------------------------- | -------------- |
| Home keyboard spot check    | 12 visible focus stops                              | Verified       |
| Records keyboard spot check | 12 visible focus stops                              | Verified       |
| Search keyboard spot check  | 12 visible focus stops                              | Verified       |
| Mobile collapsed nav        | hidden links are not focusable while collapsed      | Verified       |
| Mobile opened nav           | links become visible and focusable after menu opens | Verified       |

The mobile nav regression is covered by `collapsed mobile navigation keeps hidden links out of focus order` in `tests/e2e/navigation.spec.ts`.

## Remaining Non-Local Gates

- Human/external verification required: JiYong first-viewport identity and emotional fit.
- Human/external verification required: design token, typography, warmth, and technical-credibility balance.
- Human/external verification required: optional record metadata schema review before broad content migration.
- Human/external verification required: deterministic visual and first-viewport asset direction.
- Human/external verification required: vocabulary, series shelf copy, About copy, career privacy/credibility, and 만냥구름 tone.
- Human/external verification required: deployment URL behavior, CDN/static assets, production search, and public-release approval.
