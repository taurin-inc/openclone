# Codex OAuth provider

Use this when the user wants to reuse a local Codex login instead of managing a normal API key.

## Key points

- The user must already be logged into Codex locally.
- The CLI only uses Codex OAuth when explicitly requested.
- This path is intended for personal local-machine use, not hosted services or token sharing.
- It uses the Codex backend transport, not the normal OpenAI API base URL.

## Commands

```bash
openclone chat douglas --use-codex-auth --model gpt-5.5 --prompt "짧게 조언해줘"
openclone chat douglas --use-codex-auth --model gpt-5.5
```

Equivalent environment switch:

```bash
export OPENCLONE_USE_CODEX_AUTH=1
export OPENCLONE_MODEL=gpt-5.5
openclone chat douglas
```

## Troubleshooting

- If auth fails, ask the user to confirm Codex works locally first.
- If a custom auth location is needed, use `OPENCLONE_CODEX_AUTH_FILE`.
- Do not ask users to paste or share Codex tokens.
