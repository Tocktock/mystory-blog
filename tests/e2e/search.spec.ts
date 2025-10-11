import { test, expect } from '@playwright/test';

test('site search returns results for known keywords', async ({ page }) => {
	await page.goto('/search');

	await page.waitForSelector('#search input', { timeout: 10000 });
	const searchBox = page.locator('#search input');
	await expect(searchBox).toBeVisible();

	await searchBox.fill('kubernetes');
	await searchBox.press('Enter');
	const results = page.locator('.pagefind-ui__result');
	await expect(results.first()).toBeVisible({ timeout: 15000 });
	await expect(results.first()).toContainText(/kubernetes/i);
});
