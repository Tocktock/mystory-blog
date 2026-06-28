import { test, expect } from '@playwright/test';

test('site search returns results for known keywords', async ({ page }) => {
  await page.goto('/search');

  await page.waitForSelector('#search input', { timeout: 10000 });
  const searchBox = page.locator('#search input');
  await expect(searchBox).toBeVisible();

  await searchBox.fill('kubernetes');
  await expect.poll(async () => new URL(page.url()).searchParams.get('q')).toBe('kubernetes');
  const results = page.locator('.pagefind-ui__result');
  await expect(results.first()).toBeVisible({ timeout: 15000 });
  await expect(results.first()).toContainText(/kubernetes/i);
});

test('site search hydrates results from the q query parameter', async ({ page }) => {
  await page.goto('/search/?q=kubernetes');

  const searchBox = page.locator('#search input');
  await expect(searchBox).toBeVisible({ timeout: 10000 });
  await expect(searchBox).toHaveValue('kubernetes');

  const results = page.locator('.pagefind-ui__result');
  await expect(results.first()).toBeVisible({ timeout: 15000 });
  await expect(results.first()).toContainText(/kubernetes/i);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('site search exposes a fallback form and guidance', async ({ page }) => {
    await page.goto('/search');

    await expect(page.getByLabel('검색어')).toBeVisible();
    await expect(page.getByRole('button', { name: '검색' })).toBeVisible();
    await expect(page.getByText(/검색 결과를 보려면 JavaScript가 필요합니다/)).toBeVisible();
  });
});
