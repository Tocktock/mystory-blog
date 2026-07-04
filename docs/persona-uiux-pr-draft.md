# PR Draft: Implement JiYong Persona-Centered Record Room UI

Status: merged to `master`, deployed by Vercel, and production verified.

Base branch: `master`

Head branch: `codex/jiyong-persona-uiux`

## Summary

This branch implements the JiYong persona-centered UI/UX plan for `지용의 기록실` as a verified release. The site now frames itself around JiYong's record room: Backend, AI/Agent work, problem-solving records, career proof, reflective notes, and 만냥구름.

The implementation preserves the existing Astro static-site structure and keeps new record metadata optional so legacy posts continue to build and render. JiYong approved and accepted the current persona/UI direction on 2026-07-04; production deployment verification passed after the `master` deploy.

## Main Changes

- Reworked the homepage first impression around `지용의 기록실`, Current Desk, shelves, recent records, and 만냥구름.
- Added shared persona UI copy, record types, deterministic record/category visual helpers, and reusable record/series components.
- Reframed records, categories, series, article detail pages, About, Career, 만냥구름, search, and 404 around the record-room model.
- Added optional content metadata for record intent without forcing a migration across legacy posts.
- Added a release evidence packet, human review notes, and slice contract register.
- Hardened local QA by making `npm run audit:web` build before preview.
- Fixed collapsed mobile navigation so hidden links are not keyboard-focusable, with a Playwright regression test.
- Verified that Vercel, not the GitHub Actions CI branch filter, creates Production deployments for default-branch commits; the current production/default branch is `master`.
- Added E2E regressions for canonical RSS record links and persisted dark-mode toggling.
- Tightened search accessibility assertions and made the axe audit fail on unexpected route statuses.
- Added a reproducible responsive audit that captures the required 11-route x 6-width screenshot matrix.
- Added a reproducible keyboard audit for visible focus stops and visible focus indicators on home, records, and search.
- Added reproducible publication safety and static local link audits to replace manual release-evidence rows.
- Added an optional production-smoke audit for deployed route/status/text/static-asset/Pagefind/Giscus checks once `PERSONA_PRODUCTION_BASE_URL` is set.
- Recorded JiYong's 2026-07-04 human approval in the release evidence and human review notes.
- Verified the deployed production site on `https://ji-yong.com`.

## Verification

Verified locally on 2026-07-04:

- `npm run check`
  - 94 files, 0 errors, 0 warnings, 0 hints
- `npm run lint`
  - passed with `--max-warnings=0`
- `git diff --check`
  - passed
- `npm run build`
  - 138 static pages built
  - Pagefind indexed 138 pages and 13,756 words
- `npm run test:e2e -- --project=chromium`
  - 30 Chromium tests passed
- `npm run audit:web`
  - runs a fresh build before preview
  - publication safety: 180 files scanned, 0 blocked publication paths, 0 disallowed secret-like tokens
  - static local links: 138 generated HTML files, 4,533 static local references, 0 broken
  - Lighthouse on `/`: performance 100, accessibility 100, SEO 100
  - axe: 11 routes checked, expected statuses matched, 0 violations
  - keyboard: 3 routes checked, 36 visible focus stops, 0 invisible stops, 0 missing focus indicators
  - responsive: 66 screenshots across 11 routes and 6 widths, 0 status/text/overflow issues
  - same-origin link crawl: 694 links checked/skipped, 0 broken
- `npm run audit:persona-contract`
  - 13 source requirements, 17 source scenarios, 11 human-required source scenarios preserved, 10 backlog slices, 10 slice contracts, 17 human-review scenario references, 10 human-review anchors, 13 completion-audit requirement references, 17 completion-audit scenario references, 0 traceability issues
- `PERSONA_PRODUCTION_BASE_URL=http://127.0.0.1:4321 npm run audit:production-smoke`
  - local-preview harness checked 11 routes, 176 critical assets, 2 Pagefind assets, acceptable Giscus placeholder, and 0 issues
- `PERSONA_PRODUCTION_BASE_URL=https://ji-yong.com npm run audit:production-smoke`
  - public domain checked 11 routes, 176 critical assets, 2 Pagefind assets, configured Giscus, and 0 issues
- `npm run audit:keyboard`
  - 3 routes checked
  - 36 visible focus stops, 0 invisible stops, 0 missing focus indicators
- `npm run audit:responsive`
  - 66 screenshots across 11 routes and 6 widths
  - 0 status/text/overflow issues
- `npm run audit:publication-safety`
  - 180 files scanned, 0 blocked publication paths, 0 disallowed secret-like tokens, 31 documented public env references
- `npm run audit:static-links`
  - 138 generated HTML files, 4,533 static local references, 0 broken
- `npm audit --omit=dev`
  - 0 vulnerabilities
- `.github/workflows/ci.yml`
  - push trigger includes `main`; `pull_request` remains enabled
  - production deployment proof comes from Vercel GitHub deployment records for `master`, not this CI trigger
- GitHub deployment records
  - repository default branch is `master`
  - recent `Production` deployments are created by `vercel[bot]` for `origin/master` commits
  - Vercel created a `Production` deployment for the pushed `master` commit, and production smoke passed against `https://ji-yong.com`

Additional local evidence:

- Responsive screenshots: `npm run audit:responsive` generates 66 screenshots across 11 routes and widths 360, 390, 430, 768, 1024, and 1440.
- Persona contract traceability: `npm run audit:persona-contract` verifies the release scenario map, backlog classification, slice contract register, human-review packet, and completion audit against the generated source artifacts available in `PERSONA_UIUX_ARTIFACT_DIR`.
- Production smoke harness: `npm run audit:production-smoke` verifies route/status/text/static-asset/Pagefind/Giscus surface after `PERSONA_PRODUCTION_BASE_URL` is set; passing evidence now covers both local preview and `https://ji-yong.com`.
- Live-domain smoke attempt: `https://ji-yong.com` satisfies required persona-text checks after the `master` deployment.
- Static local link check: `npm run audit:static-links` verifies 138 generated HTML files, 4,533 static local references, and 0 broken references.
- Keyboard spot check: `npm run audit:keyboard` verifies home, records, and search each produce 12 visible focus stops with visible focus indicators.
- Mobile nav regression: collapsed hidden links are not focusable until the menu opens.
- RSS/dark-mode regressions: `/rss.xml` keeps canonical `/records/` links, and the theme toggle persists after reload.
- Search accessibility regression: hydrated Pagefind input and no-JS fallback remain reachable by the `검색어` label.
- Production search regression: Playwright verified `/search/?q=kubernetes` hydrates Pagefind and returns 5 visible results on `https://ji-yong.com`.
- Deploy trigger config: Vercel Git integration is visible through GitHub deployment records for `master`; the pushed `master` deployment is verified.

## Evidence Docs

- `docs/persona-uiux-release-evidence.md`
- `docs/persona-uiux-qa-appendix.md`
- `docs/persona-uiux-completion-audit.md`
- `docs/persona-uiux-slice-contracts.md`
- `docs/persona-uiux-human-review-notes.md`

## Human / External Gates

These human gates are closed for the current PR scope by JiYong approval on 2026-07-04:

- JiYong first-viewport identity and emotional fit.
- Design token, typography, warmth, and technical-credibility balance.
- Optional record metadata schema approval before any broad content migration.
- Asset direction for deterministic category/record visuals and first-viewport media.
- Record type vocabulary, status labels, and series shelf language.
- About page principle-card copy.
- Career-to-record links for privacy and credibility boundaries.
- 만냥구름, search, empty-state, and 404 tone boundaries.

These deployment gates are closed by production verification on 2026-07-04:

- Deployment URL for this branch, passing production-smoke result, CDN/static asset behavior, and production search behavior.
- Confirmation that the post-merge Vercel Production deployment SHA matches the merged persona branch SHA.

## Deliberately Not Done

- Did not rewrite all legacy posts with new metadata.
- Did not replace the Astro architecture or add a CMS.
- Did not add a new production dependency.
- Did not run `npm audit fix` for dev-only moderate findings because that would widen this UI/UX slice into dependency upgrade work.
- Did not include ignored/generated outputs such as `dist/`, `.reports/`, `output/`, or the unrelated local `exports/` backup.
- Did not claim production readiness or deployment success.

## Review Recommendation

No PR action remains. Treat this release as locally verified, human-approved, merged to `master`, deployed by Vercel, and production verified.
