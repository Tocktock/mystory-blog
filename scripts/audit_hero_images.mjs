import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const HERO_DIR = path.resolve('src/assets/heroes');
const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('-')) continue;

    if (token === '-h' || token === '--help') {
      args.help = true;
      continue;
    }

    if (token === '--warn-only') {
      args.warnOnly = true;
      continue;
    }

    const next = argv[index + 1];
    if (!next || next.startsWith('-')) {
      args[token.replace(/^--/, '')] = true;
      continue;
    }

    args[token.replace(/^--/, '')] = next;
    index += 1;
  }
  return args;
}

function usage({ error } = {}) {
  const output = error ? process.stderr : process.stdout;
  output.write(
    [
      'Usage:',
      '  node scripts/audit_hero_images.mjs [--max-bytes <n>] [--tolerance <n>] [--warn-only]',
      '',
      'Defaults:',
      '  --max-bytes 500000     (≈ 488KB)',
      '  --tolerance 0.03       (aspect-ratio tolerance for 16:9)',
      '',
      'Examples:',
      '  npm run hero:audit',
      '  npm run hero:audit -- --warn-only',
      '',
    ].join('\n'),
  );
  process.exit(error ? 1 : 0);
}

function formatBytes(bytes) {
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)}KB`;
  return `${(kb / 1024).toFixed(2)}MB`;
}

function formatRatio(value) {
  return Number.isFinite(value) ? value.toFixed(3) : 'n/a';
}

const args = parseArgs(process.argv.slice(2));
if (args.help) usage();

const maxBytes = args['max-bytes'] ? Number.parseInt(args['max-bytes'], 10) : 500_000;
if (!Number.isFinite(maxBytes) || maxBytes <= 0) usage({ error: 'Invalid --max-bytes.' });

const tolerance = args.tolerance ? Number.parseFloat(args.tolerance) : 0.03;
if (!Number.isFinite(tolerance) || tolerance < 0) usage({ error: 'Invalid --tolerance.' });

const warnOnly = Boolean(args.warnOnly);
const targetRatio = 16 / 9;

const entries = await fs.readdir(HERO_DIR, { withFileTypes: true });
const heroFiles = entries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => SUPPORTED_EXTENSIONS.has(path.extname(name).toLowerCase()))
  .sort((a, b) => a.localeCompare(b));

if (heroFiles.length === 0) {
  process.stdout.write(`No hero images found under ${HERO_DIR}\n`);
  process.exit(0);
}

let failures = 0;
process.stdout.write(`Auditing ${heroFiles.length} hero image(s) under ${HERO_DIR}\n\n`);

for (const fileName of heroFiles) {
  const filePath = path.join(HERO_DIR, fileName);
  const stat = await fs.stat(filePath);
  const meta = await sharp(filePath).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const ratio = width && height ? width / height : NaN;

  const issues = [];
  if (stat.size > maxBytes) {
    issues.push(`size ${formatBytes(stat.size)} > ${formatBytes(maxBytes)}`);
  }
  if (Number.isFinite(ratio) && Math.abs(ratio - targetRatio) > tolerance) {
    issues.push(`ratio ${formatRatio(ratio)} (expected ~${formatRatio(targetRatio)})`);
  }

  const status = issues.length === 0 ? 'OK' : 'ISSUE';
  process.stdout.write(
    `${status}\t${fileName}\t${width}x${height}\t${formatBytes(stat.size)}\t${issues.join(', ')}\n`,
  );

  if (issues.length > 0) {
    failures += 1;
    process.stdout.write(
      `\tFix: npm run hero:photo -- --input ${path.relative(process.cwd(), filePath)} --output ${path.relative(process.cwd(), filePath)} --width 1280 --overwrite\n`,
    );
  }
}

if (failures > 0) {
  process.stdout.write(`\n${failures} hero image(s) need attention.\n`);
  if (!warnOnly) process.exit(1);
} else {
  process.stdout.write('\nAll hero images look good.\n');
}
