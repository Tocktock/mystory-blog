import { expect, test } from '@playwright/test';

test('records archive keeps category and tag orientation', async ({ page }) => {
  await page.goto('/records');

  const firstCard = page.locator('.record-card').first();
  await expect(firstCard).toBeVisible();
  await expect(firstCard.locator('.record-card__category')).toBeVisible();
  await expect(page.locator('.record-card__tags').first()).toBeVisible();
});

test('records archive exposes record-type orientation and optional card metadata', async ({
  page,
}) => {
  await page.goto('/records');

  const recordTypes = page.getByRole('complementary', { name: '기록 갈래' });
  await expect(recordTypes).toBeVisible();
  await expect(recordTypes.getByText('생각 기록')).toBeVisible();

  const aiAdvisorCard = page
    .locator('.record-card')
    .filter({ hasText: '회사에서 AI Advisor로 보낸 3개월 회고' });
  await expect(aiAdvisorCard.locator('.record-card__type')).toHaveText('생각 기록');
  await expect(aiAdvisorCard.locator('.record-card__status')).toHaveText('정리됨');
  const intentLabels = aiAdvisorCard.locator('.record-card__intent dt');
  await expect(intentLabels.filter({ hasText: /^문제$/ })).toBeVisible();
  await expect(intentLabels.filter({ hasText: /^배운 것$/ })).toBeVisible();
  await expect(aiAdvisorCard).toContainText('AI를 조직에 소개하는 일이 도구 교육만으로 끝나지');
  await expect(aiAdvisorCard).toContainText('각자가 문제를 정의하고 책임지는 기준');
});

test('category routes render shared record cards without breaking navigation', async ({ page }) => {
  await page.goto('/records');

  await page
    .getByRole('navigation', { name: '기록 카테고리' })
    .getByRole('link', { name: '기술' })
    .click();
  await expect(page).toHaveURL(/\/categories\/tech\/$/);
  await expect(page.getByRole('heading', { level: 1, name: '기술' })).toBeVisible();

  const firstCard = page.locator('.record-card').first();
  await expect(firstCard).toBeVisible();
  await expect(firstCard.locator('.record-card__image')).toHaveAttribute(
    'data-cover-category',
    'tech',
  );
});
