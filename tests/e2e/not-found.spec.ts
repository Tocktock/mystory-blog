import { expect, test } from '@playwright/test';

test('404 page uses restrained record-room empty-state copy', async ({ page }) => {
  await page.goto('/missing-record-drawer-for-i08/');

  await expect(page.getByRole('heading', { level: 2, name: '비어 있는 서랍입니다' })).toBeVisible();
  await expect(page.getByText('주소가 바뀌었거나 아직 공개되지 않은 기록입니다')).toBeVisible();
  await expect(page.getByRole('link', { name: '기록으로 돌아가기' })).toHaveAttribute(
    'href',
    '/records',
  );
  await expect(page.getByRole('link', { name: '검색 서랍 열기' })).toHaveAttribute(
    'href',
    '/search',
  );
  await expect(page.getByRole('link', { name: '만냥구름 사진첩 보기' })).toHaveAttribute(
    'href',
    '/manyang-gureum',
  );
  await expect(page.getByText('숨겨둔')).toHaveCount(0);
});
