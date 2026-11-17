import { expect, test } from '@playwright/test';

test('homepage first viewport communicates JiYong identity and current desk', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: '지용의 기록실' })).toBeVisible();
  await expect(page.getByText(/AI와 Agent로 이것저것 만들어 본/)).toBeVisible();
  await expect(page.getByText(/만냥이와 구름이의 일상/)).toBeVisible();
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

  const atAGlance = page.getByRole('complementary', { name: '한눈에 보기' });
  await expect(atAGlance.getByText('최근 글')).toBeVisible();
  await expect(atAGlance.getByText('전체 글')).toBeVisible();
  await expect(atAGlance.getByText('시리즈', { exact: true })).toBeVisible();
  await expect(atAGlance).toContainText(/\d+편/);
  await expect(atAGlance).toContainText(/\d+개/);
});

test('homepage mobile hero keeps the title clear of the desk panel without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 1200 });
  await page.goto('/');

  const titleBox = await page
    .getByRole('heading', { level: 1, name: '지용의 기록실' })
    .boundingBox();
  const deskBox = await page.getByRole('complementary', { name: '한눈에 보기' }).boundingBox();
  expect(titleBox).not.toBeNull();
  expect(deskBox).not.toBeNull();
  expect(titleBox!.x).toBeGreaterThanOrEqual(0);
  expect(titleBox!.x + titleBox!.width).toBeLessThanOrEqual(360);
  expect(deskBox!.y).toBeGreaterThanOrEqual(titleBox!.y + titleBox!.height);

  const pageOverflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    return Math.max(0, doc.scrollWidth - doc.clientWidth, body.scrollWidth - body.clientWidth);
  });
  expect(pageOverflow).toBe(0);
});

test('homepage bookshelf expresses JiYong mental map', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 2, name: '주제별로 보기' })).toBeVisible();
  await expect(page.getByRole('link', { name: /AI & Agent 실험실/ })).toContainText(
    '사람이 판단해야 하는지',
  );
  await expect(page.getByRole('link', { name: /Backend 설계 노트/ })).toContainText(
    'API와 데이터 구조',
  );
  await expect(page.getByRole('link', { name: /문제를 다시 푸는 법/ })).toContainText(
    '원인과 선택지',
  );
  await expect(page.getByRole('link', { name: /만냥구름 관찰일지/ })).toContainText(
    '돌보며 알게 된',
  );
});

test('homepage introduces the creations studio', async ({ page }) => {
  await page.goto('/');

  const creations = page.getByRole('region', { name: 'AI로 만드는 노래' });
  await expect(creations).toBeVisible();
  await expect(creations.getByRole('link', { name: /노래 들으러 가기/ })).toHaveAttribute(
    'href',
    '/creations',
  );
});
