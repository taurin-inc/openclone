# OpenAI-compatible API mode

Use this for normal API-key based usage, including OpenAI-compatible gateways.

## Default shape

```bash
export OPENCLONE_API_KEY="..."
export OPENCLONE_MODEL="gpt-5.5"
openclone chat douglas --prompt "질문"
```

With explicit flags:

```bash
openclone chat douglas \
  --base-url "https://api.openai.com/v1" \
  --api-key "$OPENCLONE_API_KEY" \
  --model "gpt-5.5" \
  --prompt "질문"
```

## Custom compatible endpoints

```bash
export OPENCLONE_PROVIDER=openai-compatible
export OPENCLONE_BASE_URL="https://your-compatible-endpoint/v1"
export OPENCLONE_API_KEY="..."
export OPENCLONE_MODEL="your-model-id"
openclone chat douglas
```

## Notes

- Use `OPENAI_API_KEY` only if the user already uses that convention; prefer `OPENCLONE_API_KEY` for openclone-specific setup.
- If no API key is configured and the user is not using Ollama or Codex OAuth, the CLI will report a missing credential.
- The model id must be one the selected endpoint supports.
