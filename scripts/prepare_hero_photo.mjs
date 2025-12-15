import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const HERO_DIR = path.resolve('src/assets/heroes');

function usage({ error } = {}) {
  const output = error ? process.stderr : process.stdout;
  output.write(
    [
      'Usage:',
      '  node scripts/prepare_hero_photo.mjs --input <path> (--output <path> | --slug <name>) [options]',
      '',
      'Options:',
      '  --input <path>       Source image (jpg/png/etc).',
      '  --output <path>      Output file path (overwrites only with --overwrite).',
      '  --slug <name>        Output base name under src/assets/heroes (requires --format or infers from --ext).',
      '  --width <px>         Target width (default: 1280).',
      '  --height <px>        Target height (default: width * 9/16).',
      '  --quality <1-100>    Encoder quality (default: 82).',
      '  --format <jpeg|png|webp|avif>',
      '                       Output format (default: inferred from output extension, else jpeg).',
      '  --position <value>   Crop focus for fit=cover (default: center).',
      '                       Examples: center, entropy, attention, top, bottom, left, right.',
      '  --overwrite          Allow overwriting an existing output file.',
      '  --dry-run            Print the plan without writing a file.',
      '  -h, --help           Show help.',
      '',
      'Examples:',
      '  npm run hero:photo -- --input ~/Downloads/photo.jpg --slug marathon-1 --width 1280',
      '  npm run hero:photo -- --input src/assets/heroes/marathon-1.jpeg --output src/assets/heroes/marathon-1.jpeg --width 1280 --overwrite',
      '',
    ].join('\n'),
  );

  process.exit(error ? 1 : 0);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('-')) continue;

    if (token === '-h' || token === '--help') {
      args.help = true;
      continue;
    }

    if (token === '--overwrite' || token === '--dry-run') {
      args[token.slice(2)] = true;
      continue;
    }

    const next = argv[index + 1];
    if (!next || next.startsWith('-')) {
      args[token.slice(2)] = true;
      continue;
    }

    args[token.slice(2)] = next;
    index += 1;
  }
  return args;
}

function formatBytes(bytes) {
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)}KB`;
  return `${(kb / 1024).toFixed(2)}MB`;
}

function normalizeFormat(value) {
  if (!value) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'jpg') return 'jpeg';
  return normalized;
}

function inferFormatFromPath(filePath) {
  const extension = path.extname(filePath).slice(1).toLowerCase();
  if (!extension) return undefined;
  if (extension === 'jpg' || extension === 'jpeg') return 'jpeg';
  if (extension === 'png') return 'png';
  if (extension === 'webp') return 'webp';
  if (extension === 'avif') return 'avif';
  return undefined;
}

function inferOutputPath({ slug, format, ext }) {
  const extension = ext
    ? ext.replace(/^\./, '')
    : format === 'jpeg'
      ? 'jpeg'
      : format;
  return path.join(HERO_DIR, `${slug}.${extension}`);
}

const args = parseArgs(process.argv.slice(2));
if (args.help) usage();

const input = args.input ? path.resolve(args.input) : undefined;
if (!input) usage({ error: 'Missing --input.' });

const hasOutput = typeof args.output === 'string' && args.output.length > 0;
const hasSlug = typeof args.slug === 'string' && args.slug.length > 0;
if (!hasOutput && !hasSlug) {
  usage({ error: 'Provide either --output or --slug.' });
}

if (hasSlug && (args.slug.includes('/') || args.slug.includes('\\'))) {
  usage({ error: 'Slug must not include path separators.' });
}

let outputPath = hasOutput ? path.resolve(args.output) : undefined;
let format = normalizeFormat(args.format);
const extOverride = typeof args.ext === 'string' ? args.ext : undefined;

if (!outputPath) {
  format ??= normalizeFormat(args.format) ?? 'jpeg';
  outputPath = inferOutputPath({ slug: args.slug, format, ext: extOverride });
}

format ??= inferFormatFromPath(outputPath) ?? 'jpeg';

const width = args.width ? Number.parseInt(args.width, 10) : 1280;
if (!Number.isFinite(width) || width <= 0) usage({ error: 'Invalid --width.' });

const height = args.height ? Number.parseInt(args.height, 10) : Math.round((width * 9) / 16);
if (!Number.isFinite(height) || height <= 0) usage({ error: 'Invalid --height.' });

const quality = args.quality ? Number.parseInt(args.quality, 10) : 82;
if (!Number.isFinite(quality) || quality < 1 || quality > 100) usage({ error: 'Invalid --quality.' });

const position = typeof args.position === 'string' ? args.position : 'center';
const overwrite = Boolean(args.overwrite);
const dryRun = Boolean(args['dry-run']);

try {
  await fs.access(input);
} catch (error) {
  usage({ error: `Input not found: ${input}` });
}

try {
  await fs.access(outputPath);
  if (!overwrite) {
    usage({
      error: `Output already exists: ${outputPath}\nRe-run with --overwrite to replace it.`,
    });
  }
} catch {
  // Output doesn't exist (good).
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });

const inputStat = await fs.stat(input);
const planLine = `input=${input} (${formatBytes(inputStat.size)}) -> output=${outputPath} (${width}x${height}, ${format}, q=${quality}, position=${position})`;
const sameFile = path.resolve(input) === path.resolve(outputPath);
const writePath = sameFile ? `${outputPath}.tmp-${Date.now()}` : outputPath;

if (dryRun) {
  process.stdout.write(`[dry-run] ${planLine}\n`);
  process.exit(0);
}

let pipeline = sharp(input)
  .rotate()
  .resize(width, height, { fit: 'cover', position, withoutEnlargement: true });

switch (format) {
  case 'jpeg':
    pipeline = pipeline.jpeg({ quality, mozjpeg: true, progressive: true });
    break;
  case 'png':
    pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
    break;
  case 'webp':
    pipeline = pipeline.webp({ quality });
    break;
  case 'avif':
    pipeline = pipeline.avif({ quality });
    break;
  default:
    usage({ error: `Unsupported --format: ${format}` });
}

await pipeline.toFile(writePath);

if (sameFile) {
  try {
    await fs.rename(writePath, outputPath);
  } catch (error) {
    if (!overwrite) throw error;
    await fs.unlink(outputPath);
    await fs.rename(writePath, outputPath);
  }
}

const outputStat = await fs.stat(outputPath);
const outputMeta = await sharp(outputPath).metadata();
process.stdout.write(
  [
    'Hero image prepared.',
    `- ${planLine}`,
    `- wrote: ${outputPath}`,
    `- size: ${formatBytes(outputStat.size)} (was ${formatBytes(inputStat.size)})`,
    outputMeta.width && outputMeta.height ? `- dims: ${outputMeta.width}x${outputMeta.height}` : '',
  ]
    .filter(Boolean)
    .join('\n') + '\n',
);
