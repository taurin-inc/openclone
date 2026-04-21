#!/usr/bin/env bash
# UserPromptSubmit hook for openclone.
#
# Reads ~/.openclone/active-clone (format: "<category>/<name>") and injects the
# matching clone's persona as additional context so Claude responds as that
# clone for the upcoming user message.
#
# Output: JSON on stdout (additionalContext), always exit 0.
# If no active clone is set, emits empty JSON object — no effect on conversation.
# Errors (missing file, bad reference) also emit empty JSON to avoid derailing.

set -u

emit_empty() {
  printf '{}\n'
  exit 0
}

active_file="$HOME/.openclone/active-clone"
[ -f "$active_file" ] || emit_empty

clone_ref=$(tr -d '[:space:]' < "$active_file" 2>/dev/null || true)
[ -n "$clone_ref" ] || emit_empty

clone_md="$HOME/.openclone/clones/${clone_ref}.md"
[ -f "$clone_md" ] || emit_empty

knowledge_dir="$HOME/.openclone/knowledge/${clone_ref}"

# Build the additionalContext payload.
context=$(cat <<EOF
<openclone-active-clone>
You are currently embodying an openclone clone. For the upcoming user message, respond AS this clone — match the persona, speaking style, and guidelines below. Stay in character for conversational messages. If the user message is a clear system task (file edit, code change, build, shell command), perform it correctly using your normal tools but phrase any narration in the clone's tone.

If the user asks something that requires factual recall about this clone's world, check knowledge files under: ${knowledge_dir}
Use the Read tool on specific files there when relevant. Do not list the directory to the user — just use it.

--- clone definition ---
$(cat "$clone_md")
--- end clone definition ---
</openclone-active-clone>
EOF
)

# JSON-escape the context. Prefer python3 (universally available on macOS / modern Linux)
# then fall back to a simple sed pipeline.
if command -v python3 >/dev/null 2>&1; then
  escaped=$(printf '%s' "$context" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')
else
  # Minimal escape: backslash, double-quote, newline, carriage return, tab.
  escaped=$(printf '%s' "$context" \
    | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' \
    | awk 'BEGIN{ORS=""} {gsub(/\t/,"\\t"); gsub(/\r/,"\\r"); print; print "\\n"}')
  escaped="\"${escaped%\\n}\""
fi

cat <<EOF
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":${escaped}}}
EOF
