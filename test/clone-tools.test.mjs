import test from 'node:test';
import assert from 'node:assert/strict';
import { createCloneTools, buildKnowledgeManifest } from '../dist/lib/clone-tools.js';

function cloneFixture() {
  return {
    slug: 'alice',
    origin: 'built-in',
    personaPath: '/repo/clones/alice/persona.md',
    userKnowledgeDir: '/home/.openclone/clones/alice/knowledge',
    builtinKnowledgeDir: '/repo/clones/alice/knowledge',
    raw: '---\nname: alice\n---\n\nAlice',
    frontmatter: {},
    body: 'Alice',
    displayName: 'Alice',
    tagline: 'Tag',
    categories: ['vc'],
    primaryCategory: 'vc',
    knowledge: [
      { path: '/a/2026-01-01-old.md', origin: 'built-in', raw: '', frontmatter: { topic: 'old' }, body: 'old apples', topic: 'old', dateKey: '2026-01-01' },
      { path: '/a/2026-02-01-new.md', origin: 'user', raw: '', frontmatter: { topic: 'new', source_url: 'https://example.com/new' }, body: 'new bananas', topic: 'new', sourceUrl: 'https://example.com/new', dateKey: '2026-02-01' },
    ],
  };
}

test('knowledge manifest exposes all files, not just selected snippets', () => {
  const manifest = buildKnowledgeManifest(cloneFixture());
  assert.match(manifest, /k1: old/);
  assert.match(manifest, /k2: new/);
  assert.match(manifest, /https:\/\/example.com\/new/);
});

test('read_knowledge_file tool reads by manifest id and preserves citation target', async () => {
  const tools = createCloneTools(cloneFixture());
  const result = await tools.read_knowledge_file.execute({ id: 'k2' });
  assert.equal(result.topic, 'new');
  assert.equal(result.body, 'new bananas');
  assert.equal(result.citationTarget, 'https://example.com/new');
});

test('web_fetch tool returns readable text with URL citation target', async () => {
  const fetchImpl = async (url) => new Response('<html><title>x</title><body>Hello &amp; world<script>no</script></body></html>', {
    status: 200,
    headers: { 'content-type': 'text/html' },
  });
  const tools = createCloneTools(cloneFixture(), { fetchImpl });
  const result = await tools.web_fetch.execute({ url: 'https://example.com/page' });
  assert.equal(result.status, 200);
  assert.equal(result.citationTarget, 'https://example.com/page');
  assert.match(result.text, /Hello & world/);
  assert.doesNotMatch(result.text, /script/);
});

test('web_search tool parses DuckDuckGo html results', async () => {
  const html = '<div class="result"><div class="result__body"><a class="result__a" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fa">Example &amp; Result</a><a class="result__snippet">Snippet &amp; detail</a></div></div>';
  const fetchImpl = async () => new Response(html, {
    status: 200,
    headers: { 'content-type': 'text/html' },
  });
  const tools = createCloneTools(cloneFixture(), { fetchImpl });
  const result = await tools.web_search.execute({ query: 'example', maxResults: 1 });
  assert.equal(result.results.length, 1);
  assert.equal(result.results[0].title, 'Example & Result');
  assert.equal(result.results[0].url, 'https://example.com/a');
});
