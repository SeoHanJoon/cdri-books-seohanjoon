#!/usr/bin/env bash
# 세션 시작 시 현재 브랜치와 Step 진행 상황을 Claude에게 알려준다. (stdout이 대화 맥락에 들어감)
cd "$CLAUDE_PROJECT_DIR" || exit 0

branch=$(git branch --show-current 2>/dev/null)
echo "현재 브랜치: ${branch:-알 수 없음}"

if [[ "$branch" =~ ^step-([0-9]+) ]]; then
  echo "현재 Step: ${BASH_REMATCH[1]} (docs/PLAN.md \"5. 작업 순서\"의 범위 안에서만 작업)"
fi

plan=docs/PLAN.md
[[ -f "$plan" ]] || exit 0

echo "Step 진행 상황 (docs/PLAN.md):"
# "### Step N. 제목" 줄을 읽고, 제목 끝에 ✅가 있으면 완료로 본다.
grep -E '^### Step [0-9]+' "$plan" | sed -E 's/^### /  /'

pending=$(awk '/^## 4\. 결정 필요 사항/{f=1;next} /^## /{f=0} f && /☐/' "$plan" | wc -l | tr -d ' ')
((pending > 0)) && echo "아직 결정되지 않은 사항: ${pending}개 (docs/PLAN.md \"4. 결정 필요 사항\")"
exit 0
