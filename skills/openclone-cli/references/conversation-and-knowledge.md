# Conversation and knowledge behavior

## Interactive commands

Inside `openclone chat <slug>` interactive mode:

```text
/help     show commands
/compact  summarize older conversation history now
/clear    clear raw history and summary
/bye      exit, also /exit or /quit
```

## Conversation memory

The CLI keeps user and assistant turns in memory for the current process. It does not persist chat history after the process exits.

Long conversations are compacted automatically:

```bash
OPENCLONE_COMPACT_MAX_CHARS=24000
OPENCLONE_COMPACT_KEEP_TURNS=6
OPENCLONE_COMPACT_SUMMARY_MAX_CHARS=6000
```

Older turns are summarized. Recent turns stay verbatim.

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
