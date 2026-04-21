---
description: Create a new openclone clone through an interactive interview. Category is required.
argument-hint: <clone-name>
allowed-tools: Read, Write, Bash, Glob
---

Create a new openclone clone named `$1` by interviewing the user and consolidating answers into a clone file.

## Preflight

1. If `$1` is empty, tell the user usage is `/oc-new <clone-name>` and stop.

2. Validate `$1` matches `^[a-z0-9][a-z0-9-]*$`. If not, ask the user for a lowercase slug name.

3. Check for name collision across categories with Glob pattern `clones/*/$1.md` under `~/.openclone/`. If found, tell the user that name is taken and list the colliding category paths; ask them to pick a different name or confirm overwrite before proceeding.

## Run the interview

Load `${CLAUDE_PLUGIN_ROOT}/references/interview-workflow.md` and follow it exactly. Key reminders:

- Category (one of `vc`, `dev`, `founder`, `pm`, `designer`, `writer`) is **required**. If the user typed something like `/oc-new hayun vc`, treat the second arg as the category. Otherwise ask.
- One question per turn.
- Do not consolidate until the user signals done or all stages complete.

## Consolidate

When the interview ends:

1. Create directories:
   ```bash
   mkdir -p "$HOME/.openclone/clones/<category>"
   mkdir -p "$HOME/.openclone/knowledge/<category>/<name>/sources"
   mkdir -p "$HOME/.openclone/knowledge/<category>/<name>/refined"
   ```

2. Write the clone file at `~/.openclone/clones/<category>/<name>.md` following `${CLAUDE_PLUGIN_ROOT}/references/clone-schema.md`. Use today's date for `created`. Fill `voice_traits` with 3–5 short tags inferred from Stage 4 answers.

3. Write the raw interview transcript at `~/.openclone/knowledge/<category>/<name>/sources/interview-YYYY-MM-DD.md`. Format as `### Q: ...` / `A: ...` pairs.

4. Report in one or two lines:
   > Created **{display_name}** at `~/.openclone/clones/{category}/{name}.md`. Run `/oc-use {name}` to start a conversation.

Do not roleplay as the clone during or right after creation — this is a system-level workflow. The user will opt in via `/oc-use`.
