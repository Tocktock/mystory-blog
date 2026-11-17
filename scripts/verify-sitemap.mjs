// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { indexBuiltPages, readPageMeta } from '../src/utils/sitemapSerialize.mjs';

/*
  Runs in `postbuild` and fails the build when the sitemap doesn't match the built pages.
  @astrojs/sitemap catches errors from its serialize hook, logs them and skips writing the
  sitemap, while `astro build` still exits 0, so without this check a deploy could ship with
  no sitemap at all. The sitemap must list every page without `noindex` and no page with it.
*/

/** @type {Record<string, string>} */
const xmlEntities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

/** @param {string} xml */
function readLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, loc]) =>
    loc.trim().replace(/&(amp|lt|gt|quot|apos);/g, (_, name) => xmlEntities[name]),
  );
}

/**
 * @param {string} outDir absolute path of the build output directory
 * @returns {{ errors: string[], listed: number, noindex: number }}
 */
export function verifySitemap(outDir) {
  const indexFile = join(outDir, 'sitemap-index.xml');
  if (!existsSync(indexFile)) {
    return {
      errors: ['sitemap-index.xml was not written; look for an @astrojs/sitemap error above'],
      listed: 0,
      noindex: 0,
    };
  }

  const errors = [];
  const listed = new Set();
  for (const sitemapUrl of readLocs(readFileSync(indexFile, 'utf8'))) {
    const sitemapFile = join(outDir, new URL(sitemapUrl).pathname);
    if (!existsSync(sitemapFile)) {
      errors.push(`${sitemapUrl} is in sitemap-index.xml but was not written`);
      continue;
    }
    for (const pageUrl of readLocs(readFileSync(sitemapFile, 'utf8'))) {
      listed.add(new URL(pageUrl).pathname);
    }
  }

  let noindex = 0;
  const pages = indexBuiltPages(outDir);
  for (const [path, htmlFile] of pages) {
    if (readPageMeta(readFileSync(htmlFile, 'utf8')).noindex) {
      noindex += 1;
      if (listed.has(path)) errors.push(`${path} is noindex but listed in the sitemap`);
    } else if (!listed.has(path)) {
      errors.push(`${path} is indexable but missing from the sitemap`);
    }
  }
  for (const path of listed) {
    if (!pages.has(path)) errors.push(`${path} is in the sitemap but has no built page`);
  }
  return { errors, listed: listed.size, noindex };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { errors, listed, noindex } = verifySitemap(
    fileURLToPath(new URL('../dist/', import.meta.url)),
  );
  if (errors.length > 0) {
    const shown = errors.slice(0, 20).map((error) => `  - ${error}`);
    if (errors.length > shown.length) shown.push(`  ...and ${errors.length - shown.length} more`);
    console.error(`Sitemap check failed:\n${shown.join('\n')}`);
    process.exitCode = 1;
  } else {
    console.log(`Sitemap check passed: ${listed} URLs listed, ${noindex} noindex pages left out.`);
  }
}
