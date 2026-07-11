import type { APIRoute } from 'astro';
import { execFileSync } from 'node:child_process';

export const prerender = true;

const FULL_SHA_PATTERN = /^[0-9a-f]{40}$/i;
const ALLOWED_ENVIRONMENTS = new Set(['production', 'preview', 'development']);

function resolveCommitSha(): string {
  const environmentSha = process.env.VERCEL_GIT_COMMIT_SHA?.trim();

  if (environmentSha && FULL_SHA_PATTERN.test(environmentSha)) {
    return environmentSha.toLowerCase();
  }

  try {
    const repositorySha = execFileSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    if (FULL_SHA_PATTERN.test(repositorySha)) {
      return repositorySha.toLowerCase();
    }
  } catch {
    // A deployment without Git metadata remains identifiable as unknown and
    // cannot pass an expected-SHA production smoke check.
  }

  return 'unknown';
}

function resolveEnvironment(): string {
  const environment = process.env.VERCEL_ENV?.trim().toLowerCase();
  return environment && ALLOWED_ENVIRONMENTS.has(environment) ? environment : 'local';
}

const buildInfo = Object.freeze({
  commitSha: resolveCommitSha(),
  environment: resolveEnvironment(),
  buildTime: new Date().toISOString(),
});

export const GET: APIRoute = () =>
  new Response(JSON.stringify(buildInfo), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
