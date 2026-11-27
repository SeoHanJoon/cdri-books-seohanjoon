# CDRI 도서 검색 서비스

카카오(다음 검색) 책 검색 API로 책을 찾고, 마음에 드는 책을 찜해 두는 웹 서비스입니다.
CDRI 프론트엔드 사전과제로, Figma 시안 `certicos Books`를 구현했습니다.

## 1. 프로젝트 개요

### 주요 기능

| 화면          | 기능                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| 도서 검색 `/` | 전체 검색(Enter), 상세 검색(제목·저자명·출판사), 검색 기록 최근 8개, 결과 10권씩 무한 스크롤, 행 펼쳐 보기 |
| 내가 찜한 책  | 검색 결과에서 하트로 찜한 책을 최근 찜한 순서로 10권씩, 새로고침해도 유지                                  |
| 그 밖         | 없는 주소·잘못된 검색 조건은 "존재하지 않는 페이지" 화면, 로딩 스켈레톤·에러 다시 시도, 모바일 너비 대응  |

### 기술 스택

React 19 · TypeScript 6.0 · TanStack Query v5 · React Router 8 · Zustand · Tailwind CSS v4 · Vite 8
테스트는 Vitest(로직)와 Playwright(브라우저), API 가짜 응답은 MSW로 만들었습니다.

### 작업 방식

- 기능을 10개 Step으로 나누고, Step마다 브랜치를 만들어 PR로 합쳤습니다.
  각 PR에는 Playwright로 녹화한 동작 영상과 판단 근거가 있습니다. ([PR 목록](https://github.com/SeoHanJoon/cdri-books-seohanjoon/pulls?q=is%3Apr+is%3Aclosed))
- 디자인에 없는 동작이나 설계 선택은 선택지와 장단점을 비교해 고르고, [ADR](docs/adr/)(설계 결정 기록)로 남겼습니다.
- Claude Code를 함께 썼습니다. 프로젝트 규칙과 작업 절차를 [`.claude/`](.claude/)에 두어, 결정은 제가 하고 AI는 선택지 정리·구현·검증을 맡는 방식으로 진행했습니다.
  계획과 Step별 체크리스트는 [docs/PLAN.md](docs/PLAN.md)에 있습니다.

## 2. 실행 방법 및 환경 설정

### 준비물

- Node.js 26.13.1 (`.nvmrc`에 고정 — `nvm use`)
- pnpm 12 (`package.json`의 `packageManager`에 고정 — `npm install -g pnpm@12`)

### 설치와 실행

```bash
pnpm install
cp .env.example .env   # 이메일로 받은 .env가 있으면 그 파일을 루트에 두면 됩니다
pnpm dev               # http://localhost:5173
```

`.env`에는 카카오 REST API 키 하나만 들어갑니다. `.env`는 `.gitignore`로 저장소에서 빠져 있고, 키 이름만 담은 `.env.example`을 커밋했습니다.

```bash
VITE_KAKAO_REST_API_KEY=발급받은_키
```

### API 키 없이 실행하기

```bash
pnpm dev:mock
```

MSW가 실제 카카오 응답을 저장해 둔 데이터를 돌려줍니다. 개발 서버에서만 켜지고 운영 빌드에는 들어가지 않습니다.

| 검색어                                   | 결과                                              |
| ---------------------------------------- | ------------------------------------------------- |
| `무라카미 하루키`                        | 3페이지(30권)까지 이어지는 결과                   |
| 상세 검색 · 저자명 · `무라카미 하루키`   | 저자명으로 찾은 결과                              |
| `느린 검색`                              | 3초 뒤 결과 (로딩 스켈레톤 확인)                  |
| `에러`                                   | 서버 에러 (다시 시도 버튼 확인)                   |
| `다음 페이지 에러`                       | 첫 페이지는 성공, 다음 페이지부터 에러            |
| 그 밖의 검색어                           | 결과 없음                                         |

### 그 밖의 명령

| 명령                                         | 하는 일                                        |
| -------------------------------------------- | ---------------------------------------------- |
| `pnpm build` / `pnpm preview`                | 운영 빌드 / 빌드 결과 미리 보기                |
| `pnpm typecheck`                             | 타입 검사                                      |
| `pnpm lint`                                  | ESLint + Prettier 검사                         |
| `pnpm test`                                  | 단위 테스트 (Vitest, 87개)                     |
| `pnpm exec playwright install chromium` 후 `pnpm e2e` | 브라우저 테스트 (Playwright, 103개). MSW를 켠 개발 서버를 스스로 띄웁니다 |
| `pnpm e2e:record`                            | 브라우저 테스트를 영상으로 녹화 (`recordings/`) |
