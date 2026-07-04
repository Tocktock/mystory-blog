import { access, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';

const DIST_ROOT = resolve(process.cwd(), 'dist');
const REPORT_DIR = resolve(process.cwd(), '.reports/static-links');
const REPORT_PATH = resolve(REPORT_DIR, 'report.json');
const LOCAL_ORIGIN = 'https://local.invalid';
const ATTRIBUTE_PATTERN = /\b(?:href|src|poster|action)=["']([^"']+)["']/gi;
const SRCSET_PATTERN = /\bsrcset=["']([^"']+)["']/gi;
const CSS_URL_PATTERN = /url\((['"]?)([^'")]+)\1\)/gi;
const SCRIPT_BLOCK_PATTERN = /<script\b[\s\S]*?<\/script>/gi;
const SKIPPED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:', 'data:', 'blob:']);

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(path)));
      continue;
    }

    if (entry.isFile() && extname(entry.name) === '.html') {
      files.push(path);
    }
  }

  return files.sort();
}

function routeBaseForHtmlFile(htmlFile) {
  const relativeFile = relative(DIST_ROOT, htmlFile).split(sep).join('/');

  if (relativeFile === 'index.html') {
    return `${LOCAL_ORIGIN}/`;
  }

  if (relativeFile.endsWith('/index.html')) {
    return `${LOCAL_ORIGIN}/${relativeFile.replace(/index\.html$/, '')}`;
  }

  return `${LOCAL_ORIGIN}/${relativeFile}`;
}

function extractReferences(html) {
  const staticHtml = html.replace(SCRIPT_BLOCK_PATTERN, '');
  const references = [];

  for (const match of staticHtml.matchAll(ATTRIBUTE_PATTERN)) {
    references.push(match[1]);
  }

  for (const match of staticHtml.matchAll(SRCSET_PATTERN)) {
    for (const candidate of match[1].split(',')) {
      const [url] = candidate.trim().split(/\s+/);

      if (url) {
        references.push(url);
      }
    }
  }

  for (const match of staticHtml.matchAll(CSS_URL_PATTERN)) {
    references.push(match[2]);
  }

  return references;
}

function normalizeLocalReference(reference, baseUrl) {
  const trimmed = reference.trim();

  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
    return null;
  }

  let url;
  try {
    url = new URL(trimmed, baseUrl);
  } catch {
    return { unresolved: true, reason: 'invalid-url', original: trimmed };
  }

  if (SKIPPED_PROTOCOLS.has(url.protocol) && url.origin !== LOCAL_ORIGIN) {
    return null;
  }

  if (url.origin !== LOCAL_ORIGIN) {
    return null;
  }

  return {
    original: trimmed,
    pathname: decodeURIComponent(url.pathname),
  };
}

function candidatePathsForPathname(pathname) {
  const cleanPathname = pathname.replace(/^\/+/, '');
  const directPath = resolve(DIST_ROOT, cleanPathname);
  const candidates = [directPath];

  if (pathname.endsWith('/')) {
    candidates.push(resolve(DIST_ROOT, cleanPathname, 'index.html'));
  } else if (!extname(pathname)) {
    candidates.push(resolve(DIST_ROOT, cleanPathname, 'index.html'));
    candidates.push(resolve(DIST_ROOT, `${cleanPathname}.html`));
  }

  return candidates;
}

async function resolveLocalReference(reference) {
  if (reference.unresolved) {
    return { ok: false, checked: [] };
  }

  const checked = candidatePathsForPathname(reference.pathname);

  for (const candidate of checked) {
    if (await pathExists(candidate)) {
      return {
        ok: true,
        checked: checked.map((path) => relative(process.cwd(), path)),
      };
    }
  }

  return {
    ok: false,
    checked: checked.map((path) => relative(process.cwd(), path)),
  };
}

async function run() {
  await mkdir(REPORT_DIR, { recursive: true });

  const distStats = await stat(DIST_ROOT).catch(() => null);
  if (!distStats?.isDirectory()) {
    console.error(
      '[audit] Static link check requires an existing dist/ directory. Run npm run build first.',
    );
    process.exitCode = 1;
    return;
  }

  const htmlFiles = await collectHtmlFiles(DIST_ROOT);
  const references = [];

  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, 'utf8');
    const source = relative(process.cwd(), htmlFile);
    const baseUrl = routeBaseForHtmlFile(htmlFile);

    for (const extractedReference of extractReferences(html)) {
      const normalized = normalizeLocalReference(extractedReference, baseUrl);

      if (!normalized) {
        continue;
      }

      const resolution = await resolveLocalReference(normalized);
      references.push({
        source,
        reference: normalized.original,
        pathname: normalized.pathname ?? null,
        ok: resolution.ok,
        checked: resolution.checked,
      });
    }
  }

  const brokenReferences = references.filter((reference) => !reference.ok);
  const summary = {
    htmlFileCount: htmlFiles.length,
    localReferenceCount: references.length,
    brokenReferenceCount: brokenReferences.length,
    distRoot: relative(process.cwd(), DIST_ROOT),
  };

  await writeFile(REPORT_PATH, JSON.stringify({ summary, brokenReferences }, null, 2), 'utf8');

  if (brokenReferences.length > 0) {
    console.error('[audit] Broken static local references found:');
    for (const reference of brokenReferences.slice(0, 20)) {
      console.error(` - ${reference.source}: ${reference.reference}`);
    }
    if (brokenReferences.length > 20) {
      console.error(` - and ${brokenReferences.length - 20} more`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `[audit] Static local link check passed - ${summary.htmlFileCount} HTML files, ${summary.localReferenceCount} local references, 0 broken.`,
  );
}

run().catch((error) => {
  console.error('[audit] Static local link check failed:', error);
  process.exitCode = 1;
});
