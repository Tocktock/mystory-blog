import { test, expect } from '@playwright/test';

test('primary navigation highlights the active page', async ({ page }) => {
	await page.goto('/');

	const primaryNav = page.getByRole('navigation', { name: 'Primary' });
	const recordsLink = primaryNav.getByRole('link', { name: '기록', exact: true });
	await recordsLink.click();

	await expect(page).toHaveURL(/\/records\/?$/);
	await expect(recordsLink).toHaveAttribute('aria-current', 'page');
});

test('collapsed mobile navigation keeps hidden links out of focus order', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');

	const primaryNav = page.getByRole('navigation', { name: 'Primary' });
	const navToggle = primaryNav.getByRole('button', { name: 'Toggle navigation' });
	const recordsLink = primaryNav.getByRole('link', { name: '기록', exact: true, includeHidden: true });

	await expect(navToggle).toHaveAttribute('aria-expanded', 'false');
	await expect(recordsLink).not.toBeVisible();

	const focusedWhileCollapsed = await recordsLink.evaluate((element) => {
		if (!(element instanceof HTMLElement)) {
			return false;
		}
		element.focus();
		return document.activeElement === element;
	});

	expect(focusedWhileCollapsed).toBe(false);

	await navToggle.click();

	await expect(navToggle).toHaveAttribute('aria-expanded', 'true');
	await expect(recordsLink).toBeVisible();
	await recordsLink.focus();
	await expect(recordsLink).toBeFocused();
});
