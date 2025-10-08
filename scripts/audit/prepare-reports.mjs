import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const REPORT_ROOT = resolve(process.cwd(), '.reports');
const DIRECTORIES = ['lighthouse', 'axe', 'linkinator'].map((dir) =>
  resolve(REPORT_ROOT, dir),
);

async function ensureDirectories() {
  await mkdir(REPORT_ROOT, { recursive: true });
  await Promise.all(DIRECTORIES.map((dir) => mkdir(dir, { recursive: true })));
}

ensureDirectories().catch((error) => {
  console.error('[audit] Failed to prepare report directories:', error);
  process.exitCode = 1;
});
