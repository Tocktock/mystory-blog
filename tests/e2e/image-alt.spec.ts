import { expect, test } from '@playwright/test';

test('record hero images expose contextual alt text', async ({ page }) => {
  await page.goto('/records/kubernetes-on-mac/k3s-with-multipass/');

  await expect(page.locator('.hero-image img')).toHaveAttribute(
    'alt',
    '맥에서 쿠버네티스 k3s 환경설정하기 대표 이미지',
  );
});

test('record listing hero images expose contextual alt text', async ({ page }) => {
  await page.goto('/records');

  const firstCardImage = page.locator('.record-card img').first();
  await expect(firstCardImage).toHaveAttribute('alt', /대표 이미지$/);
  await expect(firstCardImage).not.toHaveAttribute('alt', 'Image');
});
