import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { expect, test } from '@playwright/test';

const execFileAsync = promisify(execFile);
const FULL_SHA_PATTERN = /^[0-9a-f]{40}$/;

test('build info publishes only the safe deployment identity fields', async ({ request }) => {
  const response = await request.get('/build-info.json');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application/json');

  const buildInfo = await response.json();
  expect(Object.keys(buildInfo).sort()).toEqual(['buildTime', 'commitSha', 'environment']);
  expect(buildInfo.commitSha).toMatch(FULL_SHA_PATTERN);
  expect(buildInfo.environment).toMatch(/^(local|development|preview|production)$/);
  expect(Number.isNaN(Date.parse(buildInfo.buildTime))).toBe(false);
  expect(JSON.stringify(buildInfo)).not.toMatch(/token|secret|password|private|\/Users\//i);
});

test('production smoke rejects a deployment SHA mismatch', async () => {
  const expectedSha = '0000000000000000000000000000000000000000';

  await expect(
    execFileAsync(process.execPath, ['scripts/audit/run-production-smoke-check.mjs'], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PERSONA_PRODUCTION_BASE_URL: 'http://127.0.0.1:4321',
        EXPECTED_DEPLOY_SHA: expectedSha,
      },
    }),
  ).rejects.toMatchObject({
    code: 1,
    stderr: expect.stringContaining('deployment SHA mismatch'),
  });
});
