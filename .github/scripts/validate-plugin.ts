// Validate .claude-plugin/plugin.json and marketplace.json required fields.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");

const PLUGIN_REQUIRED = ["name", "version", "description", "license", "author"] as const;
const MARKETPLACE_REQUIRED = ["$schema", "name", "owner", "plugins"] as const;
const PLUGIN_ENTRY_REQUIRED = ["name", "description", "source"] as const;

function fail(msg: string): never {
  console.error(`[FAIL] ${msg}`);
  process.exit(1);
}

function loadJson(path: string): Record<string, unknown> {
  if (!existsSync(path)) fail(`${relative(ROOT, path)} missing`);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    fail(`${relative(ROOT, path)} invalid JSON: ${(e as Error).message}`);
  }
}

function checkKeys(
  data: Record<string, unknown>,
  required: readonly string[],
  context: string,
): void {
  for (const key of required) {
    if (!(key in data)) fail(`${context} missing required key: '${key}'`);
  }
}

const plugin = loadJson(resolve(ROOT, ".claude-plugin/plugin.json"));
checkKeys(plugin, PLUGIN_REQUIRED, "plugin.json");

const author = plugin.author as Record<string, unknown> | undefined;
if (!author || typeof author !== "object" || !("name" in author)) {
  fail("plugin.json 'author' must be an object with a 'name' field");
}

const market = loadJson(resolve(ROOT, ".claude-plugin/marketplace.json"));
checkKeys(market, MARKETPLACE_REQUIRED, "marketplace.json");

const plugins = market.plugins;
if (!Array.isArray(plugins) || plugins.length === 0) {
  fail("marketplace.json 'plugins' must be a non-empty list");
}

plugins.forEach((entry: unknown, i: number) => {
  if (!entry || typeof entry !== "object") {
    fail(`marketplace.json plugins[${i}] must be an object`);
  }
  checkKeys(entry as Record<string, unknown>, PLUGIN_ENTRY_REQUIRED, `marketplace.json plugins[${i}]`);
});

const marketName = (plugins[0] as Record<string, unknown>).name;
if (plugin.name !== marketName) {
  fail(
    `plugin.json name ('${plugin.name}') does not match ` +
      `marketplace.json plugins[0].name ('${marketName}')`,
  );
}

console.log("[OK] plugin manifests valid");
