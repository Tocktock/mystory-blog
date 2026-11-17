import { expect, test } from '@playwright/test';

test('manyang-gureum frames cats as observation and care', async ({ page }) => {
  await page.goto('/manyang-gureum/');

  await expect(page.getByRole('heading', { level: 1, name: '만냥구름' })).toBeVisible();
  await expect(page.getByText('둘을 돌보면서 알게 된 것들도 적어 둬요')).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: '돌보면서 배운 것' })).toBeVisible();
  await expect(page.getByText('먼저 바라보기')).toBeVisible();
  await expect(page.getByText('원인을 이해하기')).toBeVisible();
  await expect(page.getByText('적어 두기', { exact: true })).toBeVisible();
  await expect(page.getByText('마스코트')).toHaveCount(0);
});

test('manyang-gureum remains contained on narrow mobile', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 1200 });
  await page.goto('/manyang-gureum/');

  await expect(page.getByRole('heading', { level: 2, name: '돌보면서 배운 것' })).toBeVisible();

  const pageOverflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    return Math.max(0, doc.scrollWidth - doc.clientWidth, body.scrollWidth - body.clientWidth);
  });

  expect(pageOverflow).toBe(0);
});
