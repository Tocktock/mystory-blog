import { expect, test } from '@playwright/test';

test('creations page connects finished work with its creation journal', async ({ page }) => {
  await page.goto('/creations/');

  await expect(page.getByRole('heading', { level: 1, name: '음악과 창작 실험' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '열려라 별문' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '전체 발매곡' })).toBeVisible();
  await expect(page.getByText('현재 공개한 11곡을 모두 모았습니다.')).toBeVisible();
  await expect(page.locator('.creation-card')).toHaveCount(10);
  await expect(page.getByRole('heading', { name: '불은 켜 둬' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '별의 문을 열어' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '한 박자 늦게' })).toBeVisible();
  await expect(page.getByRole('link', { name: '만든 과정 읽기' })).toHaveAttribute(
    'href',
    '/records/meta/ai-music-with-suno/',
  );
});

test('creations page has no horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto('/creations/');

  const overflow = await page.evaluate(() =>
    Math.max(
      0,
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
      document.body.scrollWidth - document.body.clientWidth,
    ),
  );

  expect(overflow).toBe(0);
});
