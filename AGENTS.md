# AGENTS.md - mystory-blog

This playbook tells any AI helper how to work inside Ji Yong's personal blog repository without surprises.

## Operating Mission
- Static Astro 5 site that hosts Ji Yong's bilingual (ko/en) blog plus a cat-photo gallery.
- Markdown/MDX lives in `src/content/blog/**`; builds produce static pages served on Vercel at https://ji-yong.com.
- Search, tags, RSS, sitemap, JSON-LD and Open Graph assets are all generated at build time.
- Comments rely on GitHub Discussions via Giscus; the UI falls back to a placeholder when env vars are missing.

## Agent Protocol
- Obey instruction priority: system -> developer -> this guide -> current user -> repo docs. Ask only if blocking information is missing.
- Inspect the relevant files before editing; prefer `rg`, `find`, or Serena search tools over broad `cat` or `ls -R`.
- For anything non-trivial, sketch a plan, execute step-by-step, and keep diffs minimal. Use `apply_patch` for focused edits.
- Never touch generated artifacts (`dist/`, `.reports/`, `pagefind/`), dependency folders (`node_modules/`), or user-owned changes.
- Run or describe verification (`npm run lint`, `npm run build`, etc.) whenever feasible; flag when something could not be tested.
- Default to English responses unless the request states otherwise; cite file paths with inline code formatting.

## TRM Recursive Reasoning Rule
Samsung SAIT's Tiny Recursive Model (TRM) shows how to get big gains from small loops - mirror that when solving tasks.^1

1. **Anchor the question** - form an explicit interpretation of the user request (think of this as the initial answer vector `y0`).
2. **Latent update loop** - gather context (read files, search, inspect configs) and refresh your internal picture; each pass is like updating TRM's latent state `z`.
3. **Answer refresh** - adjust your plan or draft solution using what you just learned, the way TRM refines `y`.
4. **Loop cap** - repeat the inspect/refresh cycle up to a sensible budget (usually 2-4 passes) or until no new insights appear.
5. **Stabilize & ship** - freeze the final response, list what you verified, and surface open risks so the user knows the current state.

Use this loop consciously: it keeps reasoning transparent and prevents premature edits.

^1 Source: Alexia Jolicoeur-Martineau, "Less is More: Recursive Reasoning with Tiny Networks" (Samsung SAIT, 2025) - https://alexiajm.github.io/2025/09/29/tiny_recursive_models.html

## Repository Orientation
- `astro.config.mjs` - site URL, enabled integrations (MDX & sitemap; Tailwind deps exist but are not wired in).
- `package.json` - scripts for dev/build/test/audits; `postbuild` runs `npx pagefind --site dist` to emit search assets.
- `public/` - favicons, fonts, gallery images; anything here is copied verbatim to the build.
- `src/assets/` - hero artwork (`heroes/`), blog placeholders, gallery JPEGs processed via `astro:assets`.
- `src/components/` - BaseHead, Header/Footer, FormattedDate, HeaderLink, GiscusComments.
- `src/layouts/BlogPost.astro` - wraps individual posts, emits JSON-LD + breadcrumb data, wires hero/OG images.
- `src/pages/` - routes for home, about, blog listing/detail, search (`search.astro`), tags index/detail, RSS, and `og/[...slug].ts` for dynamic Open Graph cards.
- `src/utils/` - helpers for JSON-LD generation, Giscus env parsing, and tag aggregation.
- `src/styles/` - global CSS plus per-page bundles (`search.css`, `tags.css`, `tag-detail.css`).
- `scripts/` - `create_hero_image.py` (Pillow-based gradient generator) and audit prep scripts.
- `docs/improvement_documents.md` - long-form roadmap & UI/SEO backlog (worth skimming before major revamps).
- `tests/` - Playwright smoke tests; `test-results/` stores artifacts from recent runs.

## Content Collections & Media
- Content schema (`src/content.config.ts`) requires `title`, `description`, `pubDate`; optional `updatedDate`, `heroImage`, `lang` (`'ko' | 'en'`), and `tags: string[]` (defaults to an empty list).
- Posts live under `src/content/blog/<topic>/<slug>.md[x]`. Keep slugs stable - routes and OG assets key off `id`.
- Hero images belong in `src/assets/heroes/`; create them with `python3 scripts/create_hero_image.py --slug ...`. Reference from frontmatter as `heroImage: "../../../assets/heroes/<file>.png"`.
- If no hero is supplied, the layouts use placeholder art and still generate OG cards via `astro-og-canvas`.
- `tags.ts` auto-generates slugs from the `tags` array; skipping tags falls back to the first path segment.

## Components, Layouts, and Pages
- `BaseHead.astro` imports `global.css`, sets canonical/meta/OG/Twitter tags, preloads fonts, and toggles light/dark theme via `data-theme`.
- `Header.astro` / `Footer.astro` render site-wide navigation and social links; update them for new sections.
- `FormattedDate.astro` formats dates with `Intl.DateTimeFormat` respecting locale.
- `BlogPost.astro` controls structured data (`BlogPosting` + `BreadcrumbList`), hero image rendering, and `<html lang>` selection.
- `GiscusComments.astro` reads `PUBLIC_GISCUS_*` env vars at runtime; without them it renders an accessible placeholder.
- `pages/search.astro` loads Pagefind UI from `/pagefind/`; remind users to run `npm run build` so the index exists.
- `pages/og/[...slug].ts` uses `astro-og-canvas` to generate OG cards (Korean/English aware via `lang`).
- `pages/tags/**` relies on `collectTags` helper; ensure new posts either declare tags or sensible directory names.

## Build & QA Commands
- Install deps: `npm install` (Node 18.14+ or 20+ recommended).
- Dev server: `npm run dev` (http://localhost:4321).
- Production build: `npm run build` (writes `dist/`), then auto-runs Pagefind via `postbuild`.
- Preview build: `npm run preview`.
- Type checks: `npm run check`.
- Linting: `npm run lint` / `npm run lint:fix`.
- Formatting: `npm run format:check` / `npm run format`.
- Playwright smoke tests: `npm run test:e2e` (requires `npx playwright install chromium` once).
- Audits: `npm run audit:web` to launch preview and run Lighthouse, Axe, Linkinator (reports in `.reports/`).

Inline commands are safe; do not invent new scripts without explaining the rationale.

## Scripts & Automation
- `scripts/audit/prepare-reports.mjs` clears report folders before Lighthouse/Axe/Linkinator runs.
- `scripts/audit/run-link-check.mjs` wraps Linkinator against the preview server.
- `scripts/create_hero_image.py` accepts `--palette`, `--title`, `--subtitle`, `--dry-run`; ensure Pillow is installed if you need it.

## SEO & Metadata
- `SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_AUTHOR` live in `src/consts.ts`; changes propagate everywhere through BaseHead and JSON-LD helpers.
- Structured data helpers in `src/utils/jsonld.ts` build `WebSite`, `Person`, `BlogPosting`, and `BreadcrumbList` nodes. Keep these in sync when introducing new page types.
- RSS lives at `src/pages/rss.xml.js` via `@astrojs/rss`; runs during build.
- Sitemap is handled by `@astrojs/sitemap` (requires a valid `site` URL in config).
- OG/Twitter images generated by `astro-og-canvas` are stored under `/og/<slug>.png` at build time.

## Comments & Environment
Set these environment variables (e.g., `.env`, deployment secrets) to enable Giscus:

```
PUBLIC_GISCUS_REPO=<owner/repo>
PUBLIC_GISCUS_REPO_ID=<repo-id>
PUBLIC_GISCUS_CATEGORY=<discussion-name>
PUBLIC_GISCUS_CATEGORY_ID=<discussion-id>
```

Optional overrides include `PUBLIC_GISCUS_LANG`, `PUBLIC_GISCUS_THEME`, `PUBLIC_GISCUS_MAPPING`, etc. Without the four required values, posts simply show a placeholder message and builds still succeed.

## Common Tasks
- **Add a blog post**: create `src/content/blog/<topic>/<slug>.md`, include required frontmatter, set `lang` when writing English, add tags, reference hero art if available.
- **Generate hero art**: run the Python script, commit the output under `src/assets/heroes/`, update the post frontmatter.
- **Update gallery**: drop images into `src/assets/gallery/` and adjust the `galleryImages` array in `src/pages/index.astro`.
- **Tweak site metadata**: edit `src/consts.ts` for title/description/author, adjust nav links in `Header.astro`, update footer copy as needed.
- **Create new routes**: add `.astro`/`.ts` files under `src/pages/`; integrate them into navigation and BaseHead for consistent metadata.

## Safety + Gotchas
- Content collection validation fails builds if required frontmatter is missing or malformed; match schema types (dates parsed via `z.coerce.date()`).
- Default language is Korean; set `lang: 'en'` on English posts so OG cards and JSON-LD use the right locale.
- Tailwind packages exist but are inactive; do not rely on utility classes until `astro.config.mjs` includes `tailwind()` and a config is committed.
- Pagefind assets live under `dist/pagefind/`; missing bundles mean the search page will show a fallback notice.
- OG generation depends on collection IDs; renaming or moving posts invalidates cached images - clean `dist/` if you change slugs.
- CSP rules are in `vercel.json`; extend allowlists when embedding new third-party scripts or if audits fail due to blocked resources.

## Deployment & Ops
- Astro builds a static site (`dist/`) suitable for Vercel, Netlify, or any static host; this repo currently targets Vercel (see `vercel.json`).
- Ensure the `site` value in `astro.config.mjs` stays accurate; feeds and sitemap derive absolute URLs from it.
- Vercel's edge cache serves immutable assets by default; adjust headers in `vercel.json` if new external assets require additional allowances.

## Reference Material
- `README.md` - high-level commands and environment notes.
- `docs/improvement_documents.md` - phased roadmap covering UI, SEO, accessibility, and performance goals.
- `test-results/` + `.reports/` - artifacts from the latest Playwright and audit runs (never hand-edit).
- TRM paper & blog post (linked above) - foundation for the recursive reasoning loop used in this guide.
