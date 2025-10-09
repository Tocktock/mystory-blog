# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/blog)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/blog)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/blog/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![blog](https://github.com/withastro/astro/assets/2244813/ff10799f-a816-4703-b967-c78997e8323d)

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run lint`            | Run ESLint against `.ts`, `.tsx`, and `.astro` sources |
| `npm run lint:fix`        | Attempt to automatically fix lint violations     |
| `npm run format:check`    | Verify Prettier formatting                       |
| `npm run format`          | Format the project with Prettier                 |
| `npm run check`           | Static type/syntax analysis via `@astrojs/check` |
| `npm run test:e2e`        | Build the site and execute Playwright smoke tests |
| `npm run audit:web`       | Serve the production build then run Lighthouse, Axe, and Linkinator audits (reports in `.reports/`) |
| `npm run audit:lighthouse`| Run Lighthouse (mobile, performance/accessibility/SEO) against `http://127.0.0.1:4321` |
| `npm run audit:axe`       | Run axe-core accessibility checks against the preview server |
| `npm run audit:links`     | Crawl the preview server and export link check results to `.reports/linkinator/report.json` |

### Phase 0 Audit Toolkit

To establish a measurable baseline, Phase 0 introduces automated audits that run against the production preview:

1. Build the site: `npm run build`.
2. Launch the preview server and full audit suite: `npm run audit:web`.
3. Review generated artifacts under `.reports/`:
   - `lighthouse/report.{html,json}` for performance and SEO scores.
   - `axe/` JSON outputs for accessibility findings (process exits non-zero on violations).
   - `linkinator/report.json` for the internal link crawl.

The audit scripts expect Chrome to be available locally (required by Lighthouse). Each check exits with a non-zero status if failures are detected, making it easy to wire into CI later.

### Linting & Automated Tests

- ESLint enforces TypeScript and Astro best practices via `npm run lint`; use `npm run lint:fix` for quick fixes.
- Prettier keeps formatting consistent (`npm run format:check` / `npm run format`).
- `npm run check` runs `@astrojs/check` for project-wide diagnostics.
- Playwright smoke tests cover navigation, search, and comments. Install the Chromium browser one time with `npx playwright install chromium`, then run `npm run test:e2e` to build and execute the suite.

## 🧾 Content Frontmatter

Blog posts now accept an optional `lang` field in frontmatter. When omitted the page defaults to Korean (`ko`), but you can set `lang: 'en'` for English posts to ensure the generated `<html lang>` attribute and structured data match the article’s language.

### Open Graph Images

- OpenGraph/Twitter previews are generated automatically at build time via [`astro-og-canvas`](https://github.com/delucis/astro-og-canvas).
- Each blog post renders a card at `/og/<slug>.png`; these URLs are wired into the head metadata and BlogPosting JSON-LD.
- Customize per-post visuals by adding a `heroImage` in frontmatter (used on-page and as a secondary image in structured data).

### Comments (Giscus)

Comments are powered by [Giscus](https://giscus.app).  Add the following environment variables to your `.env` (or deployment secrets) after enabling Giscus on the target GitHub repository Discussion category:

```
PUBLIC_GISCUS_REPO=Tocktock/mystory-blog
PUBLIC_GISCUS_REPO_ID=<repo-id>
PUBLIC_GISCUS_CATEGORY=<discussion-category-name>
PUBLIC_GISCUS_CATEGORY_ID=<discussion-category-id>
```

Optional overrides (with defaults in brackets):

```
PUBLIC_GISCUS_MAPPING=title
PUBLIC_GISCUS_LANG=ko
PUBLIC_GISCUS_THEME=light
PUBLIC_GISCUS_STRICT=1
PUBLIC_GISCUS_REACTIONS_ENABLED=1
PUBLIC_GISCUS_EMIT_METADATA=0
PUBLIC_GISCUS_INPUT_POSITION=bottom
PUBLIC_GISCUS_LOADING=lazy
```

If the required variables are not set, the post layout renders a placeholder message so you can merge safely before provisioning credentials.

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
