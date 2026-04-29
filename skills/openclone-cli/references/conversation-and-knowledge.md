# Conversation and knowledge behavior

## Interactive commands

Inside `openclone chat <slug>` interactive mode:

```text
/help     show commands
/compact  summarize older conversation history now
/clear    clear raw history and summary
/bye      exit, also /exit or /quit
```

## Conversation persistence

The CLI persists every interactive session to disk by default:

```text
~/.openclone/conversations/<slug>/<sessionId>.json
```

Behavior:

- Each turn (and the final exit) is saved to a single JSON file per session.
- `sessionId` is a filename-safe ISO timestamp (e.g. `2026-04-28T15-38-41-598Z`).
- The same file is overwritten in place during a live session, so there is one JSON per session.
- On `/bye` the CLI prints `[session saved: <path>]`.
- Pass `--no-persist` to run an ephemeral session that is never written to disk.

## Resuming a saved session

```bash
openclone chat <slug> --resume                   # resume the newest session for that clone
openclone chat <slug> --resume=<SESSION_ID>      # resume a specific session by id
```

`SESSION_ID` is the first column of `openclone history <slug>`. When resumed:

- A `[resumed: N message(s)]` banner is printed.
- The prior conversation summary (if any) is replayed inside `--- prior summary ---` markers.
- Every restored message is replayed to stdout in chronological order — user messages with `>>>` prefix, assistant responses unprefixed — followed by `--- continuing conversation ---` before the live prompt loop.
- Scrolling up in the terminal shows the full prior dialogue, just like a normal chat client.

## Listing sessions

```bash
openclone history <slug>            # one clone's sessions, with column header and resume hints
openclone history --all             # every clone, grouped by clone, with [orphan: clone not found] tags
openclone history                   # bare command prints help (no implicit fallback)
openclone history <slug> --quiet    # data lines only, for piping into awk/grep
```

## Conversation memory

The CLI keeps user and assistant turns in memory for the current process and replays them on resume from the persisted JSON.

Long conversations are compacted automatically:

```bash
OPENCLONE_COMPACT_MAX_CHARS=24000
OPENCLONE_COMPACT_KEEP_TURNS=6
OPENCLONE_COMPACT_SUMMARY_MAX_CHARS=6000
```

Older turns are summarized. Recent turns stay verbatim. The compacted summary is part of the persisted session, so it survives across `--resume`.

## Knowledge lookup

The CLI uses the same markdown source of truth as the Claude Code skill:

```text
persona.md
knowledge/*.md
```

The prompt includes selected snippets and a manifest of available knowledge files. During a response, the model can ask the CLI to read a specific local knowledge file or fetch/search web content when needed.

## Explain it simply

- The persona file tells the model who to be.
- The knowledge files are the clone's memory.
- The CLI initially shows the model a short preview and a list of memories.
- If more detail is needed, the model can read the relevant memory file.
- If the conversation gets too long, old chat is summarized.
- Sessions are stored per-clone on disk, so the user can pick up where they left off with `--resume`.
