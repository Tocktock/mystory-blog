import { test, expect } from '@playwright/test';

test('giscus discussion widget renders on blog posts', async ({ page }) => {
	await page.goto('/blog');

	const firstPostLink = page.locator('.post-card a').first();
	await expect(firstPostLink).toBeVisible();

	const targetHref = await firstPostLink.getAttribute('href');
	await firstPostLink.click();

	if (targetHref) {
		await expect(page).toHaveURL(new RegExp(`${targetHref.replace(/\//g, '\\/')}$`));
	}

	await expect(page.locator('section#comments')).toBeVisible();
	await expect(page.locator('iframe.giscus-frame')).toBeVisible({ timeout: 20_000 });
});
