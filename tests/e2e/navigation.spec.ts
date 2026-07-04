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
  const recordsLink = primaryNav.getByRole('link', {
    name: '기록',
    exact: true,
    includeHidden: true,
  });

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

test('theme toggle switches and persists dark mode state', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');

  const root = page.locator('html');
  const themeToggle = page.locator('[data-theme-toggle]');

  await expect(root).toHaveAttribute('data-theme', 'light');
  await expect(themeToggle).toHaveAttribute('aria-label', 'Switch to dark mode');
  await expect(themeToggle).toHaveAttribute('aria-pressed', 'false');

  await themeToggle.click();

  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect(themeToggle).toHaveAttribute('aria-label', 'Switch to light mode');
  await expect(themeToggle).toHaveAttribute('aria-pressed', 'true');
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('preferred-color-scheme')))
    .toBe('dark');

  await page.reload();

  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('[data-theme-toggle]')).toHaveAttribute(
    'aria-label',
    'Switch to light mode',
  );
});
