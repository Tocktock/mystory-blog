import { test, expect } from '@playwright/test';

test('primary navigation highlights the active page', async ({ page }) => {
	await page.goto('/');

	const primaryNav = page.getByRole('navigation', { name: 'Primary' });
	const blogLink = primaryNav.getByRole('link', { name: 'Blog', exact: true });
	await blogLink.click();

	await expect(page).toHaveURL(/\/blog\/?$/);
	await expect(blogLink).toHaveAttribute('aria-current', 'page');
});
