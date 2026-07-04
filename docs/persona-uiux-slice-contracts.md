# JiYong Persona UI/UX Slice Contracts

Status: local contract and checkpoint register.
Date: 2026-07-04

This register maps the generated persona UI/UX backlog to the implementation branch. It is not a replacement for the release evidence packet in `docs/persona-uiux-release-evidence.md`; it records the per-slice contract the user requested: goal, included scenarios, non-scope, touched surfaces, proof needed, done criteria, checkpoint, and remaining human gates.

Evidence labels:

- Verified: proven by local files, command output, generated reports, or screenshots.
- Specified: required by the generated planning artifacts.
- Human/external verification required: cannot be proven by local automation.
- Unverified: not currently proven.

## I-00 - Baseline and Slice Contract

Goal: establish the baseline before persona-centered edits and freeze the delivery model.

Included scenarios: SC-016, plus baseline support for all later scenarios.

Non-scope: no product-code redesign, no production deployment, no human persona approval.

Files/surfaces touched: `docs/persona-uiux-release-evidence.md`, `docs/persona-uiux-human-review-notes.md`, ignored local screenshots/reports under `output/` and `.reports/`.

Proof needed: baseline commands, screenshot set, decision notes, and explicit human gates.

Done criteria: local evidence is separated from human/external gates and generated artifacts remain the source references.

Checkpoint: Verified. The release evidence records check/lint/build/E2E/audit outcomes and screenshot/report locations. Human approval is still not recorded.

Recommendation: continue only with bounded implementation slices or ask human review before release.

## I-01 - Design Tokens, Typography, and Microcopy

Goal: make the shared UI language warmer, systematic, Korean-first, and specific to JiYong before page-level changes.

Included scenarios: SC-001, SC-015, SC-016.

Non-scope: no wholesale design-system migration, no Tailwind adoption, no new production dependency.

Files/surfaces touched: `src/styles/global.css`, `src/styles/search.css`, `src/data/uiCopy.ts`, `src/components/common/EmptyState.astro`, related page copy.

Proof needed: build/type/lint pass, dark-mode preservation, no mobile overflow in reviewed screenshots, accessible empty/search copy.

Done criteria: shared tokens/copy are reusable and do not break existing routes or Pagefind search.

Checkpoint: Verified locally for automated behavior. Human/external verification required for typography, warmth, and technical-credibility balance.

Recommendation: ask human design/copy review before release.

## I-02 - Homepage First Impression

Goal: make `/` immediately read as JiYong's record room and keep mobile photo/content separation clear.

Included scenarios: SC-001, SC-002, SC-003, SC-004, SC-005, SC-016.

Non-scope: no marketing landing page, no claim that local screenshots prove subjective brand acceptance.

Files/surfaces touched: `src/pages/index.astro`, `src/components/home/HeroSection.astro`, `src/components/home/BookshelfSection.astro`, `src/components/home/RecentRecords.astro`, `tests/e2e/home.spec.ts`.

Proof needed: homepage E2E assertions, responsive screenshots at 360/390/430/768/1024/1440, no horizontal overflow, local build.

Done criteria: first viewport carries JiYong identity, Backend/AI Agent/career/record-room signals, Current Desk status, and bookshelf mental map.

Checkpoint: Verified locally for layout assertions and screenshot coverage. Human/external verification required for first-impression fit and manifesto tone.

Recommendation: ask human review of desktop and mobile first viewport.

## I-03 - Records Archive Semantics

Goal: turn the archive into intentional records with deterministic visuals and optional metadata, while preserving existing category routes.

Included scenarios: SC-006, SC-007, SC-008, SC-017.

Non-scope: no full migration of all legacy posts, no route rename, no random/AI-generated per-post cover dependency.

Files/surfaces touched: `src/content.config.ts`, `src/components/records/RecordCard.astro`, `src/data/recordTypes.ts`, `src/utils/recordCovers.ts`, `src/pages/records/index.astro`, `src/pages/categories/[slug].astro`, `src/content/blog/meta/ai-advisor-writing-partner.md`, `tests/e2e/records.spec.ts`.

Proof needed: optional frontmatter builds, legacy post fallback renders, deterministic category cover behavior, category route navigation tests.

Done criteria: new metadata improves meaning where present and old posts still build/render without required migrations.

Checkpoint: Verified locally. Human/external verification required only for whether the vocabulary and status labels feel right.

Recommendation: keep metadata optional until a deliberate content migration is chosen.

## I-04 - Series as Learning Shelves

Goal: present series as learning shelves with purpose, status, count, and preserved reading order.

Included scenarios: SC-009, SC-010, SC-016.

Non-scope: no CMS, no automatic reading-progress personalization, no new route family.

Files/surfaces touched: `src/data/series.ts`, `src/components/records/SeriesCard.astro`, `src/pages/series/index.astro`, `src/pages/series/[slug].astro`, `tests/e2e/series.spec.ts`.

Proof needed: series list/detail E2E assertions, build pass, link checks, responsive screenshots.

Done criteria: shelf purpose and order are visible while existing series routes remain stable.

Checkpoint: Verified locally for route behavior and rendering. Human/external verification required for shelf promise and wording.

Recommendation: ask human review for shelf language.

## I-05 - Article Pages as Record Documents

Goal: make article detail pages feel like record documents when metadata exists while keeping older posts valid.

Included scenarios: SC-011, SC-017, SC-016.

Non-scope: no article body rewrites, no hard requirement that every post receive record metadata.

Files/surfaces touched: `src/layouts/BlogPost.astro`, `src/components/records/RecordSummary.astro`, `tests/e2e/record-summary.spec.ts`.

Proof needed: sample render for a new-metadata post, sample render for legacy technical/thought posts, build pass.

Done criteria: record summary is present when useful and legacy posts remain valid.

Checkpoint: Verified locally. Human/external verification required for final visual/copy tone only.

Recommendation: keep article metadata incremental.

## I-06 - About as JiYong Manual

Goal: expose JiYong principles quickly while preserving the full interview-style about content.

Included scenarios: SC-012, SC-016.

Non-scope: no replacement of the full interview with a short resume, no external validation of personality fit.

Files/surfaces touched: `src/pages/about.astro`, `tests/e2e/about.spec.ts`.

Proof needed: About E2E assertions, mobile containment, build pass, screenshot review.

Done criteria: principle cards and interview access both render without mobile overflow.

Checkpoint: Verified locally. Human/external verification required for whether the principle cards accurately represent JiYong.

Recommendation: ask JiYong to review the principle-card copy.

## I-07 - Career and Records Bridge

Goal: connect career work areas to related public records where evidence exists, without exposing private/company-sensitive detail.

Included scenarios: SC-013, SC-016.

Non-scope: no new public disclosure of internal notes, no expansion of career content beyond public-safe record links.

Files/surfaces touched: `src/data/career.ts`, `src/components/career/CompanyWork.astro`, `tests/e2e/career.spec.ts`.

Proof needed: related-record links render, narrow-mobile containment passes, local public-safety scan stays clean.

Done criteria: career proof points connect to writing without implying unverifiable private details.

Checkpoint: Verified locally for rendering. Human/external verification required for privacy and credibility boundaries.

Recommendation: require human review before publishing career-linked copy.

## I-08 - Manyang-Gureum, Empty States, Search, and 404 Tone

Goal: use 만냥구름 as warmth and observation, not decoration, and extend the record-room voice to search/empty/error states.

Included scenarios: SC-014, SC-015, SC-016.

Non-scope: no over-cute mascot system, no search-engine rewrite, no production Pagefind claim.

Files/surfaces touched: `src/data/cats.ts`, `src/data/catGallery.ts`, `src/components/cats/CatGallery.astro`, `src/pages/manyang-gureum.astro`, `src/pages/search.astro`, `src/pages/404.astro`, `tests/e2e/manyang-gureum.spec.ts`, `tests/e2e/search.spec.ts`, `tests/e2e/not-found.spec.ts`.

Proof needed: 만냥구름/search/404 E2E assertions, accessibility checks, responsive screenshots, Pagefind build output.

Done criteria: warmth appears in bounded places and generic fallback language is replaced.

Checkpoint: Verified locally for route behavior and accessibility fallback. Human/external verification required for tone boundaries.

Recommendation: ask human review of 만냥구름 and empty-state tone.

## I-09 - Final QA and Release Evidence

Goal: collect complete evidence without overclaiming.

Included scenarios: all applicable MUST_PASS and REGRESSION scenarios.

Non-scope: no production readiness claim, no deployment claim, no human approval claim, no dependency-upgrade detour for dev-only audit findings.

Files/surfaces touched: `docs/persona-uiux-release-evidence.md`, `docs/persona-uiux-human-review-notes.md`, `docs/persona-uiux-qa-appendix.md`, `docs/persona-uiux-pr-draft.md`, `.github/workflows/ci.yml`, `scripts/audit/run-axe-check.mjs`, `scripts/audit/run-link-check.mjs`, `.gitignore`, ignored generated outputs under `output/` and `.reports/`.

Proof needed: `npm run check`, `npm run lint`, `npm run build`, `npm run test:e2e`, `npm run audit:web`, responsive screenshots, axe/Lighthouse/link reports, keyboard spot check, CI trigger/default-branch alignment, public-safety/diff-scope checks, human review notes.

Done criteria: every selected scenario has traceable implementation evidence, all remaining gates are explicit, and local evidence is not described as deployment or human approval.

Checkpoint: Verified locally and review-ready. CI push triggers include the current default branch `master`; GitHub-hosted CI execution still requires a pushed branch/PR. Human/external verification required before release.

Recommendation: ask human review before release; open a draft PR only after explicit publication approval.

## Current Aggregate Verdict

Verified locally: implementation, automated checks, local accessibility/link/performance audits, responsive screenshot coverage, and evidence packet.

Human/external verification required: JiYong first-impression fit, final copy/tone, vocabulary, career privacy/credibility, 만냥구름 tone, deployment URL behavior, CDN/static assets, and production search.

Verdict: review-ready locally, not production-ready.
