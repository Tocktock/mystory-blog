import { test, expect } from '@playwright/test';

test('site search returns results for known keywords', async ({ page }) => {
  await page.goto('/search');

  await page.waitForSelector('#search input', { timeout: 10000 });
  const searchBox = page.getByLabel('검색어');
  await expect(searchBox).toBeVisible();

  await searchBox.fill('kubernetes');
  await expect.poll(async () => new URL(page.url()).searchParams.get('q')).toBe('kubernetes');
  const results = page.locator('.pagefind-ui__result');
  await expect(results.first()).toBeVisible({ timeout: 15000 });
  await expect(results.first()).toContainText(/kubernetes/i);
});

test('site search hydrates results from the q query parameter', async ({ page }) => {
  await page.goto('/search/?q=kubernetes');

  await page.waitForSelector('#search input', { timeout: 10000 });
  const searchBox = page.getByLabel('검색어');
  await expect(searchBox).toBeVisible({ timeout: 10000 });
  await expect(searchBox).toHaveValue('kubernetes');

  const results = page.locator('.pagefind-ui__result');
  await expect(results.first()).toBeVisible({ timeout: 15000 });
  await expect(results.first()).toContainText(/kubernetes/i);
});

test('site search does not index the header, skip link or INDEX menu', async ({ page }) => {
  await page.goto('/search/');

  const indexedContent = await page.evaluate(async () => {
    const pagefind = await import(/* @vite-ignore */ `${location.origin}/pagefind/pagefind.js`);
    await pagefind.init();
    const search = await pagefind.search('kubernetes');
    const results = search.results.slice(0, 5) as { data: () => Promise<{ content: string }> }[];
    const pages = await Promise.all(results.map((result) => result.data()));
    return pages.map((data) => data.content);
  });

  expect(indexedContent.length).toBeGreaterThan(0);
  for (const content of indexedContent) {
    expect(content).not.toMatch(/본문 바로가기|INDEX \+|CLOSE ×|JI-YONG\.COM/);
  }
});

test('site search no-results copy suggests other ways to browse', async ({ page }) => {
  await page.goto('/search');

  await page.waitForSelector('#search input', { timeout: 10000 });
  const searchBox = page.getByLabel('검색어');
  await searchBox.fill('zzzz-no-record-drawer-0000');

  await expect(page.getByText('검색 결과가 없어요')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('다른 단어로 찾아보거나 기록과 시리즈를 둘러보세요')).toBeVisible();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('site search exposes a fallback form and guidance', async ({ page }) => {
    await page.goto('/search');

    await expect(page.getByLabel('검색어')).toBeVisible();
    await expect(page.getByRole('button', { name: '검색' })).toBeVisible();
    await expect(page.getByText(/검색하려면 JavaScript가 필요해요/)).toBeVisible();
    await expect(page.getByText(/기록 목록이나 시리즈에서 글을 찾아보세요/)).toBeVisible();
  });
});
