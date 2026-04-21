---
name: openclone
description: Use when the user wants to create, manage, or talk to an openclone "clone" — a named AI persona with a category (vc, dev, founder, pm, designer, writer) and attached knowledge. Triggers on phrases like "create a clone", "make a persona", "talk as <name>", "switch to <name>", "feed knowledge to", "ingest url for <clone>", "ask all VCs", "stop being <name>". Also triggers when the user refers to `/oc-*` commands or wants to understand the openclone system.
---

# openclone

Openclone lets a user create categorized AI persona "clones", then either (a) activate one so that every subsequent message is answered in that persona, or (b) broadcast a question to an entire category for side-by-side perspectives. Everything lives on the user's filesystem under `~/.openclone/`.

## When to use this skill

- User asks to create, list, activate, deactivate, or delete a clone.
- User asks to feed knowledge (URL, YouTube, file, text) to a clone.
- User runs any `/oc-*` slash command or references one by name.
- User asks "what is openclone" or how the persona system works.
- User wants a multi-perspective panel answer from a category (e.g. "ask all the VCs").

## Do not use this skill when

- The user is having a normal conversation with an already-active clone. The `UserPromptSubmit` hook handles persona injection automatically — do not re-invoke this skill for every turn.
- The user is doing unrelated coding or research work.

## Primary entry points

Direct slash commands are the main interface:

| Command | Purpose |
|---|---|
| `/oc-new <name>` | Create a clone via interactive interview (category required). See `references/interview-workflow.md`. |
| `/oc-use <name>` | Activate a clone — subsequent messages answered as this clone. |
| `/oc-stop` | Deactivate the active clone. |
| `/oc-list` | List clones grouped by category, marking active. |
| `/oc-ingest <source>` | Add knowledge to the active clone. See `references/refine-workflow.md`. |
| `/oc-<category> "<q>"` | Panel: every clone in `<category>` answers `<q>`. See `references/panel-workflow.md`. |

If the user asks for one of these in natural language, offer to run the corresponding command but prefer explicit command invocation so the user sees what's happening.

## Data layout

All user state is under `~/.openclone/`:

```
~/.openclone/
├── active-clone                         # current active clone ref "<category>/<name>" (absent = none)
├── clones/<category>/<name>.md          # persona file — see references/clone-schema.md
└── knowledge/<category>/<name>/
    ├── sources/                         # raw ingested material
    └── refined/                         # topic-organized summaries
```

Categories are a fixed v1 list: `vc`, `dev`, `founder`, `pm`, `designer`, `writer`. See `references/categories.md` for the lens each one enforces.

## How "active clone conversation" works

A `UserPromptSubmit` hook (`hooks/inject-active-clone.sh`) reads `~/.openclone/active-clone` on every user message. If set, it injects the clone's markdown as additional system context, instructing Claude to respond as that clone. This is transparent to the user — they just chat.

The hook is no-op when:
- The active-clone file does not exist
- It is empty
- It points to a non-existent clone

## Files in this skill

- `references/clone-schema.md` — clone file format (frontmatter + sections)
- `references/categories.md` — fixed category list and per-category "always checks" axes
- `references/interview-workflow.md` — how `/oc-new` conducts and consolidates the interview
- `references/refine-workflow.md` — how `/oc-ingest` turns raw sources into refined topic files
- `references/panel-workflow.md` — how `/oc-<category>` produces multi-clone panel output
- `assets/clone-template.md` — starter template for hand-authored clones (bypassing `/oc-new`)

## Editing clones manually

A clone is a plain markdown file. Power users can:

- Copy `assets/clone-template.md` to `~/.openclone/clones/<category>/<name>.md` and fill it in.
- Edit any existing clone directly in their editor.
- Version-control `~/.openclone/clones/` in their own dotfiles repo.

The hook only requires that the clone file exists and parses.
