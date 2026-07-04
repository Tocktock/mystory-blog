import { expect, test } from '@playwright/test';

test('manyang-gureum frames cats as observation and care', async ({ page }) => {
  await page.goto('/manyang-gureum/');

  await expect(page.getByRole('heading', { level: 1, name: '만냥구름' })).toBeVisible();
  await expect(page.getByText('관찰하고 돌보는 방식을 함께 남깁니다')).toBeVisible();
  await expect(
    page.getByRole('heading', { level: 2, name: '관찰과 돌봄으로 남긴 기준' }),
  ).toBeVisible();
  await expect(page.getByText('먼저 바라보기')).toBeVisible();
  await expect(page.getByText('원인을 이해하기')).toBeVisible();
  await expect(page.getByText('돌봄을 기록으로 남기기')).toBeVisible();
  await expect(page.getByText('마스코트')).toHaveCount(0);
});

test('manyang-gureum remains contained on narrow mobile', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 1200 });
  await page.goto('/manyang-gureum/');

  await expect(
    page.getByRole('heading', { level: 2, name: '관찰과 돌봄으로 남긴 기준' }),
  ).toBeVisible();

  const pageOverflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    return Math.max(0, doc.scrollWidth - doc.clientWidth, body.scrollWidth - body.clientWidth);
  });

  expect(pageOverflow).toBe(0);
});
