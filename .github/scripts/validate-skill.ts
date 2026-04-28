// Validate skill files:
//   1. Root SKILL.md keeps the Claude Code openclone dispatcher contract.
//   2. Nested skills under skills/*/SKILL.md have required frontmatter.
//   3. Reference files named in skill bodies exist, catching broken progressive-disclosure links.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const ROOT_SKILL_PATH = resolve(ROOT, "SKILL.md");

function fail(msgs: string[]): never {
  for (const m of msgs) console.error(`[FAIL] ${m}`);
  process.exit(1);
}

function splitFrontmatter(
  text: string,
  path: string,
): { fm: Record<string, string>; body: string } {
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

  const fm: Record<string, string> = {};
  for (let i = 1; i < end; i++) {
    const raw = lines[i];
    if (!raw.trim() || raw.trimStart().startsWith("#")) continue;
    const idx = raw.indexOf(":");
    if (idx < 0) continue;
    const key = raw.slice(0, idx).trim();
    const value = raw.slice(idx + 1).trim().replace(/^"|"$/g, "");
    fm[key] = value;
  }
  return { fm, body: lines.slice(end + 1).join("\n") };
}

function validateFrontmatter(path: string, requiredKeys: readonly string[]): { fm: Record<string, string>; body: string } {
  if (!existsSync(path)) fail([`${relative(ROOT, path)} missing`]);
  const parsed = splitFrontmatter(readFileSync(path, "utf8"), path);
  const problems: string[] = [];
  for (const key of requiredKeys) {
    if (!parsed.fm[key]) problems.push(`${relative(ROOT, path)}: missing or empty '${key}'`);
  }
  if (problems.length > 0) fail(problems);
  return parsed;
}

function validateRootSkill(): number {
  const { fm, body } = validateFrontmatter(ROOT_SKILL_PATH, ["name", "description", "allowed-tools"]);
  const problems: string[] = [];
  if (fm.name && fm.name !== "openclone") {
    problems.push(`SKILL.md: name must be 'openclone' (got '${fm.name}')`);
  }

  const refPattern = /\$\{CLAUDE_SKILL_DIR\}\/references\/([a-z0-9][a-z0-9-]*\.md)/g;
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = refPattern.exec(body)) !== null) {
    const file = m[1];
    if (seen.has(file)) continue;
    seen.add(file);
    const fp = resolve(ROOT, "references", file);
    if (!existsSync(fp)) {
      problems.push(`SKILL.md references non-existent file: references/${file}`);
    }
  }
  if (problems.length > 0) fail(problems);
  return seen.size;
}

function validateNestedSkills(): number {
  const skillsDir = resolve(ROOT, "skills");
  if (!existsSync(skillsDir)) return 0;
  let count = 0;
  const problems: string[] = [];
  for (const entry of readdirSync(skillsDir).sort()) {
    const skillDir = resolve(skillsDir, entry);
    if (!statSync(skillDir).isDirectory()) continue;
    const skillPath = resolve(skillDir, "SKILL.md");
    const { body } = validateFrontmatter(skillPath, ["name", "description"]);
    count++;

    const refPattern = /(?:\.\/)?references\/([A-Za-z0-9_.-]+\.md)/g;
    const seen = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = refPattern.exec(body)) !== null) {
      const file = m[1];
      if (seen.has(file)) continue;
      seen.add(file);
      const fp = resolve(skillDir, "references", file);
      if (!existsSync(fp)) {
        problems.push(`${relative(ROOT, skillPath)} references non-existent file: references/${file}`);
      }
    }

    const openaiYaml = resolve(skillDir, "agents", "openai.yaml");
    if (!existsSync(openaiYaml)) {
      problems.push(`${relative(ROOT, skillDir)} missing recommended agents/openai.yaml`);
    }
  }
  if (problems.length > 0) fail(problems);
  return count;
}

const rootRefs = validateRootSkill();
const nestedSkills = validateNestedSkills();
console.log(`[OK] SKILL.md frontmatter valid; ${rootRefs} root reference file(s) resolved; ${nestedSkills} nested skill(s) valid`);
