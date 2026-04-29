import { test } from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown } from "../dist/ui/Markdown.js";

const ANSI_RE = /\u001b\[[0-9;]*m/gu;
const stripAnsi = (text) => text.replace(ANSI_RE, "");

test("renderMarkdown returns empty string for empty input", () => {
  assert.equal(renderMarkdown(""), "");
});

test("renderMarkdown renders plain text", () => {
  const out = renderMarkdown("hello world");
  assert.match(stripAnsi(out), /hello world/);
});

test("renderMarkdown renders headers", () => {
  const out = stripAnsi(renderMarkdown("# Title\n\nbody"));
  assert.match(out, /Title/);
  assert.match(out, /body/);
});

test("renderMarkdown renders unordered lists", () => {
  const out = stripAnsi(renderMarkdown("- alpha\n- beta\n- gamma"));
  assert.match(out, /alpha/);
  assert.match(out, /beta/);
  assert.match(out, /gamma/);
});

test("renderMarkdown preserves fenced code block content", () => {
  const out = stripAnsi(renderMarkdown("```js\nconst x = 1;\n```"));
  assert.match(out, /const x = 1;/);
});

test("renderMarkdown renders inline code content", () => {
  const out = stripAnsi(renderMarkdown("Use `npm install` first"));
  assert.match(out, /npm install/);
});

test("renderMarkdown renders link text", () => {
  const out = stripAnsi(renderMarkdown("Visit [openclone](https://github.com/open-clone/openclone)"));
  assert.match(out, /openclone/);
});

test("renderMarkdown is fault-tolerant on malformed input", () => {
  const out = renderMarkdown("```js\nunclosed code block");
  assert.ok(typeof out === "string");
  assert.match(stripAnsi(out), /unclosed/);
});
