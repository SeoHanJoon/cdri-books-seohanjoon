#!/usr/bin/env bash
# 코드 파일을 고친 직후, Stop 훅이 typecheck/lint/test를 돌리도록 표시를 남긴다.

input=$(cat)
file=$(jq -r '.tool_input.file_path // empty' <<<"$input")
[[ -z "$file" || ! -f "$file" ]] && exit 0

case "$file" in
  *.ts | *.tsx | *.js | *.jsx | *.mts | *.cts | *.css) ;;
  *) exit 0 ;;
esac

mkdir -p "$CLAUDE_PROJECT_DIR/.claude/.cache"
touch "$CLAUDE_PROJECT_DIR/.claude/.cache/needs-verify"
exit 0
