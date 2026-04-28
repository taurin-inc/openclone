---
name: openclone-cli
description: Help users install, configure, troubleshoot, and run the openclone Node.js CLI for persona chat across OpenAI-compatible APIs, Codex OAuth, and Ollama/local models. Use when users ask how to run openclone outside Claude Code, choose a provider/model, use local Ollama, understand conversation mode, knowledge lookup, or npm package usage.
---

# openclone CLI helper

Use this skill when the user wants help running openclone from a terminal rather than using the Claude Code `/openclone` skill.

## Core workflow

1. Identify the user's target runtime:
   - Local model/Ollama → read `references/ollama.md`.
   - Codex OAuth → read `references/codex-oauth.md`.
   - API key or custom OpenAI-compatible endpoint → read `references/openai-compatible.md`.
   - General install/first run → read `references/quickstart.md`.
2. Explain that the CLI uses the same markdown persona and `knowledge/` files as source of truth.
3. For interactive chat behavior, memory, knowledge lookup, and compaction, read `references/conversation-and-knowledge.md`.
4. If the user reports errors, read `references/troubleshooting.md`.

Keep answers short and concrete. Prefer copy-pasteable commands. Do not claim the CLI starts external services unless the reference says so.

## Safety and expectation checks

- Ollama/local models run through an already-running Ollama server; openclone does not start it.
- Codex OAuth is opt-in and local-machine oriented; do not suggest hosted token sharing.
- Model quality varies. Local models may follow persona/tool instructions less reliably than stronger hosted models.
- The Claude Code skill and the CLI are separate entry points that share markdown clone data.
