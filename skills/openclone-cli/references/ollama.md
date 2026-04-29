# Ollama and local models

## Plain-language model

Ollama is the local model runner. openclone is the chat client. The client sends persona instructions, knowledge options, conversation history, and the user's message to the local Ollama server.

## Required precondition

The Ollama server must already be running. openclone does not start it.

Check installation and models:

```bash
ollama --version
ollama list
```

Start the server manually if needed:

```bash
ollama serve
```

Pull a model if none is available:

```bash
ollama pull llama3.2
```

## Run openclone with Ollama

One-shot:

```bash
openclone chat douglas --provider ollama --model llama3.2 --prompt "짧게 조언해줘"
```

Interactive conversation:

```bash
openclone chat douglas --provider ollama --model llama3.2
```

Use any model name shown by `ollama list`:

```bash
openclone chat douglas --provider ollama --model "<model-from-ollama-list>"
```

## Avoid repeating flags

```bash
export OPENCLONE_PROVIDER=ollama
export OPENCLONE_MODEL=llama3.2
openclone chat douglas
```

## What to tell users

- If the server is not running, they will get a connection error.
- The default Ollama URL is `http://127.0.0.1:11434`.
- Local model quality varies by model size and tool-calling ability.
- If persona or knowledge use is weak, try a stronger local model or use Codex OAuth/OpenAI-compatible mode.
- For remote Ollama, set `OPENCLONE_BASE_URL` or pass `--base-url` with the Ollama server URL.
