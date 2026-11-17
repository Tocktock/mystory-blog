import { test, expect } from '@playwright/test';

test('INDEX menu opens primary navigation and highlights the active page', async ({ page }) => {
  await page.goto('/');

  const indexButton = page.getByRole('button', { name: 'INDEX' });
  await expect(indexButton).toHaveAttribute('aria-haspopup', 'dialog');
  await indexButton.click();

  const primaryNav = page.getByRole('navigation', { name: 'Primary' });
  await primaryNav.getByRole('link', { name: '기록', exact: true }).click();
  await expect(page).toHaveURL(/\/records\/?$/);

  await page.getByRole('button', { name: 'INDEX' }).click();
  await expect(
    page.getByRole('navigation', { name: 'Primary' }).getByRole('link', {
      name: '기록',
      exact: true,
    }),
  ).toHaveAttribute('aria-current', 'page');
});

test('closed INDEX menu keeps hidden links out of focus order on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const indexButton = page.getByRole('button', { name: 'INDEX' });
  // A closed <dialog> is out of the accessibility tree, so locate the menu link structurally.
  const recordsLink = page.locator('#index-dialog nav[aria-label="Primary"] a[href="/records"]');

  await expect(indexButton).toHaveAttribute('aria-expanded', 'false');
  await expect(recordsLink).not.toBeVisible();

  const focusedWhileClosed = await recordsLink.evaluate((element) => {
    if (!(element instanceof HTMLElement)) {
      return false;
    }
    element.focus();
    return document.activeElement === element;
  });

  expect(focusedWhileClosed).toBe(false);

  await indexButton.click();

  await expect(indexButton).toHaveAttribute('aria-expanded', 'true');
  await expect(recordsLink).toBeVisible();
  await recordsLink.focus();
  await expect(recordsLink).toBeFocused();
});

test('Escape closes the INDEX menu and returns focus to its button', async ({ page }) => {
  await page.goto('/');

  const indexButton = page.getByRole('button', { name: 'INDEX' });
  await indexButton.click();
  await expect(page.getByRole('dialog')).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(indexButton).toHaveAttribute('aria-expanded', 'false');
  await expect(indexButton).toBeFocused();
});

test('site is dark only and offers no theme toggle', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');

  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#020304');
  await expect(page.locator('[data-theme-toggle]')).toHaveCount(0);

  const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(background).toBe('rgb(2, 3, 4)');
});

test('footer navigation keeps every section reachable', async ({ page }) => {
  await page.goto('/');

  const footerNav = page.getByRole('navigation', { name: '사이트 바로가기' });
  for (const [name, href] of [
    ['기록', '/records'],
    ['시리즈', '/series'],
    ['창작', '/creations'],
    ['이력', '/career'],
    ['소개', '/about'],
    ['만냥구름', '/manyang-gureum'],
    ['검색', '/search'],
  ]) {
    await expect(footerNav.getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
  }
});
