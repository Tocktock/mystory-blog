import { expect, test } from '@playwright/test';

test('career work areas expose related public records where evidence exists', async ({ page }) => {
  await page.goto('/career/');

  const companyWork = page.locator('#company-work');
  await expect(companyWork).toBeVisible();

  const aiWork = companyWork
    .locator('.company-work__row')
    .filter({ hasText: 'AI 기반 오더 자동화' });
  await expect(aiWork.getByRole('group', { name: '관련 기록' })).toContainText('AI Advisor 회고');
  await expect(aiWork.getByRole('link', { name: 'AI Advisor 회고' })).toHaveAttribute(
    'href',
    '/records/meta/ai-advisor-writing-partner/',
  );

  const dataWork = companyWork.locator('.company-work__row').filter({ hasText: '데이터와 성능' });
  await expect(dataWork.getByRole('group', { name: '관련 기록' })).toContainText(
    '마이그레이션 충돌기',
  );
  await expect(dataWork.getByRole('group', { name: '관련 기록' })).toContainText(
    'pgloader 사용 기록',
  );
  await expect(dataWork.getByRole('link', { name: '마이그레이션 충돌기' })).toHaveAttribute(
    'href',
    '/records/mysql-to-postgres/mysql-to-postgres-realworld/',
  );
  await expect(dataWork.getByRole('link', { name: 'pgloader 사용 기록' })).toHaveAttribute(
    'href',
    '/records/mysql-to-postgres/how-to-use-pgloader/',
  );

  const platformWork = companyWork.locator('.company-work__row').filter({ hasText: '플랫폼 운영' });
  await expect(platformWork.getByRole('group', { name: '관련 기록' })).toHaveCount(0);
});

test('career related-record links remain contained on narrow mobile', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 1200 });
  await page.goto('/career/');

  await expect(page.locator('#company-work')).toBeVisible();
  await expect(
    page.locator('.company-work__link-group').filter({ hasText: '관련 기록' }),
  ).toHaveCount(2);

  const pageOverflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    return Math.max(0, doc.scrollWidth - doc.clientWidth, body.scrollWidth - body.clientWidth);
  });

  expect(pageOverflow).toBe(0);
});
