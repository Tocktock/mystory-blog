import { test, expect } from '@playwright/test';

test('primary navigation highlights the active page', async ({ page }) => {
	await page.goto('/');

	const primaryNav = page.getByRole('navigation', { name: 'Primary' });
	const recordsLink = primaryNav.getByRole('link', { name: '기록', exact: true });
	await recordsLink.click();

	await expect(page).toHaveURL(/\/records\/?$/);
	await expect(recordsLink).toHaveAttribute('aria-current', 'page');
});
