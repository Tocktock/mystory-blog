import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('CI follows the default branch and a supported Astro toolchain', async () => {
  const [workflow, packageJson] = await Promise.all([
    readFile(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8'),
    readFile(new URL('../../package.json', import.meta.url), 'utf8').then(JSON.parse),
  ]);

  assert.match(workflow, /push:\s+branches:\s+- master/);
  assert.doesNotMatch(workflow, /branches:\s+- main/);
  assert.match(workflow, /node-version: 22/);
  assert.equal(packageJson.engines.node, '>=22.12.0');
});
