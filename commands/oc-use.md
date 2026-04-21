---
description: Activate an openclone clone — every following message will be answered as this clone until /oc-stop
argument-hint: <clone-name>
allowed-tools: Bash, Glob, Read, Write
---

Activate the openclone clone named `$1` so that subsequent user messages in this session are answered in that clone's voice.

Steps:

1. If `$1` is empty, tell the user the usage is `/oc-use <clone-name>` and list available clones by running:
   ```bash
   ls -1 ~/.openclone/clones/ 2>/dev/null | while read cat; do
     ls -1 ~/.openclone/clones/"$cat"/*.md 2>/dev/null | sed "s|.*/||;s|\.md$||;s|^|  $cat/|"
   done
   ```
   Stop after showing the list.

2. Find the clone file. Try `~/.openclone/clones/*/$1.md` first. Use Glob with pattern `clones/*/$1.md` rooted at `~/.openclone`.
   - If zero matches: tell the user `$1` was not found and suggest `/oc-list`. Stop.
   - If one match: proceed.
   - If multiple matches (same name in different categories): list them as `<category>/<name>` and ask the user to run `/oc-use <category>/<name>` explicitly. Handle the case where `$1` already contains a `/` — then use it as `<category>/<name>` directly and verify the file exists.

3. Ensure `~/.openclone/` exists, then write the resolved `<category>/<name>` reference (no leading/trailing whitespace, no newline issues) to `~/.openclone/active-clone`:
   ```bash
   mkdir -p ~/.openclone
   printf '%s' "<category>/<name>" > ~/.openclone/active-clone
   ```

4. Read the clone file briefly to confirm the frontmatter (`display_name`, `category`, `tagline`) and report in one or two lines:
   > Active clone set to **{display_name}** ({category}). Your next message will be answered as this clone. Run `/oc-stop` to deactivate.

Do not roleplay as the clone in this command response — this is a system-level confirmation. The hook will take over from the next user message.
