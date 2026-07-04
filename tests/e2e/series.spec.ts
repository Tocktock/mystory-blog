import { expect, test } from '@playwright/test';

test('series index renders learning shelf metadata for active shelves', async ({ page }) => {
  await page.goto('/series');

  const card = page.locator('.series-card', { hasText: 'AI와 일하는 방식' });
  await expect(card).toBeVisible();
  await expect(card.locator('.series-card__meta')).toContainText('생각');
  await expect(card.locator('.series-card__meta')).toContainText('3개 기록');
  await expect(card.locator('.series-card__status')).toHaveText('진행 중');
  await expect(card.locator('.series-card__intent')).toContainText('왜 이 선반인가');
  await expect(card.locator('.series-card__intent')).toContainText('읽고 나면');

  await expect(page.getByRole('link', { name: /AI Agent 실험실/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /만냥구름 관찰일지/ })).toHaveCount(0);
});

test('series detail explains the shelf and preserves seriesOrder reading path', async ({
  page,
}) => {
  await page.goto('/series/ai-working-notes/');

  await expect(page.getByRole('heading', { level: 1, name: 'AI와 일하는 방식' })).toBeVisible();
  await expect(page.locator('.series-detail__meta')).toContainText('생각');
  await expect(page.locator('.series-detail__meta')).toContainText('3개 기록');
  await expect(page.locator('.series-detail__meta')).toContainText('진행 중');
  await expect(page.locator('.series-detail__shelf')).toContainText('이 선반의 목적');
  await expect(page.locator('.series-detail__shelf')).toContainText('읽는 길');

  await expect(page.locator('.series-detail__order').nth(0)).toHaveText('01');
  await expect(page.locator('.series-detail__order').nth(1)).toHaveText('02');
  await expect(page.locator('.series-detail__order').nth(2)).toHaveText('03');

  await expect(page.locator('.series-detail__item h3').nth(0)).toHaveText(
    '회사에서 AI Advisor로 보낸 3개월 회고',
  );
  await expect(page.locator('.series-detail__item h3').nth(1)).toHaveText(
    'AI가 코드를 써주는 시대에, 우리는 무엇을 책임져야 하나',
  );
  await expect(page.locator('.series-detail__item h3').nth(2)).toHaveText(
    '요즘 나는 AI로 노래를 만들고 있다',
  );
});
