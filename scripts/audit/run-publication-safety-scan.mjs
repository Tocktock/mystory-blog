import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const REPORT_DIR = resolve(process.cwd(), '.reports/publication-safety');
const REPORT_PATH = resolve(REPORT_DIR, 'report.json');
const SCANNED_EXTENSIONS = new Set([
  '.astro',
  '.css',
  '.csv',
  '.js',
  '.json',
  '.md',
  '.mdx',
  '.mjs',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
]);
const EXCLUDED_PATH_PREFIXES = [
  '.astro/',
  '.git/',
  '.playwright-cli/',
  '.reports/',
  'dist/',
  'exports/',
  'node_modules/',
  'output/',
  'test-results/',
];
const EXCLUDED_FILES = new Set(['package-lock.json']);
const BLOCKED_PUBLICATION_PATH_PREFIXES = ['dist/', '.reports/', 'output/', 'exports/'];
const DOCUMENTED_PUBLIC_ENV_PATTERN = /\bPUBLIC_GISCUS_[A-Z0-9_]+\b/g;
const SECRET_PATTERNS = [
  {
    id: 'aws-access-key-id',
    pattern: /\b(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}\b/g,
  },
  {
    id: 'private-key-block',
    pattern: /-----BEGIN (?:RSA |DSA |EC |OPENSSH |)?PRIVATE KEY-----/g,
  },
  {
    id: 'github-token',
    pattern: /\bgh[pousr]_[A-Za-z0-9_]{36,255}\b/g,
  },
  {
    id: 'slack-token',
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
  },
  {
    id: 'jwt-token',
    pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  },
  {
    id: 'secret-assignment',
    pattern:
      /\b(?:api[_-]?key|access[_-]?key|auth[_-]?token|secret|token|password|private[_-]?key)\b\s*[:=]\s*['"]([^'"\n<>]{12,})['"]/gi,
  },
];

function isScannablePath(path) {
  if (EXCLUDED_FILES.has(path)) {
    return false;
  }

  if (EXCLUDED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return false;
  }

  return SCANNED_EXTENSIONS.has(extname(path));
}

function isBlockedPublicationPath(path) {
  return (
    path === '.env' ||
    path.startsWith('.env.') ||
    BLOCKED_PUBLICATION_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))
  );
}

function lineNumberForIndex(text, index) {
  let line = 1;

  for (let cursor = 0; cursor < index; cursor += 1) {
    if (text.charCodeAt(cursor) === 10) {
      line += 1;
    }
  }

  return line;
}

async function gitCandidateFiles() {
  const { stdout } = await execFileAsync('git', [
    'ls-files',
    '--cached',
    '--others',
    '--exclude-standard',
  ]);

  const candidates = stdout
    .split('\n')
    .map((path) => path.trim())
    .filter(Boolean)
    .sort();

  return {
    blockedPublicationPaths: candidates.filter(isBlockedPublicationPath),
    files: candidates.filter(isScannablePath),
  };
}

async function scanFile(path) {
  const text = await readFile(path, 'utf8');

  if (text.includes('\u0000')) {
    return { findings: [], documentedPublicEnvReferences: 0, skippedBinary: true };
  }

  const findings = [];

  for (const { id, pattern } of SECRET_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      findings.push({
        rule: id,
        file: path,
        line: lineNumberForIndex(text, match.index ?? 0),
      });
    }
  }

  return {
    findings,
    documentedPublicEnvReferences: [...text.matchAll(DOCUMENTED_PUBLIC_ENV_PATTERN)].length,
    skippedBinary: false,
  };
}

async function run() {
  await mkdir(REPORT_DIR, { recursive: true });
  const { files, blockedPublicationPaths } = await gitCandidateFiles();
  const findings = [];
  let documentedPublicEnvReferenceCount = 0;
  let skippedBinaryFileCount = 0;

  for (const file of files) {
    const result = await scanFile(file);
    findings.push(...result.findings);
    documentedPublicEnvReferenceCount += result.documentedPublicEnvReferences;

    if (result.skippedBinary) {
      skippedBinaryFileCount += 1;
    }
  }

  const summary = {
    scannedFileCount: files.length,
    skippedBinaryFileCount,
    documentedPublicEnvReferenceCount,
    blockedPublicationPathCount: blockedPublicationPaths.length,
    findingCount: findings.length,
    rules: SECRET_PATTERNS.map((rule) => rule.id),
  };

  await writeFile(
    REPORT_PATH,
    JSON.stringify({ summary, blockedPublicationPaths, findings }, null, 2),
    'utf8',
  );

  if (blockedPublicationPaths.length > 0) {
    console.error('[audit] Generated or private paths are staged/tracked for publication:');
    for (const path of blockedPublicationPaths) {
      console.error(` - ${path}`);
    }
    process.exitCode = 1;
  }

  if (findings.length > 0) {
    console.error('[audit] Disallowed secret-like tokens found:');
    for (const finding of findings) {
      console.error(` - ${finding.file}:${finding.line} (${finding.rule})`);
    }
    process.exitCode = 1;
  }

  if (process.exitCode) {
    return;
  }

  console.log(
    `[audit] Publication safety scan passed - ${summary.scannedFileCount} files scanned, 0 blocked publication paths, 0 disallowed secret-like tokens, ${summary.documentedPublicEnvReferenceCount} documented public env references.`,
  );
}

run().catch((error) => {
  console.error('[audit] Publication safety scan failed:', error);
  process.exitCode = 1;
});
