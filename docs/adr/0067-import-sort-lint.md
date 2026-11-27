# 0067. import 순서는 ESLint 플러그인 simple-import-sort로 지킨다

- 상태: 채택
- 날짜: 2026-11-28
- 관련 Step: Step 11

## 배경
import는 외부 패키지, `@/`, `./`로 묶고, 묶음 사이에 빈 줄을 두고, 묶음 안은 알파벳 순으로 쓴다. 이 규칙을 지키는 도구는 없었다. 그래서 [0064](0064-components-subfolders.md)에서 폴더를 옮길 때 경로만 바뀌고 순서는 고쳐지지 않았고, `SearchPage`·`WishlistPage`의 import 순서가 흐트러졌다.

## 선택지
- A안 ESLint 플러그인 `eslint-plugin-simple-import-sort`: 설정 없이도 기본 묶음이 지금 규칙과 같다(외부 → `@/` → `./`). 값 없이 가져오기만 하는 import(폰트, CSS)는 순서를 건드리지 않는다. `pnpm lint`가 잡는다 / 개발 패키지 1개 추가
- B안 Prettier 플러그인 `@ianvs/prettier-plugin-sort-imports`: 포맷할 때 같이 정렬한다 / 묶음 규칙을 직접 적어야 하고, `prettier-plugin-tailwindcss`와 같이 쓰려면 플러그인 순서를 맞춰야 한다
- C안 VS Code `source.organizeImports`: 추가 패키지가 없다 / 내 편집기에서만 동작하고 검사에서는 걸리지 않는다

## 결정
A안. (사용자 선택)
- 지금 규칙을 그대로 따르므로 설정은 규칙을 켜는 한 줄이다. 저장할 때 이미 켜 둔 `source.fixAll.eslint`가 정렬한다.
- 평가자나 다른 사람의 편집기 설정과 상관없이 `pnpm lint`에서 걸린다.
- 폰트·CSS import는 순서에 따라 스타일이 달라질 수 있다. 이 플러그인은 이 둘의 순서를 그대로 두므로 [main.tsx](../../src/main.tsx)가 안전하다.

## 결과
- 켰을 때 걸린 파일은 `SearchPage`, `WishlistPage`, `eslint.config.js`(플러그인 import를 추가한 곳) 3개다. 셋 다 import 줄의 순서만 바뀌었다. 나머지 파일은 이미 규칙대로였다.
- 폴더를 옮기거나 import를 추가해도 순서가 다시 흐트러지지 않는다.
- 패키지 이름 바로 뒤의 `/`를 `-`보다 앞에 둔다(`eslint/config`가 `eslint-config-prettier`보다 앞). 사람이 손으로 쓸 때와 조금 다를 수 있다.
