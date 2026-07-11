import { expect, test } from '@playwright/test';

test('about page exposes JiYong manual and preserves the interview', async ({ page }) => {
  await page.goto('/about/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('몰입, 관찰, 그리고 배움');

  const manual = page.locator('.about-manual');
  await expect(manual).toBeVisible();
  await expect(manual.locator('.about-principle-card')).toHaveCount(6);

  for (const principle of [
    '마음가짐과 몰입',
    '문제를 먼저 정의하기',
    '유대감과 협업',
    '실패하면 다시 풀기',
    '관찰하고 이해하기',
    '틀릴 수 있음을 인정하기',
  ]) {
    await expect(manual).toContainText(principle);
  }

  await expect(manual.getByRole('link', { name: 'Q1에서 자세히 보기' })).toHaveAttribute(
    'href',
    '#q1',
  );
  await expect(manual.getByRole('link', { name: '하프마라톤 완주 기록' })).toHaveAttribute(
    'href',
    '/records/running/first-half-marathon-prep/',
  );
  await expect(manual.getByRole('link', { name: '틀릴 수 있음을 인정한 기록' })).toHaveAttribute(
    'href',
    '/records/concern/ai-concern-26-05-10/',
  );
  await expect(manual.getByRole('link', { name: 'AI Advisor 회고' })).toHaveAttribute(
    'href',
    '/records/meta/ai-advisor-writing-partner/',
  );

  await expect(page.locator('#q1')).toContainText('일을 할 때 가장 중요하게 생각하는 원칙');
  await expect(page.locator('#q8')).toContainText('앞으로 어떤 방식으로 성장하고 싶나요');
  await expect(page.getByRole('link', { name: '이력 보기' })).toHaveAttribute('href', '/career');
});

test('about manual remains contained on narrow mobile', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 1200 });
  await page.goto('/about/');

  await expect(page.locator('.about-manual')).toBeVisible();
  await expect(page.locator('.about-principle-card')).toHaveCount(6);

  const pageOverflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    return Math.max(0, doc.scrollWidth - doc.clientWidth, body.scrollWidth - body.clientWidth);
  });

  expect(pageOverflow).toBe(0);
});
