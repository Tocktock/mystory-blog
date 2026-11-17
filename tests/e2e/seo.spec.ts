import { expect, test } from '@playwright/test';

test('sitemap exposes canonical record URLs only', async ({ request }) => {
  const response = await request.get('/sitemap-0.xml');
  expect(response.ok()).toBe(true);

  const sitemap = await response.text();

  expect(sitemap).toContain('<loc>https://ji-yong.com/records/</loc>');
  expect(sitemap).toContain(
    '<loc>https://ji-yong.com/records/kubernetes-on-mac/k3s-with-multipass/</loc>',
  );
  expect(sitemap).toContain('<loc>https://ji-yong.com/manyang-gureum/</loc>');
  expect(sitemap).not.toContain('https://ji-yong.com/blog/');
  expect(sitemap).not.toContain('https://ji-yong.com/cat-pics/');
});

test('rss feed keeps record-room canonical links', async ({ request }) => {
  const response = await request.get('/rss.xml');
  expect(response.ok()).toBe(true);

  const feed = await response.text();

  expect(feed).toContain('<title>지용의 기록실</title>');
  expect(feed).toContain('https://ji-yong.com/records/kubernetes-on-mac/k3s-with-multipass/');
  expect(feed).toContain('https://ji-yong.com/records/meta/ai-advisor-writing-partner/');
  expect(feed).not.toContain('https://ji-yong.com/blog/');
  expect(feed).not.toContain('/blog/');
});

const robotsNoindex = /<meta name="robots" content="[^"]*noindex/;

test('sitemap lists only indexable pages and dates every post', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  const entries = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(.*?)<\/url>/g)];
  expect(entries.length).toBeGreaterThan(0);
  expect(sitemap).not.toContain('<loc>https://ji-yong.com/search/</loc>');

  for (const [, loc, rest] of entries) {
    const path = new URL(loc).pathname;
    // Posts live at /records/<folder>/<slug>/ and carry their modified date.
    if (/^\/records\/[^/]+\/[^/]+\/$/.test(path)) {
      expect(rest, `${path} has lastmod`).toContain('<lastmod>');
    }
    const html = await (await request.get(path)).text();
    expect(html, `${path} is indexable`).not.toMatch(robotsNoindex);
  }
});

test('site search and one-post tag pages stay out of the index', async ({ request }) => {
  expect(await (await request.get('/search/')).text()).toMatch(robotsNoindex);

  const tagsIndex = await (await request.get('/tags/')).text();
  const tagPaths = [
    ...new Set([...tagsIndex.matchAll(/href="(\/tags\/[^"/]+\/)"/g)].map((m) => m[1])),
  ];
  expect(tagPaths.length).toBeGreaterThan(0);

  for (const tagPath of tagPaths) {
    const html = await (await request.get(tagPath)).text();
    const posts = new Set(html.match(/href="\/records\/[^"/]+\/[^"/]+\/"/g) ?? []);
    if (posts.size < 2) {
      expect(html, `${tagPath} has one post`).toMatch(robotsNoindex);
    } else {
      expect(html, `${tagPath} has ${posts.size} posts`).not.toMatch(robotsNoindex);
    }
  }
});

test('posts are marked up as articles by the site author', async ({ page }) => {
  await page.goto('/records/kubernetes-on-mac/k3s-with-multipass/');

  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute(
    'content',
    /^\d{4}-\d{2}-\d{2}T/,
  );
  await expect(page.locator('meta[name="twitter:creator"]')).toHaveCount(0);

  const nodes = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? '{}')));
  const article = nodes.find((node) => node['@type'] === 'BlogPosting');
  expect(article.author['@id']).toBe('https://ji-yong.com/about/#person');
  expect(article.author.url).toBe('https://ji-yong.com/about/');

  const breadcrumb = nodes.find((node) => node['@type'] === 'BreadcrumbList');
  const crumbs = breadcrumb.itemListElement.map((item: { item: string }) => item.item);
  expect(crumbs).toEqual([
    'https://ji-yong.com/',
    'https://ji-yong.com/records/',
    'https://ji-yong.com/categories/tech/',
    'https://ji-yong.com/records/kubernetes-on-mac/k3s-with-multipass/',
  ]);
});

test('about page describes the author as a profile', async ({ page }) => {
  await page.goto('/about/');

  const nodes = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? '{}')));
  const profile = nodes.find((node) => node['@type'] === 'ProfilePage');
  expect(profile.mainEntity['@id']).toBe('https://ji-yong.com/about/#person');
  expect(profile.mainEntity.sameAs).toContain('https://github.com/Tocktock');
  expect(nodes.some((node) => node['@type'] === 'BlogPosting')).toBe(false);

  const breadcrumb = nodes.find((node) => node['@type'] === 'BreadcrumbList');
  expect(breadcrumb.itemListElement).toHaveLength(2);
});

test('article body images load and describe themselves', async ({ page, request }) => {
  for (const path of [
    '/records/hardware/first-soldering-monitor-repair/',
    '/records/elasticsearch/elasticsearch-crud-kibana/',
    '/records/backend/nodejs-event-loop/',
  ]) {
    await page.goto(path);
    const images = await page.locator('.article-body img').evaluateAll((elements) =>
      elements.map((element) => ({
        src: element.getAttribute('src') ?? '',
        alt: element.getAttribute('alt') ?? '',
        width: element.getAttribute('width'),
      })),
    );
    expect(images.length, `${path} has body images`).toBeGreaterThan(0);

    for (const image of images) {
      expect(image.src, `${path} image is optimized`).toMatch(/^\/_astro\/.+\.webp$/);
      expect(image.alt.trim(), `${image.src} alt`).not.toBe('');
      expect(image.width, `${image.src} width`).not.toBeNull();
      const response = await request.get(image.src);
      expect(response.status(), image.src).toBe(200);
    }
  }
});
