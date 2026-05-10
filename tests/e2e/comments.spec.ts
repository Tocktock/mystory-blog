import { test, expect } from '@playwright/test';

test('giscus discussion widget renders on record posts', async ({ page }) => {
  await page.goto('/records');

  const firstPostLink = page.locator('.record-card a').first();
  await expect(firstPostLink).toBeVisible();

  const targetHref = await firstPostLink.getAttribute('href');
  await firstPostLink.click();

  if (targetHref) {
    await expect(page).toHaveURL(new RegExp(`${targetHref.replace(/\//g, '\\/')}$`));
  }

  const commentsSection = page.locator('section#comments');
  await expect(commentsSection).toBeVisible();

  const giscusFrame = commentsSection.locator('iframe.giscus-frame');
  try {
    await giscusFrame.first().waitFor({ state: 'visible', timeout: 20_000 });
    await expect(giscusFrame.first()).toBeVisible();
  } catch {
    const placeholder = commentsSection.locator('.comments__placeholder');
    await expect(placeholder).toContainText('Giscus comments are not configured yet');
  }
});
