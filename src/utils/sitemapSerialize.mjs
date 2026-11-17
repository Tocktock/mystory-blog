// @ts-check
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/*
  The sitemap reads each page's built HTML so the page stays the single source of truth:
  pages marked `noindex` (site search, one-post tags) are left out, and posts get `lastmod`
  from their `article:modified_time`. @astrojs/sitemap calls this after every page is written.
  scripts/verify-sitemap.mjs checks the result in `postbuild`.
*/

/**
 * Turns a folder under the build directory into the URL path @astrojs/sitemap lists for it.
 * Astro names folders after the page path and saves `#` and `?` as `%23` and `%3F`, so a tag
 * such as `C#` lives in `tags/c%23/`. Reading the folder name as a URL path gives the same
 * string as the sitemap URL, with Korean percent-encoded and `%23` left alone; decoding the
 * URL into a file name instead would look for `tags/c#/` and miss the page.
 * @param {string} folder folder path relative to the build directory
 */
function toUrlPath(folder) {
  const route = folder.split(sep).join('/');
  return route ? new URL(`/${route}/`, 'http://localhost').pathname : '/';
}

/**
 * Maps each built page's URL path to its `index.html` file.
 * @param {string} outDir absolute path of the build output directory
 * @returns {Map<string, string>}
 */
export function indexBuiltPages(outDir) {
  const pages = new Map();
  /** @param {string} dir */
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const entryPath = join(dir, entry.name);
      if (entry.isDirectory()) walk(entryPath);
      else if (entry.name === 'index.html') pages.set(toUrlPath(relative(outDir, dir)), entryPath);
    }
  };
  walk(outDir);
  return pages;
}

/**
 * Reads the robots and modified-date meta tags, whatever their attribute order or quoting.
 * @param {string} html
 * @returns {{ noindex: boolean, modified: string | undefined }}
 */
export function readPageMeta(html) {
  const tags = [...html.matchAll(/<meta\b([^>]*)>/gi)].map(([, attributes]) => {
    /** @type {Record<string, string>} */
    const attrs = {};
    for (const [, name, double, single, bare] of attributes.matchAll(
      /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g,
    )) {
      attrs[name.toLowerCase()] = double ?? single ?? bare;
    }
    return attrs;
  });
  return {
    noindex: tags.some(
      (attrs) => attrs.name?.toLowerCase() === 'robots' && /\bnoindex\b/i.test(attrs.content ?? ''),
    ),
    modified: tags.find((attrs) => attrs.property === 'article:modified_time')?.content,
  };
}

/**
 * @param {string} outDir absolute path of the build output directory
 * @returns {(item: import('@astrojs/sitemap').SitemapItem) => import('@astrojs/sitemap').SitemapItem | undefined}
 */
export function createSitemapSerializer(outDir) {
  /** @type {Map<string, string> | undefined} */
  let pages;
  return (item) => {
    // Indexed on the first call, once every page has been written.
    pages ??= indexBuiltPages(outDir);
    const htmlFile = pages.get(new URL(item.url).pathname);
    if (htmlFile === undefined) return item;

    const { noindex, modified } = readPageMeta(readFileSync(htmlFile, 'utf8'));
    if (noindex) return undefined;
    return modified ? { ...item, lastmod: modified } : item;
  };
}
