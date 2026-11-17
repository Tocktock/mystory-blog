import { expect, test } from '@playwright/test';

test('record hero images expose contextual alt text', async ({ page }) => {
  await page.goto('/records/kubernetes-on-mac/k3s-with-multipass/');

  await expect(page.locator('.hero-image img')).toHaveAttribute(
    'alt',
    '맥에서 쿠버네티스 k3s 환경설정하기 대표 이미지',
  );
});

test('record pages show contextual hero alt text or no hero image at all', async ({ page }) => {
  await page.goto('/records/kubernetes-on-mac/k3s-with-multipass/');

  const heroImage = page.locator('.hero-image img');
  await expect(heroImage).toHaveAttribute('alt', /대표 이미지$/);
  await expect(heroImage).not.toHaveAttribute('alt', 'Image');

  // Posts without a hero image render no placeholder image at all.
  await page.goto('/records/concern/ai-work-learning-team/');
  await expect(page.locator('.hero-image')).toHaveCount(0);
});
