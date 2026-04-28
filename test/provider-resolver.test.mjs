import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveProvider } from '../dist/lib/provider-resolver.js';

function fakeJwt(exp) {
  const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  return `${header}.${payload}.sig`;
}

test('provider resolver does not read Codex auth unless OAuth is explicitly requested', async () => {
  const home = await mkdtemp(join(tmpdir(), 'openclone-provider-'));
  await mkdir(join(home, '.codex'), { recursive: true });
  await writeFile(join(home, '.codex', 'auth.json'), JSON.stringify({ OPENAI_API_KEY: 'codex-file-key' }));
  await assert.rejects(
    () => resolveProvider({ env: { HOME: home } }),
    /No API credential configured/,
  );
});

test('provider resolver accepts explicit env API key without Codex auth and defaults to gpt-5.5', async () => {
  const resolved = await resolveProvider({ env: { OPENCLONE_API_KEY: 'test-key' } });
  assert.equal(resolved.authSource, 'api-key');
  assert.equal(resolved.provider, 'openai-compatible');
  assert.equal(resolved.baseURL, 'https://api.openai.com/v1');
  assert.equal(resolved.modelId, 'gpt-5.5');
});

test('provider resolver uses Codex OAuth provider only when explicitly requested', async () => {
  const home = await mkdtemp(join(tmpdir(), 'openclone-provider-'));
  await mkdir(join(home, '.codex'), { recursive: true });
  await writeFile(join(home, '.codex', 'auth.json'), JSON.stringify({ auth_mode: 'chatgpt', tokens: { access_token: fakeJwt(4102444800), account_id: 'acct' } }));
  const resolved = await resolveProvider({ env: { HOME: home }, useCodexAuth: true });
  assert.equal(resolved.authSource, 'codex-oauth');
  assert.equal(resolved.provider, 'codex-oauth');
  assert.equal(resolved.baseURL, 'https://chatgpt.com/backend-api/codex');
  assert.equal(resolved.codexStore, true);
});

test('provider resolver supports Ollama without API key', async () => {
  const resolved = await resolveProvider({ provider: 'ollama', model: 'llama3.2', env: {} });
  assert.equal(resolved.provider, 'ollama');
  assert.equal(resolved.authSource, 'none');
  assert.equal(resolved.baseURL, 'http://127.0.0.1:11434');
});

test('provider resolver allows disabling Codex response item persistence for privacy-sensitive local runs', async () => {
  const home = await mkdtemp(join(tmpdir(), 'openclone-provider-'));
  await mkdir(join(home, '.codex'), { recursive: true });
  await writeFile(join(home, '.codex', 'auth.json'), JSON.stringify({ auth_mode: 'chatgpt', tokens: { access_token: fakeJwt(4102444800), account_id: 'acct' } }));
  const resolved = await resolveProvider({ env: { HOME: home, OPENCLONE_USE_CODEX_AUTH: '1', OPENCLONE_CODEX_STORE: '0' } });
  assert.equal(resolved.authSource, 'codex-oauth');
  assert.equal(resolved.codexStore, false);
});
