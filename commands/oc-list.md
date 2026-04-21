---
description: List all openclone clones grouped by category, marking the active one
allowed-tools: Bash, Read
---

List every openclone clone the user has defined, grouped by category, with the active clone marked.

Steps:

1. If `~/.openclone/clones/` does not exist or is empty, tell the user they have no clones yet and suggest `/oc-new <name>`. Stop.

2. Read the active clone reference from `~/.openclone/active-clone` (may not exist).

3. For each category directory under `~/.openclone/clones/`, list each `.md` file. For each clone, read the frontmatter to extract `display_name` and `tagline`.

4. Render a compact table grouped by category:

   ```
   ## vc
   - hayun       Hayun Kim — Seed-stage investor, AI infra       [active]
   - jane        Jane Park — Series A, consumer

   ## dev
   - mk          Min-Kyu — Backend, distributed systems
   ```

   - Mark the active clone with `[active]` at end of line.
   - Keep it to one line per clone.
   - If no tagline, show just the display_name.

5. At the end, print a one-line hint:
   > Run `/oc-use <name>` to activate one, or `/oc-new <name>` to create a new clone.
