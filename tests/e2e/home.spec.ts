import { expect, test } from '@playwright/test';

test('homepage first viewport communicates JiYong identity and current desk', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: '지용의 기록실' })).toBeVisible();
  await expect(page.getByText(/Backend와 AI Agent 실험/)).toBeVisible();
  await expect(page.getByText(/만냥구름과 일상의 관찰/)).toBeVisible();
  const hero = page.locator('.home-hero');
  await expect(hero.getByRole('link', { name: '기록 보기', exact: true })).toHaveAttribute(
    'href',
    '/records',
  );
  await expect(hero.getByRole('link', { name: '시리즈 보기', exact: true })).toHaveAttribute(
    'href',
    '/series',
  );
  await expect(hero.getByRole('link', { name: /만냥구름 만나기/ })).toHaveAttribute(
    'href',
    '/manyang-gureum',
  );

  const currentDesk = page.getByRole('complementary', { name: '지금 책상 위' });
  await expect(currentDesk.getByText('최근 기록')).toBeVisible();
  await expect(currentDesk.getByText('쌓아둔 기록')).toBeVisible();
  await expect(currentDesk.getByText('이어가는 시리즈')).toBeVisible();
  await expect(currentDesk).toContainText(/\d+편/);
  await expect(currentDesk).toContainText(/\d+개/);
});

test('homepage mobile hero separates image and content without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 1200 });
  await page.goto('/');

  const imageBox = await page.locator('.home-hero__image').boundingBox();
  const overlayBox = await page.locator('.home-hero__overlay').boundingBox();
  expect(imageBox).not.toBeNull();
  expect(overlayBox).not.toBeNull();
  expect(overlayBox!.y).toBeGreaterThanOrEqual(imageBox!.y + imageBox!.height - 1);

  const pageOverflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    return Math.max(0, doc.scrollWidth - doc.clientWidth, body.scrollWidth - body.clientWidth);
  });
  expect(pageOverflow).toBe(0);
});

test('homepage bookshelf expresses JiYong mental map', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 2, name: '기록실 책장' })).toBeVisible();
  await expect(page.getByRole('link', { name: /AI & Agent 실험실/ })).toContainText(
    '사람이 판단해야 하는지',
  );
  await expect(page.getByRole('link', { name: /Backend 설계 노트/ })).toContainText(
    'API와 데이터 구조',
  );
  await expect(page.getByRole('link', { name: /문제를 다시 푸는 법/ })).toContainText(
    '원인과 선택지',
  );
  await expect(page.getByRole('link', { name: /만냥구름 관찰일지/ })).toContainText('돌봄과 관찰');
});

test('homepage introduces the creations studio', async ({ page }) => {
  await page.goto('/');

  const creations = page.getByRole('region', { name: '음악과 창작 실험' });
  await expect(creations).toBeVisible();
  await expect(creations.getByRole('link', { name: /창작 작업 보러가기/ })).toHaveAttribute(
    'href',
    '/creations',
  );
});
