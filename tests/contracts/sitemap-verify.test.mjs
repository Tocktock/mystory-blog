import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { verifySitemap } from '../../scripts/verify-sitemap.mjs';

const site = 'https://ji-yong.com';
const noindexHead = '<meta name="robots" content="noindex, follow" />';

/** Writes a build directory with pages and, unless `listed` is null, a sitemap listing them. */
function buildFixture({ pages, listed }) {
  const outDir = mkdtempSync(join(tmpdir(), 'sitemap-verify-'));
  for (const [folder, head] of Object.entries(pages)) {
    mkdirSync(join(outDir, folder), { recursive: true });
    writeFileSync(join(outDir, folder, 'index.html'), `<html><head>${head}</head></html>`);
  }
  if (listed) {
    const urls = listed.map(
      (path) => `<url><loc>${new URL(path, site).href.replace(/&/g, '&amp;')}</loc></url>`,
    );
    writeFileSync(join(outDir, 'sitemap-0.xml'), `<urlset>${urls.join('')}</urlset>`);
    writeFileSync(
      join(outDir, 'sitemap-index.xml'),
      `<sitemapindex><sitemap><loc>${site}/sitemap-0.xml</loc></sitemap></sitemapindex>`,
    );
  }
  return outDir;
}

const pages = {
  '': '',
  'records/topic/post': '',
  'tags/백준': '',
  'tags/a&b': '',
  'tags/c%23': noindexHead,
  search: noindexHead,
};

test('sitemap check passes when the sitemap lists exactly the indexable pages', (t) => {
  const outDir = buildFixture({
    pages,
    listed: ['/', '/records/topic/post/', '/tags/백준/', '/tags/a&b/'],
  });
  t.after(() => rmSync(outDir, { recursive: true, force: true }));

  assert.deepEqual(verifySitemap(outDir), { errors: [], listed: 4, noindex: 2 });
});

test('sitemap check fails when the sitemap was not written', (t) => {
  const outDir = buildFixture({ pages, listed: null });
  t.after(() => rmSync(outDir, { recursive: true, force: true }));

  assert.match(verifySitemap(outDir).errors.join('\n'), /sitemap-index\.xml was not written/);
});

test('sitemap check reports missing, noindex and unknown URLs', (t) => {
  const outDir = buildFixture({
    pages,
    listed: ['/', '/tags/백준/', '/tags/a&b/', '/tags/c%23/', '/gone/'],
  });
  t.after(() => rmSync(outDir, { recursive: true, force: true }));

  assert.deepEqual(verifySitemap(outDir).errors.sort(), [
    '/gone/ is in the sitemap but has no built page',
    '/records/topic/post/ is indexable but missing from the sitemap',
    '/tags/c%23/ is noindex but listed in the sitemap',
  ]);
});
