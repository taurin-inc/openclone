// Validate commands/*.md frontmatter.
// Required keys on every command: description, allowed-tools.
// argument-hint is optional (only commands that take arguments need it).
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const COMMANDS_DIR = resolve(ROOT, "commands");

const REQUIRED_KEYS = ["description", "allowed-tools"] as const;

function fail(msgs: string[]): never {
  for (const m of msgs) console.error(`[FAIL] ${m}`);
  process.exit(1);
}

function parseFrontmatter(text: string, path: string): Record<string, string> {
  const lines = text.split("\n");
  const rel = relative(ROOT, path);
  if (lines.length === 0 || lines[0].trim() !== "---") {
    fail([`${rel} missing opening frontmatter '---'`]);
  }
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      end = i;
      break;
    }
  }
  if (end === -1) fail([`${rel} missing closing frontmatter '---'`]);

  const out: Record<string, string> = {};
  for (let i = 1; i < end; i++) {
    const raw = lines[i];
    if (!raw.trim() || raw.trimStart().startsWith("#")) continue;
    const idx = raw.indexOf(":");
    if (idx < 0) continue;
    const key = raw.slice(0, idx).trim();
    const value = raw.slice(idx + 1).trim();
    out[key] = value;
  }
  return out;
}

if (!existsSync(COMMANDS_DIR) || !statSync(COMMANDS_DIR).isDirectory()) {
  fail(["commands/ directory missing"]);
}

const files = readdirSync(COMMANDS_DIR)
  .filter((f) => f.endsWith(".md"))
  .sort()
  .map((f) => join(COMMANDS_DIR, f));

if (files.length === 0) fail(["commands/ is empty"]);

const problems: string[] = [];
for (const path of files) {
  const fm = parseFrontmatter(readFileSync(path, "utf8"), path);
  for (const key of REQUIRED_KEYS) {
    if (!fm[key]) problems.push(`${relative(ROOT, path)}: missing or empty '${key}'`);
  }
}

if (problems.length > 0) fail(problems);

console.log(`[OK] ${files.length} command file(s) valid`);
