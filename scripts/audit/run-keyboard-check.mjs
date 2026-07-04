import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:4321';
const REPORT_DIR = resolve(process.cwd(), '.reports/keyboard');
const REPORT_PATH = resolve(REPORT_DIR, 'report.json');
const FOCUS_STEPS = 12;

const ROUTES = [
  { name: 'home', route: '/', expectedStatus: 200 },
  { name: 'records', route: '/records/', expectedStatus: 200 },
  { name: 'search', route: '/search/?q=kubernetes', expectedStatus: 200 },
];

async function waitForStableKeyboardSurface(page, routeName) {
  await page.evaluate(async () => {
    if (globalThis.document.fonts?.ready) {
      await globalThis.document.fonts.ready;
    }
  });

  if (routeName === 'search') {
    await page.waitForTimeout(900);
  }
}

function getFocusSnapshotScript() {
  return () => {
    const element = globalThis.document.activeElement;

    if (!element || element === globalThis.document.body) {
      return {
        tagName: 'body',
        selector: 'body',
        label: '',
        href: '',
        visible: false,
      };
    }

    const rect = element.getBoundingClientRect();
    const style = globalThis.getComputedStyle(element);
    const outlineWidth = Number.parseFloat(style.outlineWidth);
    const hasOutline =
      style.outlineStyle !== 'none' && !Number.isNaN(outlineWidth) && outlineWidth > 0;
    const hasBoxShadow = style.boxShadow !== 'none';
    const text = element.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    const label =
      element.getAttribute('aria-label') ?? element.getAttribute('title') ?? text.slice(0, 120);
    const id = element.id ? `#${element.id}` : '';
    const className =
      typeof element.className === 'string' && element.className.trim()
        ? `.${element.className.trim().split(/\s+/).join('.')}`
        : '';

    return {
      tagName: element.tagName.toLowerCase(),
      selector: `${element.tagName.toLowerCase()}${id}${className}`,
      label,
      href: element.getAttribute('href') ?? '',
      focusIndicatorVisible: hasOutline || hasBoxShadow,
      focusIndicator: {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineOffset: style.outlineOffset,
        boxShadow: style.boxShadow,
      },
      visible:
        rect.width > 0 &&
        rect.height > 0 &&
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        Number(style.opacity) !== 0,
    };
  };
}

async function collectFocusStops(page) {
  const stops = [];

  for (let index = 0; index < FOCUS_STEPS; index += 1) {
    await page.keyboard.press('Tab');
    stops.push({
      step: index + 1,
      ...(await page.evaluate(getFocusSnapshotScript())),
    });
  }

  return stops;
}

async function run() {
  await mkdir(REPORT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const results = [];

  try {
    for (const routeConfig of ROUTES) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
      const response = await page.goto(`${BASE_URL}${routeConfig.route}`, {
        waitUntil: 'networkidle',
      });
      const status = response?.status() ?? null;

      await waitForStableKeyboardSurface(page, routeConfig.name);
      const focusStops = await collectFocusStops(page);
      await page.close();

      const invisibleStops = focusStops.filter((stop) => !stop.visible);
      const missingFocusIndicatorStops = focusStops.filter(
        (stop) => stop.visible && !stop.focusIndicatorVisible,
      );

      results.push({
        name: routeConfig.name,
        route: routeConfig.route,
        status,
        expectedStatus: routeConfig.expectedStatus,
        statusMatches: status === routeConfig.expectedStatus,
        expectedVisibleFocusStops: FOCUS_STEPS,
        visibleFocusStopCount: focusStops.length - invisibleStops.length,
        invisibleFocusStopCount: invisibleStops.length,
        missingFocusIndicatorCount: missingFocusIndicatorStops.length,
        focusStops,
      });
    }
  } finally {
    await browser.close();
  }

  const statusMismatches = results.filter((result) => !result.statusMatches);
  const invisibleFocusResults = results.filter((result) => result.invisibleFocusStopCount > 0);
  const missingFocusIndicatorResults = results.filter(
    (result) => result.missingFocusIndicatorCount > 0,
  );
  const summary = {
    routeCount: results.length,
    expectedVisibleFocusStopsPerRoute: FOCUS_STEPS,
    visibleFocusStopTotal: results.reduce(
      (total, result) => total + result.visibleFocusStopCount,
      0,
    ),
    invisibleFocusStopCount: results.reduce(
      (total, result) => total + result.invisibleFocusStopCount,
      0,
    ),
    missingFocusIndicatorCount: results.reduce(
      (total, result) => total + result.missingFocusIndicatorCount,
      0,
    ),
    statusMismatchCount: statusMismatches.length,
    routes: results.map((result) => ({
      name: result.name,
      route: result.route,
      status: result.status,
      expectedStatus: result.expectedStatus,
      statusMatches: result.statusMatches,
      visibleFocusStopCount: result.visibleFocusStopCount,
      invisibleFocusStopCount: result.invisibleFocusStopCount,
      missingFocusIndicatorCount: result.missingFocusIndicatorCount,
    })),
  };

  await writeFile(REPORT_PATH, JSON.stringify({ summary, results }, null, 2), 'utf8');

  if (statusMismatches.length > 0) {
    console.error('[audit] Keyboard route status mismatches found:');
    for (const result of statusMismatches) {
      console.error(
        ` - ${result.route}: expected ${result.expectedStatus}, received ${result.status}`,
      );
    }
    process.exitCode = 1;
  }

  if (invisibleFocusResults.length > 0) {
    console.error('[audit] Invisible keyboard focus stops found:');
    for (const result of invisibleFocusResults) {
      console.error(` - ${result.route}: ${result.invisibleFocusStopCount} invisible stop(s)`);
    }
    process.exitCode = 1;
  }

  if (missingFocusIndicatorResults.length > 0) {
    console.error('[audit] Keyboard focus stops without visible indicator found:');
    for (const result of missingFocusIndicatorResults) {
      console.error(
        ` - ${result.route}: ${result.missingFocusIndicatorCount} stop(s) without outline or shadow`,
      );
    }
    process.exitCode = 1;
  }

  if (
    summary.statusMismatchCount === 0 &&
    summary.invisibleFocusStopCount === 0 &&
    summary.missingFocusIndicatorCount === 0
  ) {
    console.log(
      `[audit] Keyboard check passed - ${summary.routeCount} routes, ${summary.visibleFocusStopTotal} visible focus stops, 0 invisible stops, 0 missing focus indicators.`,
    );
  }
}

run().catch((error) => {
  console.error('[audit] Keyboard check failed:', error);
  process.exitCode = 1;
});
