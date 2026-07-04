import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:4321';
const REPORT_DIR = resolve(process.cwd(), '.reports/axe');
const REPORT_PATH = resolve(REPORT_DIR, 'report.json');
const AXE_SOURCE_PATH = resolve(process.cwd(), 'node_modules/axe-core/axe.min.js');

const ROUTES = [
  { name: 'home', route: '/', expectedStatus: 200 },
  { name: 'records', route: '/records/', expectedStatus: 200 },
  { name: 'series', route: '/series/', expectedStatus: 200 },
  { name: 'series-detail', route: '/series/ai-working-notes/', expectedStatus: 200 },
  {
    name: 'record-detail-new',
    route: '/records/meta/ai-advisor-writing-partner/',
    expectedStatus: 200,
  },
  {
    name: 'record-detail-legacy',
    route: '/records/kubernetes-on-mac/k3s-with-multipass/',
    expectedStatus: 200,
  },
  { name: 'about', route: '/about/', expectedStatus: 200 },
  { name: 'career', route: '/career/', expectedStatus: 200 },
  { name: 'manyang', route: '/manyang-gureum/', expectedStatus: 200 },
  { name: 'search', route: '/search/?q=kubernetes', expectedStatus: 200 },
  { name: 'not-found', route: '/missing-record-drawer-for-i09/', expectedStatus: 404 },
];

async function run() {
  await mkdir(REPORT_DIR, { recursive: true });
  const axeSource = await readFile(AXE_SOURCE_PATH, 'utf8');
  const browser = await chromium.launch();
  const results = [];

  try {
    for (const { name, route, expectedStatus } of ROUTES) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
      const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
      const status = response?.status() ?? null;

      if (name === 'search') {
        await page.waitForTimeout(900);
      }

      await page.addScriptTag({ content: axeSource });
      const result = await page.evaluate(async () => {
        return await globalThis.axe.run(globalThis.document, { resultTypes: ['violations'] });
      });

      results.push({
        name,
        route,
        status,
        expectedStatus,
        statusMatches: status === expectedStatus,
        violations: result.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          description: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl,
          nodes: violation.nodes.slice(0, 10).map((node) => ({
            target: node.target,
            failureSummary: node.failureSummary,
          })),
        })),
      });

      await page.close();
    }
  } finally {
    await browser.close();
  }

  const summary = {
    routeCount: results.length,
    violationCount: results.reduce((count, result) => count + result.violations.length, 0),
    statusMismatchCount: results.filter((result) => !result.statusMatches).length,
    routes: results.map((result) => ({
      name: result.name,
      route: result.route,
      status: result.status,
      expectedStatus: result.expectedStatus,
      statusMatches: result.statusMatches,
      violationCount: result.violations.length,
    })),
  };

  await writeFile(REPORT_PATH, JSON.stringify({ summary, results }, null, 2), 'utf8');

  if (summary.statusMismatchCount > 0) {
    console.error('[audit] Unexpected route status found:');
    for (const result of results.filter((item) => !item.statusMatches)) {
      console.error(
        ` - ${result.route}: expected ${result.expectedStatus}, received ${result.status}`,
      );
    }
    process.exitCode = 1;
  }

  if (summary.violationCount > 0) {
    console.error('[audit] Axe violations found:');
    for (const result of results.filter((item) => item.violations.length > 0)) {
      console.error(` - ${result.route}: ${result.violations.length} violation(s)`);
    }
    process.exitCode = 1;
  }

  if (summary.violationCount === 0 && summary.statusMismatchCount === 0) {
    console.log(
      `[audit] Axe check passed - ${summary.routeCount} routes checked, expected statuses matched, 0 violations detected.`,
    );
  }
}

run().catch((error) => {
  console.error('[audit] Axe check failed:', error);
  process.exitCode = 1;
});
