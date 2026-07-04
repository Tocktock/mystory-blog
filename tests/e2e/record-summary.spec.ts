import { expect, test } from '@playwright/test';

test('record detail renders optional summary and series progress when metadata exists', async ({
  page,
}) => {
  await page.goto('/records/meta/ai-advisor-writing-partner/');

  const summary = page.locator('.record-summary');
  await expect(summary).toBeVisible();
  await expect(summary).toContainText('기록 갈래');
  await expect(summary).toContainText('생각 기록');
  await expect(summary).toContainText('상태');
  await expect(summary).toContainText('정리됨');
  await expect(summary).toContainText('문제');
  await expect(summary).toContainText('배운 것');

  await expect(page.locator('.series-progress')).toBeVisible();
  await expect(page.locator('.series-progress__count')).toHaveText('01 / 03');
});

test('technical legacy record keeps code blocks readable without empty summary', async ({
  page,
}) => {
  await page.goto('/records/spring/spring-validate/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'kotlin spring 에서 유용한 에러 반환하기.',
  );
  await expect(page.locator('.record-summary')).toHaveCount(0);

  const codeBlock = page.locator('.post-content pre').first();
  await expect(codeBlock).toBeVisible();
  await expect(codeBlock).toHaveCSS('overflow-x', 'auto');
});

test('thought legacy record keeps tables readable without empty summary', async ({ page }) => {
  await page.goto('/records/hardware/first-soldering-monitor-repair/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    '눈으로만 봤던 납땜을 직접 해봤다.',
  );
  await expect(page.locator('.record-summary')).toHaveCount(0);

  const table = page.locator('.post-content table').first();
  await expect(table).toBeVisible();
  await expect(table).toHaveCSS('overflow-x', 'auto');
});
