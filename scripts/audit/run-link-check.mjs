import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { LinkChecker } from 'linkinator';

const REPORT_PATH = resolve(process.cwd(), '.reports/linkinator/report.json');

async function run() {
  const checker = new LinkChecker({
    concurrency: 50,
    retryErrors: true,
    silent: true,
  });

  const result = await checker.check({
    path: 'http://127.0.0.1:4321',
    recurse: true,
    skip: [/https:\/\/fonts\.gstatic\.com\//i],
  });

  await writeFile(REPORT_PATH, JSON.stringify(result, null, 2), 'utf8');

  const brokenLinks = result.links.filter((link) => link.state === 'BROKEN');

  if (brokenLinks.length > 0) {
    console.error('[audit] Broken links found:');
    for (const link of brokenLinks) {
      console.error(` - ${link.url} (${link.status || 'no status'})`);
    }
    process.exitCode = 1;
  } else {
    console.log('[audit] Link check passed — no broken links detected.');
  }
}

run().catch((error) => {
  console.error('[audit] Link check failed:', error);
  process.exitCode = 1;
});
