# AGENTS.md — mystory-blog

This document helps AI agents and contributors quickly understand, extend, and safely modify the project.

## Project Overview
- Purpose: Personal blog + photo gallery for Ji Yong.
- Framework: Astro 5 (TypeScript, Vite). Static site.
- Content: Markdown/MDX via Astro Content Collections.
- Comments: Utterances (GitHub issue-based) on post pages.
- SEO: Centralized meta/head; RSS + sitemap generated.
- Production URL: https://ji-yong.com

## Tech Stack
- Runtime: Node.js (recommend 18.14+ or 20+)
- Language: TypeScript (strict), minimal JS
- Astro: astro@^5 with integrations: @astrojs/mdx, @astrojs/rss, @astrojs/sitemap
- Styling: Global CSS (src/styles/global.css) + component-scoped styles
- Tailwind: Dependencies present but NOT enabled in astro.config.mjs

## Repository Map (key paths)
- astro.config.mjs — Site URL, integrations, Vite plugin injecting UTTERANCES_CONFIG
- package.json — Scripts: dev, build, preview, astro
- tsconfig.json — Extends astro/tsconfigs/strict, strictNullChecks: true
- public/ — Images, fonts, favicon (served as-is)
- src/
  - components/ — BaseHead.astro, Header.astro, Footer.astro, HeaderLink.astro, FormattedDate.astro
  - content/ — Markdown posts under blog/**
    - content.config.ts — Zod schema + loader for blog collection
  - layouts/ — BlogPost.astro (post layout)
  - pages/ — Route files
    - index.astro — Home + gallery grid
    - about.astro — About page (uses BlogPost layout)
    - blog/index.astro — Post listing (sorted)
    - blog/[...slug].astro — Dynamic post route + Utterances
    - rss.xml.js — RSS endpoint using @astrojs/rss
- .vscode/ — Editor recommendations + launch config
- .serena/ — Local agent config/memories (ignored by Git)

## Content Model (blog)
Defined in src/content.config.ts (Zod):
- Required: title: string, description: string, pubDate: Date
- Optional: updatedDate?: Date, heroImage?: string
- Loader: glob('./src/content/blog/**/*.{md,mdx}')

Create a new post
1) Add src/content/blog/<topic>/<slug>.md
2) Frontmatter example:
---
title: "My Post"
description: "Short summary"
pubDate: 2025-01-01
heroImage: "/blog-placeholder-2.jpg"
---

## Routing
- Pages under src/pages/ become routes automatically
- Dynamic blog routes generated from content collection via getStaticPaths()
- RSS: /rss.xml from src/pages/rss.xml.js

## Comments (Utterances)
- Virtual import: virtual:astro/config provides UTTERANCES_CONFIG
- Provided by Vite plugin inside astro.config.mjs
- Default config:
  - repo: 'Tocktock/mystory-blog'
  - issueTerm: 'title'
  - label: 'comments'
  - theme: 'github-light'
- To change: edit the injected values in astro.config.mjs

## Commands
- Install deps: npm install
- Dev server: npm run dev (defaults to http://localhost:4321)
- Build: npm run build (outputs to dist/)
- Preview build: npm run preview
- Astro CLI passthrough: npm run astro -- <subcommand>
  - Type-check: npm run astro -- check
  - Add integration: npm run astro -- add

## Coding Conventions
- TypeScript strict; prefer explicit types in TS files
- Components: PascalCase inside src/components/; routes lowercase under src/pages/
- Global styles centralized in src/styles/global.css; component styles colocated via <style> blocks
- SEO/Meta: Use BaseHead.astro for title/description, canonical, OG/Twitter, RSS link

## Quality Checklist (before merging)
- Build succeeds: npm run build
- Preview clickthrough: npm run preview → /, /blog, recent post, /about
- Content schema: new/edited posts satisfy src/content.config.ts
- Type checks: npm run astro -- check
- SEO: Titles/descriptions accurate via BaseHead.astro
- Feeds: /rss.xml renders; sitemap present
- Comments: Utterances shows on post pages (if configured)

## Tailwind (optional)
- Currently not enabled. To enable:
  1) npm run astro -- add tailwind
  2) Add tailwind() to integrations in astro.config.mjs
  3) Create Tailwind config and swap styles incrementally

## Common Tasks
- Add a post: Create .md under src/content/blog/** with required frontmatter
- Change site title/description: src/consts.ts
- Change canonical/site URL: astro.config.mjs → site
- Adjust SEO defaults: src/components/BaseHead.astro
- Update gallery images: add files in public/gallery/ and list in src/pages/index.astro

## Gotchas
- Tailwind deps exist but are inactive. Don’t rely on utility classes unless Tailwind is enabled
- UTTERANCES_CONFIG virtual import depends on the Vite plugin; removing or renaming it will break comments
- RSS/sitemap need a correct site URL in astro.config.mjs for absolute URLs
- Blog frontmatter is validated; missing required fields will fail at build/type-check time

## Tooling & Editors
- VS Code: recommended extensions in .vscode/extensions.json
- Launch config starts dev server (.vscode/launch.json)

## Serena/Codex Guidance
- Repo scanning: use serena.list_dir and serena.search_for_pattern for discovery
- Symbolic edits: prefer insert_before_symbol, insert_after_symbol, replace_symbol_body when targeting Astro/TS symbols
- Memory: high-level summaries are in Serena memories (project_overview.md, style_and_conventions.md, suggested_commands.md, task_completion_checklist.md)
- Git hygiene: .serena/ is ignored; do not commit local agent state

## Deployment Notes
- Astro builds a static site; deploy dist/ to static hosts (Vercel, Netlify, GitHub Pages)
- Ensure site is set for correct absolute URLs in feeds and sitemap

## License
- No license file present. Add one if open-sourcing.

