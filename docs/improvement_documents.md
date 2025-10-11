> **Current Observation Summary (2025‑10‑08)**
>
> - Simple Home/Blog/About navigation with mostly Korean posts. The home page includes a “Cute Cat Gallery” section, blog index/detail pages render correctly. **No comment widget detected** (neither Utterances nor Giscus). ([ji-yong.com][1])
> - Deployment is reportedly on Vercel, so include caching/header strategy guidance. Vercel keeps static assets in the **edge cache for the lifetime of the deploy**; adjust `Cache-Control` via `vercel.json` if necessary. ([Vercel][2])

---

## Full Roadmap (Phase‑by‑Phase)

### Phase 0 — Baseline, Instrumentation, Safety Net (Lightweight Kickoff)

**Goal:** Quantify the current state and set up safeguards plus automated verification so changes are reversible and testable.

**Action Items**

- **Branch strategy:** Create a `revamp/2025-q4` branch and connect the Vercel preview (preview URL auto‑provisioned).
- **Diagnostics:** Add local scripts for Lighthouse (mobile), Axe (accessibility), and Linkinator (link checker).
- **Analytics (optional):** Integrate lightweight analytics such as Plausible/Umami or use Vercel Analytics.
- **Search Console:** Register the site with Google Search Console, verify domain ownership, and plan sitemap submissions (leveraging `@astrojs/sitemap`). ([Astro Docs][3])

**Definition of Done**

- A single `npm run audit:web` run saves **Lighthouse (mobile ≥90) and SEO ≥90** reports as artifacts.
- All key pages return **200/OK on the Vercel preview**, and the custom 404 page renders.

---

### Phase 1 — Mobile‑First UI & Readability (Core)

**Goal:** Achieve “clean and modern,” “mobile friendly,” and “content forward” in one pass.

**Key Changes**

1. **Typographic scale & line height**

   - Body copy: `clamp(18px, 1.8vw, 20px)` / line-height 1.7.
   - Clarify heading hierarchy (visual scale matches **semantic tags**). On the blog index use **H1 = “Blog”**, individual post cards use **H2**.

2. **Code readability**

   - Global rule: `code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace }`
   - `pre { overflow-x: auto }` to prefer **horizontal scrolling over mobile line wrapping**.

3. **Touch targets & navigation**

   - Minimum 40px tap targets; introduce a **hamburger toggle** below 480px if needed.

4. **Language metadata**

   - Default page attribute **`lang="ko"`** (set `lang: 'en'` in frontmatter for English posts). Important for both accessibility and SEO.

5. **Dark mode (optional)**

   - Provide a CSS variable-driven toggle via `data-theme="dark"`, respecting system preference.

6. **Responsive images**

   - Ensure `img { max-width: 100%; height: auto }` and set width/height attributes to avoid CLS.

**Definition of Done**

- No horizontal scrolling from iPhone SE through desktop. Focus rings remain visible and heading hierarchy passes inspection.
- Blog post code blocks remain readable on phones without breaking lines mid-token.

---

### Phase 2 — SEO, Internationalization, Metadata (Core)

**Goal:** Move from “basic SEO” to a fully structured setup: structured data, sitemap, RSS, and language controls.

**Action Items**

1. **Site-wide meta**

   - Strengthen home title/description with keywords:
     `SITE_TITLE = "Ji Yong’s Tech Blog"`
     `SITE_DESCRIPTION = "Kubernetes, DevOps, Backend, and AI notes by Ji Yong"`

2. **Language/I18n**

   - In layouts use `<html lang={pageLang || 'ko'}>` with Korean as the default.

3. **Structured data (JSON‑LD)**

   - Posts: use the `BlogPosting` (Article) schema (title, description, publish/update dates, author, URL, og:image).
   - Global: add `WebSite` + `Person` (author) and optionally `BreadcrumbList`. Google recommends **JSON‑LD**. ([Google for Developers][4])
   - Example for post layout:

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

4. **Sitemap & RSS**

   - Integrate `@astrojs/sitemap` (set `site` correctly in `astro.config.mjs`).
   - Use `@astrojs/rss` to build `/rss.xml` from the content collection. ([Astro Docs][3])

5. **robots.txt**

   - Add `Sitemap: https://ji-yong.com/sitemap-index.xml` (or `/sitemap.xml`) in `public/robots.txt`.

**Definition of Done**

- Rich Results Test (manual) returns **0 errors**.
- Google Search Console recognizes the **submitted sitemap with no coverage warnings**.

---

### Phase 3 — Comments (GitHub Integration) & Engagement

**Recommendation:** Adopt **Giscus** (GitHub Discussions-based, threaded, i18n). Utterances is Issue-based and lightweight but lacks threading/current features. ([giscus.app][5])

**Steps**

1. Enable **Discussions** on the repository and create a “Comments” category.
2. Generate the embed snippet on **giscus.app** (`data-mapping="pathname"`, `data-lang="ko"`, `data-theme="preferred_color_scheme"`). ([giscus.app][5])
3. Insert the script at the bottom of the post layout:

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

4. If Utterances stored historic comments, convert relevant Issues to Discussions via GitHub’s “Convert to discussion.”
5. Add a short call-to-action at the end of each post (e.g., “💬 Have a question? Share it in the comments below!”).

**Definition of Done**

- Preview/production flows support **log in → comment → immediate display**.
- Comment widget follows dark/light theme switches.

---

### Phase 4 — Search & Discoverability (More Critical as Content Grows)

**Recommendation:** Use **Pagefind** (static-site friendly, post-build indexing, bundled UI). Works smoothly with Astro. ([pagefind.app][6])

**Steps**

1. Install Pagefind: `npm i -D pagefind`
2. Index after build:

   - In `package.json`:

     ```json
     {
       "scripts": {
         "build": "astro build",
         "postbuild": "npx pagefind --source dist"
       }
     }
     ```

3. Add a search UI page (`/search`):

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

4. Add a **Search** link to the navigation.
5. Introduce `tags: ['kubernetes', 'ci-cd']` in post frontmatter and generate `/tags/[tag]/` listing pages.

**Definition of Done**

- `/search` returns Korean keywords within **150ms** locally (auto-suggest + results).
- Tag pages generate automatically and improve internal linking.

---

### Phase 5 — Image & Performance Optimization (Core Web Vitals)

**Recommendation:** Use Astro’s built-in **`astro:assets`** (`<Image/>`, `<Picture/>`) for **WebP conversion, responsive sizes, and lazy loading**. Resize/compress existing `public/` gallery/thumb assets. ([Astro Docs][7])

**Action Items**

- Local assets:

  ```astro
  ---
  import { Image } from 'astro:assets';
  import hero from '../../assets/hero.jpg';
  ---
  <Image src={hero} alt="..." widths={[400, 800, 1200]} sizes="(max-width: 768px) 100vw, 720px" loading="lazy" />
  ```

- **OG image automation (optional):** Use Satori or plugins to generate per-post Open Graph cards at build time. ([TechSquidTV][8])
- Vercel cache: static files are edge cached automatically. If needed, refine `Cache-Control`/`CDN-Cache-Control` in `vercel.json` (e.g., `/assets/*` immutable for one year). ([Vercel][2])

**Definition of Done**

- Measurable LCP/CLS improvements (mobile LCP < 2.5s, CLS ≈ 0). Lighthouse **Performance ≥95**.

---

### Phase 6 — Accessibility, Security, Quality Assurance
`
**Action Items**

- **Screen reader copy:** Update the header GitHub icon `sr-only` text to “Ji Yong’s GitHub,” etc.
- Preserve **visible focus** and double-check contrast (AA 4.5:1+).
- **CSP (optional):** Minimal allowlist such as `script-src 'self' https://giscus.app`.
- **Tests/CI:** `astro check`, ESLint/Prettier, link checker, Lighthouse CI.

**Definition of Done**

- Axe automated audits report **0 critical/serious issues**.
- Happy-path Playwright coverage (navigation, search, comments) with ~3 smoke tests.

---

## Summary of Key File/Config Changes

- `astro.config.*`

  - `site: "https://ji-yong.com"` (ensures sitemap/RSS build absolute URLs)
  - `integrations: [sitemap(), /* add vercel() if needed */]` ([Astro Docs][3])

- `src/layouts/BaseLayout.astro`

  - `<html lang={Astro.props.lang ?? 'ko'}>`
  - Body grid/width, `clamp()` typography, code styling.

- `src/layouts/BlogPost.astro`

  - JSON‑LD (Article, optional BreadcrumbList), Giscus embed.

- `src/pages/rss.xml.js`

  - Build RSS from the content collection via `@astrojs/rss`. ([Astro Docs][9])

- `src/pages/search.astro`

  - Pagefind UI loader + container.

- `public/robots.txt`

  - `Sitemap: https://ji-yong.com/sitemap-index.xml` (or `/sitemap.xml`).

- `vercel.json` (optional)

  - Static asset cache headers:

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

## Risks & Mitigations

- **Comment URL mapping:** Giscus `pathname` mapping splits threads if URLs change → keep slugs permanent.
- **Image path migrations:** When moving to `astro:assets`, verify relative paths inside posts (build warnings if incorrect).
- **Mixed-language content:** Control `lang` via frontmatter—helps search exposure when mixing Korean/English posts.

---

## Metrics (KPI)

- **Core Web Vitals:** Mobile LCP < 2.5s, CLS < 0.05.
- **Search visibility:** 100% valid indexed URLs, zero coverage errors, improved CTR on branded queries.
- **Engagement:** Track Giscus **reaction/comment rate** and average time on page.
- **Internal discovery:** `/search` usage rate, sessions that include tag pages.

---

## “Up-to-Date” References (verified 2025‑10‑08)

- **Giscus:** GitHub Discussions-based comment system with threads/reactions/i18n. ([giscus.app][5])
- **Utterances:** GitHub Issues-based lightweight widget (alternative) — requires OAuth, auto-creates issues. ([utteranc.es][11])
- **Pagefind:** Post-build indexing for static sites with low-bandwidth UI. ([pagefind.app][6])
- **Astro images/sitemap/RSS:** `astro:assets` (Image/Picture), `@astrojs/sitemap`, `@astrojs/rss`. ([Astro Docs][7])
- **Vercel cache/headers:** Edge cache by default; refine via `vercel.json`. ([Vercel][2])
- **Structured data guidance:** Google recommends Article/Breadcrumb JSON‑LD. ([Google for Developers][4])

---

### Getting Started (Suggested Sequence)

1. **Run Phase 0** (branching + instrumentation)
2. **Tackle Phases 1 & 2** together (UI + SEO)
3. **Implement Phase 3** (Giscus)
4. **Move into Phase 4** (search/tags)
5. **Finish with Phases 5 & 6** (performance + accessibility)

High-impact wins come from **Phase 1 (mobile readability)**, **Phase 2 (language/schema/sitemap/RSS)**, and **Phase 3 (Giscus)**.

If helpful, I can also draft per-phase PR templates (checklists + test steps), example diffs, and file-by-file guidance.

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
