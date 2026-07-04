import { mkdir, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { PERSONA_AUDIT_ROUTES, RESPONSIVE_WIDTHS } from './persona-audit-routes.mjs';

const BASE_URL = 'http://127.0.0.1:4321';
const REPORT_DIR = resolve(process.cwd(), '.reports/responsive');
const SCREENSHOT_DIR = resolve(REPORT_DIR, 'screenshots');
const REPORT_PATH = resolve(REPORT_DIR, 'report.json');

function toRelativePath(path) {
  return relative(process.cwd(), path);
}

async function waitForStableResponsiveSurface(page, routeName) {
  await page.evaluate(async () => {
    if (globalThis.document.fonts?.ready) {
      await globalThis.document.fonts.ready;
    }
  });

  if (routeName === 'search') {
    await page.waitForTimeout(900);
  }
}

async function collectPageMetrics(page, requiredText) {
  return await page.evaluate((texts) => {
    const doc = globalThis.document.documentElement;
    const body = globalThis.document.body;
    const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
    const clientWidth = doc.clientWidth;
    const bodyText = body.innerText ?? '';

    return {
      clientWidth,
      scrollWidth,
      pageOverflow: Math.max(0, scrollWidth - clientWidth),
      missingText: texts.filter((text) => !bodyText.includes(text)),
    };
  }, requiredText);
}

async function run() {
  await mkdir(SCREENSHOT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const results = [];

  try {
    for (const routeConfig of PERSONA_AUDIT_ROUTES) {
      for (const width of RESPONSIVE_WIDTHS) {
        const page = await browser.newPage({ viewport: { width, height: 1200 } });
        const response = await page.goto(`${BASE_URL}${routeConfig.route}`, {
          waitUntil: 'networkidle',
        });
        const status = response?.status() ?? null;

        await waitForStableResponsiveSurface(page, routeConfig.name);
        const metrics = await collectPageMetrics(page, routeConfig.requiredText);
        const screenshotPath = resolve(
          SCREENSHOT_DIR,
          `${String(width).padStart(4, '0')}-${routeConfig.name}.png`,
        );

        await page.screenshot({ path: screenshotPath, fullPage: true });
        await page.close();

        results.push({
          name: routeConfig.name,
          route: routeConfig.route,
          width,
          status,
          expectedStatus: routeConfig.expectedStatus,
          statusMatches: status === routeConfig.expectedStatus,
          screenshot: toRelativePath(screenshotPath),
          ...metrics,
        });
      }
    }
  } finally {
    await browser.close();
  }

  const overflowIssues = results.filter((result) => result.pageOverflow > 0);
  const missingTextIssues = results.filter((result) => result.missingText.length > 0);
  const statusMismatches = results.filter((result) => !result.statusMatches);
  const summary = {
    routeCount: PERSONA_AUDIT_ROUTES.length,
    widthCount: RESPONSIVE_WIDTHS.length,
    screenshotCount: results.length,
    widths: RESPONSIVE_WIDTHS,
    overflowIssueCount: overflowIssues.length,
    missingTextIssueCount: missingTextIssues.length,
    statusMismatchCount: statusMismatches.length,
    reportPath: toRelativePath(REPORT_PATH),
    screenshotDirectory: toRelativePath(SCREENSHOT_DIR),
    routes: PERSONA_AUDIT_ROUTES.map((route) => ({
      name: route.name,
      route: route.route,
      expectedStatus: route.expectedStatus,
      requiredText: route.requiredText,
    })),
  };

  await writeFile(REPORT_PATH, JSON.stringify({ summary, results }, null, 2), 'utf8');

  if (statusMismatches.length > 0) {
    console.error('[audit] Responsive status mismatches found:');
    for (const result of statusMismatches) {
      console.error(
        ` - ${result.route} at ${result.width}px: expected ${result.expectedStatus}, received ${result.status}`,
      );
    }
    process.exitCode = 1;
  }

  if (overflowIssues.length > 0) {
    console.error('[audit] Responsive overflow issues found:');
    for (const result of overflowIssues) {
      console.error(` - ${result.route} at ${result.width}px: overflow ${result.pageOverflow}px`);
    }
    process.exitCode = 1;
  }

  if (missingTextIssues.length > 0) {
    console.error('[audit] Responsive required text issues found:');
    for (const result of missingTextIssues) {
      console.error(
        ` - ${result.route} at ${result.width}px: missing ${result.missingText.join(', ')}`,
      );
    }
    process.exitCode = 1;
  }

  if (
    summary.statusMismatchCount === 0 &&
    summary.overflowIssueCount === 0 &&
    summary.missingTextIssueCount === 0
  ) {
    console.log(
      `[audit] Responsive check passed - ${summary.screenshotCount} screenshots across ${summary.routeCount} routes and ${summary.widthCount} widths, 0 status/text/overflow issues.`,
    );
  }
}

run().catch((error) => {
  console.error('[audit] Responsive check failed:', error);
  process.exitCode = 1;
});
