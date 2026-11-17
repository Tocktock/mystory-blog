import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createSitemapSerializer } from '../../src/utils/sitemapSerialize.mjs';

const site = 'https://ji-yong.com';
const noindexHead = '<meta name="robots" content="noindex, follow" />';
const articleHead = '<meta property="article:modified_time" content="2026-11-17T00:00:00.000Z" />';

/**
 * Writes `<folder>/index.html` files into a temporary build directory. Folder names follow
 * what Astro writes: `#` and `?` saved as `%23` and `%3F`, Korean and `&` left as they are.
 */
function buildFixture(pages) {
  const outDir = mkdtempSync(join(tmpdir(), 'sitemap-serialize-'));
  for (const [folder, head] of Object.entries(pages)) {
    mkdirSync(join(outDir, folder), { recursive: true });
    writeFileSync(join(outDir, folder, 'index.html'), `<html><head>${head}</head></html>`);
  }
  return outDir;
}

// @astrojs/sitemap builds each URL from the page path the same way.
const item = (path) => ({ url: new URL(path, site).href });

test('sitemap serializer finds tag pages saved with %23, %3F, Korean or & in the folder name', (t) => {
  // A `C` and a `C#` tag: decoding `/tags/c%23/` into a file path would look in `tags/c#/`.
  const outDir = buildFixture({
    'tags/c': '',
    'tags/c%23': noindexHead,
    'tags/c%3F': noindexHead,
    'tags/백준': '',
    'tags/a&b': noindexHead,
  });
  t.after(() => rmSync(outDir, { recursive: true, force: true }));
  const serialize = createSitemapSerializer(outDir);

  assert.deepEqual(serialize(item('/tags/c/')), item('/tags/c/'));
  assert.equal(serialize(item('/tags/c%23/')), undefined);
  assert.equal(serialize(item('/tags/c%3F/')), undefined);
  assert.deepEqual(serialize(item('/tags/백준/')), item('/tags/백준/'));
  assert.equal(serialize(item('/tags/a&b/')), undefined);
});

test('sitemap serializer drops noindex pages, dates posts and keeps unknown URLs', (t) => {
  const outDir = buildFixture({
    search: noindexHead,
    'tags/reordered': `<meta content='noindex' name=robots>`,
    'records/topic/post': articleHead,
    about: '',
  });
  t.after(() => rmSync(outDir, { recursive: true, force: true }));
  const serialize = createSitemapSerializer(outDir);

  assert.equal(serialize(item('/search/')), undefined);
  assert.equal(serialize(item('/tags/reordered/')), undefined);
  assert.equal(serialize(item('/records/topic/post/')).lastmod, '2026-11-17T00:00:00.000Z');
  assert.equal(serialize(item('/about/')).lastmod, undefined);
  assert.deepEqual(serialize(item('/missing/')), item('/missing/'));
});
