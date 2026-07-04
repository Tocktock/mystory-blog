import { expect, test } from '@playwright/test';

test('sitemap exposes canonical record URLs only', async ({ request }) => {
  const response = await request.get('/sitemap-0.xml');
  expect(response.ok()).toBe(true);

  const sitemap = await response.text();

  expect(sitemap).toContain('<loc>https://ji-yong.com/records/</loc>');
  expect(sitemap).toContain(
    '<loc>https://ji-yong.com/records/kubernetes-on-mac/k3s-with-multipass/</loc>',
  );
  expect(sitemap).toContain('<loc>https://ji-yong.com/manyang-gureum/</loc>');
  expect(sitemap).not.toContain('https://ji-yong.com/blog/');
  expect(sitemap).not.toContain('https://ji-yong.com/cat-pics/');
});

test('rss feed keeps record-room canonical links', async ({ request }) => {
  const response = await request.get('/rss.xml');
  expect(response.ok()).toBe(true);

  const feed = await response.text();

  expect(feed).toContain('<title>지용의 기록실</title>');
  expect(feed).toContain('https://ji-yong.com/records/kubernetes-on-mac/k3s-with-multipass/');
  expect(feed).toContain('https://ji-yong.com/records/meta/ai-advisor-writing-partner/');
  expect(feed).not.toContain('https://ji-yong.com/blog/');
  expect(feed).not.toContain('/blog/');
});
