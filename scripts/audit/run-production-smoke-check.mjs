import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PERSONA_AUDIT_ROUTES } from './persona-audit-routes.mjs';

const RAW_BASE_URL = process.env.PERSONA_PRODUCTION_BASE_URL?.trim();
const EXPECTED_DEPLOY_SHA = process.env.EXPECTED_DEPLOY_SHA?.trim().toLowerCase();
const REPORT_DIR = resolve(process.cwd(), '.reports/production-smoke');
const REPORT_PATH = resolve(REPORT_DIR, 'report.json');
const REQUEST_TIMEOUT_MS = 15_000;
const FULL_SHA_PATTERN = /^[0-9a-f]{40}$/;
const ATTRIBUTE_PATTERN = /\b(?:href|src|poster|action)=["']([^"']+)["']/gi;
const SRCSET_PATTERN = /\bsrcset=["']([^"']+)["']/gi;
const CSS_URL_PATTERN = /url\((['"]?)([^'")]+)\1\)/gi;
const SCRIPT_BLOCK_PATTERN = /<script\b[\s\S]*?<\/script>/gi;
const SKIPPED_PROTOCOLS = new Set(['mailto:', 'tel:', 'data:', 'blob:']);
const CRITICAL_ASSET_EXTENSIONS = new Set([
  '.avif',
  '.css',
  '.ico',
  '.jpg',
  '.jpeg',
  '.js',
  '.json',
  '.png',
  '.svg',
  '.txt',
  '.webmanifest',
  '.webp',
  '.xml',
]);
const EXPLICIT_CRITICAL_PATHS = [
  '/rss.xml',
  '/sitemap-index.xml',
  '/og/meta/ai-advisor-writing-partner.png',
  '/pagefind/pagefind-ui.js',
  '/pagefind/pagefind-ui.css',
];

function normalizeBaseUrl(rawBaseUrl) {
  if (!rawBaseUrl) {
    return null;
  }

  const url = new URL(rawBaseUrl);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('PERSONA_PRODUCTION_BASE_URL must use http or https.');
  }

  url.hash = '';
  url.search = '';
  return url;
}

function urlFor(baseUrl, path) {
  return new URL(path, baseUrl).toString();
}

async function fetchWithTimeout(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'mystory-blog-persona-production-smoke/1.0',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  return {
    finalUrl: response.url,
    status: response.status,
    ok: response.ok,
    contentType: response.headers.get('content-type') ?? '',
    text: await response.text(),
  };
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

function normalizeLocalReference(reference, baseUrl, pageUrl) {
  const trimmed = reference.trim();

  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
    return null;
  }

  let url;
  try {
    url = new URL(trimmed, pageUrl);
  } catch {
    return {
      original: trimmed,
      unresolved: true,
      reason: 'invalid-url',
    };
  }

  if (SKIPPED_PROTOCOLS.has(url.protocol)) {
    return null;
  }

  if (url.origin !== baseUrl.origin) {
    return null;
  }

  url.hash = '';
  return {
    original: trimmed,
    href: url.toString(),
    pathname: url.pathname,
  };
}

function extensionForPathname(pathname) {
  const lastSegment = pathname.split('/').pop() ?? '';
  const dotIndex = lastSegment.lastIndexOf('.');

  if (dotIndex === -1) {
    return '';
  }

  return lastSegment.slice(dotIndex).toLowerCase();
}

function isCriticalAsset(reference) {
  if (!reference?.pathname) {
    return false;
  }

  return (
    reference.pathname.startsWith('/_astro/') ||
    reference.pathname.startsWith('/pagefind/') ||
    reference.pathname.startsWith('/og/') ||
    CRITICAL_ASSET_EXTENSIONS.has(extensionForPathname(reference.pathname))
  );
}

function uniqueByHref(references) {
  const byHref = new Map();

  for (const reference of references) {
    if (!reference?.href || byHref.has(reference.href)) {
      continue;
    }

    byHref.set(reference.href, reference);
  }

  return [...byHref.values()].sort((a, b) => a.href.localeCompare(b.href));
}

function summarizeGiscus(recordHtml) {
  const hasScript = recordHtml.includes('https://giscus.app/client.js');
  const hasPlaceholder = recordHtml.includes('Giscus comments are not configured yet');

  return {
    configuredScriptPresent: hasScript,
    placeholderPresent: hasPlaceholder,
    acceptable: hasScript || hasPlaceholder,
  };
}

async function writeBlockedReport(reason, requiredEnv) {
  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(
    REPORT_PATH,
    JSON.stringify(
      {
        status: 'blocked',
        reason,
        requiredEnv,
      },
      null,
      2,
    ),
    'utf8',
  );
}

async function readBuildIdentity(baseUrl) {
  const url = urlFor(baseUrl, '/build-info.json');
  const response = await fetchWithTimeout(url);
  let buildInfo = null;

  try {
    buildInfo = JSON.parse(response.text);
  } catch {
    // The validation result below records a bounded public error without
    // copying an arbitrary response body into the report.
  }

  const publishedKeys =
    buildInfo && typeof buildInfo === 'object' ? Object.keys(buildInfo).sort() : [];
  const allowedKeys = ['buildTime', 'commitSha', 'environment'];
  const keysAreSafe = JSON.stringify(publishedKeys) === JSON.stringify(allowedKeys);
  const actualSha =
    typeof buildInfo?.commitSha === 'string' ? buildInfo.commitSha.toLowerCase() : '';
  const shaIsValid = FULL_SHA_PATTERN.test(actualSha);
  const matchesExpectedSha = shaIsValid && actualSha === EXPECTED_DEPLOY_SHA;

  return {
    url,
    status: response.status,
    contentType: response.contentType,
    publishedKeys,
    keysAreSafe,
    commitSha: shaIsValid ? actualSha : null,
    environment: typeof buildInfo?.environment === 'string' ? buildInfo.environment : null,
    buildTime: typeof buildInfo?.buildTime === 'string' ? buildInfo.buildTime : null,
    expectedSha: EXPECTED_DEPLOY_SHA,
    matchesExpectedSha,
  };
}

async function failBuildIdentity(buildIdentity) {
  const issues = [];

  if (buildIdentity.status !== 200) {
    issues.push({ rule: 'build-info-status', message: 'Build info did not return HTTP 200.' });
  }
  if (!buildIdentity.keysAreSafe) {
    issues.push({
      rule: 'build-info-publication-safety',
      message: 'Build info exposes missing or unexpected fields.',
    });
  }
  if (!buildIdentity.matchesExpectedSha) {
    issues.push({
      rule: 'deployment-sha',
      message: `deployment SHA mismatch: expected ${EXPECTED_DEPLOY_SHA}, received ${buildIdentity.commitSha ?? 'invalid'}`,
    });
  }

  if (issues.length === 0) {
    return false;
  }

  await writeFile(
    REPORT_PATH,
    JSON.stringify({ status: 'failed', buildIdentity, issues }, null, 2),
    'utf8',
  );
  console.error(
    `[audit] Production smoke check failed - ${issues.length} build identity issue(s).`,
  );
  for (const issue of issues) {
    console.error(` - ${issue.rule}: ${issue.message}`);
  }
  process.exitCode = 1;
  return true;
}

async function run() {
  await mkdir(REPORT_DIR, { recursive: true });

  if (!RAW_BASE_URL) {
    const reason = 'Set PERSONA_PRODUCTION_BASE_URL to the deployed site URL before running.';
    await writeBlockedReport(reason, 'PERSONA_PRODUCTION_BASE_URL');
    console.error(`[audit] Production smoke check blocked - ${reason}`);
    process.exitCode = 1;
    return;
  }

  if (!EXPECTED_DEPLOY_SHA || !FULL_SHA_PATTERN.test(EXPECTED_DEPLOY_SHA)) {
    const reason = 'Set EXPECTED_DEPLOY_SHA to the full 40-character reviewed commit SHA.';
    await writeBlockedReport(reason, 'EXPECTED_DEPLOY_SHA');
    console.error(`[audit] Production smoke check blocked - ${reason}`);
    process.exitCode = 1;
    return;
  }

  const baseUrl = normalizeBaseUrl(RAW_BASE_URL);
  const buildIdentity = await readBuildIdentity(baseUrl);
  if (await failBuildIdentity(buildIdentity)) {
    return;
  }
  const routeResults = [];
  const extractedReferences = [];

  for (const routeConfig of PERSONA_AUDIT_ROUTES) {
    const pageUrl = urlFor(baseUrl, routeConfig.route);
    const response = await fetchWithTimeout(pageUrl);
    const missingText = routeConfig.requiredText.filter((text) => !response.text.includes(text));

    routeResults.push({
      name: routeConfig.name,
      route: routeConfig.route,
      url: pageUrl,
      finalUrl: response.finalUrl,
      status: response.status,
      expectedStatus: routeConfig.expectedStatus,
      statusMatches: response.status === routeConfig.expectedStatus,
      missingText,
    });

    for (const reference of extractReferences(response.text)) {
      const normalized = normalizeLocalReference(reference, baseUrl, pageUrl);

      if (normalized) {
        extractedReferences.push(normalized);
      }
    }
  }

  const explicitCriticalReferences = EXPLICIT_CRITICAL_PATHS.map((pathname) => ({
    original: pathname,
    href: urlFor(baseUrl, pathname),
    pathname,
  }));
  const criticalAssetReferences = uniqueByHref([
    ...extractedReferences.filter(isCriticalAsset),
    ...explicitCriticalReferences,
  ]);
  const criticalAssetResults = [];

  for (const reference of criticalAssetReferences) {
    try {
      const response = await fetchWithTimeout(reference.href);
      criticalAssetResults.push({
        href: reference.href,
        pathname: reference.pathname,
        status: response.status,
        ok: response.status >= 200 && response.status < 400,
        contentType: response.contentType,
      });
    } catch (error) {
      criticalAssetResults.push({
        href: reference.href,
        pathname: reference.pathname,
        status: null,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const routeStatusMismatches = routeResults.filter((result) => !result.statusMatches);
  const missingTextIssues = routeResults.filter((result) => result.missingText.length > 0);
  const brokenCriticalAssets = criticalAssetResults.filter((result) => !result.ok);
  const pagefindAssetCount = criticalAssetResults.filter((result) =>
    result.pathname.startsWith('/pagefind/'),
  ).length;
  const recordDetail = routeResults.find((result) => result.name === 'record-detail-new');
  const recordDetailResponse = recordDetail ? await fetchWithTimeout(recordDetail.url) : null;
  const giscus = summarizeGiscus(recordDetailResponse?.text ?? '');
  const issues = [
    ...routeStatusMismatches.map((result) => ({
      rule: 'route-status',
      message: `${result.route} expected ${result.expectedStatus}, received ${result.status}`,
    })),
    ...missingTextIssues.map((result) => ({
      rule: 'route-required-text',
      message: `${result.route} missing required text: ${result.missingText.join(', ')}`,
    })),
    ...brokenCriticalAssets.map((result) => ({
      rule: 'critical-asset',
      message: `${result.pathname} did not load with a 2xx/3xx status`,
    })),
  ];

  if (pagefindAssetCount === 0) {
    issues.push({
      rule: 'pagefind-assets',
      message: 'No /pagefind/ assets were found or checked.',
    });
  }

  if (!giscus.acceptable) {
    issues.push({
      rule: 'giscus-state',
      message: 'Record detail page has neither configured Giscus script nor placeholder copy.',
    });
  }

  const summary = {
    baseUrl: baseUrl.toString(),
    routeCount: routeResults.length,
    routeStatusMismatchCount: routeStatusMismatches.length,
    missingTextIssueCount: missingTextIssues.length,
    criticalAssetCount: criticalAssetResults.length,
    brokenCriticalAssetCount: brokenCriticalAssets.length,
    pagefindAssetCount,
    giscus,
    issueCount: issues.length,
  };

  await writeFile(
    REPORT_PATH,
    JSON.stringify(
      {
        status: issues.length === 0 ? 'passed' : 'failed',
        buildIdentity,
        summary,
        issues,
        routeResults,
        criticalAssetResults,
      },
      null,
      2,
    ),
    'utf8',
  );

  if (issues.length > 0) {
    console.error(`[audit] Production smoke check failed - ${issues.length} issue(s).`);
    for (const issue of issues.slice(0, 30)) {
      console.error(` - ${issue.rule}: ${issue.message}`);
    }
    if (issues.length > 30) {
      console.error(` - and ${issues.length - 30} more`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `[audit] Production smoke check passed - ${summary.routeCount} routes, ${summary.criticalAssetCount} critical assets, ${summary.pagefindAssetCount} Pagefind assets, 0 issues.`,
  );
}

run().catch(async (error) => {
  console.error('[audit] Production smoke check failed:', error);
  process.exitCode = 1;
});
