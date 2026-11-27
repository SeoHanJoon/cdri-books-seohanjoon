# CDRI 도서 검색 서비스 — 작업 계획

> 과제: 카카오(다음 검색) 책 검색 API 기반 도서 검색 서비스
> 필수 스택: React.js · TypeScript · React Query
> 디자인: Figma `certicos Books` (파일 키 `VHM0w7IBWLaaCJp0l9Mkff`)

---

## 1. 기술 스택

| 구분 | 선택 | 비고 |
|---|---|---|
| 빌드 | Vite 8 | CSR 앱이라 SSR/RSC 불필요 |
| UI | React 19 + TypeScript 6.0 | typescript-eslint가 TS 6.0까지 지원 ([0011](adr/0011-eslint-typescript-6.md)) |
| 서버 상태 | TanStack Query v5 | `useInfiniteQuery`로 페이지 단위 조회 |
| 라우팅 | React Router 8 (데이터 모드) | `/` 도서 검색, `/wishlist` 내가 찜한 책 ([0014](adr/0014-react-router-data-mode.md)) |
| 스타일 | Tailwind CSS v4 | Figma 스타일 가이드를 `@theme` 토큰으로 이식 |
| 폰트 | `@fontsource-variable/noto-sans-kr` | 글자 범위별 조각 자체 호스팅 ([0013](adr/0013-font-fontsource-variable.md)) |
| 클래스 이름 | clsx | 조건부 클래스 합치기 ([0025](adr/0025-clsx.md)) |
| 클라이언트 상태 | Zustand + persist | 찜 목록, 검색 기록 (localStorage 유지) |
| 코드 품질 | ESLint + Prettier | 폴더 구조는 역할별 + `types/`, `assets/` ([0020](adr/0020-folder-structure-types.md)) |
| 런타임 | Node.js 26.13.1 (LTS) | `.nvmrc`로 고정 |
| 패키지 매니저 | pnpm 12 | `package.json`의 `packageManager`로 고정 |
| 단위 테스트 | Vitest | 화면과 분리된 로직 (검색 기록, 가격 표시, 찜 store 등) |
| 브라우저 테스트 | Playwright | PR의 as-is / to-be 영상 녹화에도 사용 |
| API 모킹 | MSW | 카카오 API 가짜 응답. 개발 서버·Vitest·Playwright가 같은 handler 공유 (Step 5부터) |

### 작업 흐름

- Step마다 `step-<번호>-<영문-이름>` 브랜치 → PR → main 머지 (머지는 직접)
- PR 본문에 Playwright 영상 첨부: 새 기능은 to-be만, 기존 화면 변경은 as-is(main) / to-be(PR) 나란히
- Claude Code 설정: `.claude/` (`/step-start`, `/step-finish`, `/pr`, `/adr`, 규칙 `.claude/rules/`)
- 설계 결정 기록: `docs/adr/`

### 커밋 양식

```
<type>(step-N): <한국어 요약>

<본문 (선택): 무엇을, 왜>

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

| type | 용도 | 예시 |
|---|---|---|
| `feat` | 기능 추가 | `feat(step-2): BookListItem 컴포넌트 추가` |
| `fix` | 버그 수정 | `fix(step-4): 찜하기 토글 후 스크롤 위치가 초기화되는 문제 수정` |
| `test` | 테스트 추가·수정 | `test(step-5): 검색 기록 8개 초과 시 오래된 항목 삭제 테스트 추가` |
| `docs` | 문서, ADR, PLAN 갱신 | `docs(step-2): Step 2 완료 표시 및 ADR 추가` |
| `style` | 코드 포맷 (동작 변화 없음) | `style(step-2): Prettier 포맷 적용` |
| `refactor` | 동작 변화 없는 구조 개선 | `refactor(step-4): 가격 표시 로직을 formatPrice로 분리` |
| `perf` | 성능 개선 | `perf(step-8): BookListItem 메모이제이션 적용` |
| `chore` | 설정, 빌드, 의존성 | `chore(step-1): Vite와 Tailwind 설정` |

- Step 안에서 작업 단위 하나가 끝날 때마다 커밋 (typecheck / lint / test 통과 후)
- Step 밖의 커밋은 scope 생략: `chore: 작업 계획과 Claude Code 설정 추가`

### Figma 노드

| 화면 | 노드 ID |
|---|---|
| Style (스타일 가이드) | `753:96` |
| Elements | `754:70` |
| 도서 검색 초기 화면 | `18:969` |
| 도서 검색 결과 화면 | `18:805` |
| 전체 검색 (검색 기록 포함) | `757:958` |
| ~~전체 검색 (구버전)~~ — **무시** | `18:495` |
| 상세 검색 | `18:608` |
| 상세 검색 팝업 | `744:156` |
| 내가 찜한 책 초기 화면 | `757:1435` |
| 내가 찜한 책 화면 | `744:313` |
| 아이콘 like/line, like/fill | `3004:621`, `3004:622` |

> **`18:495`는 참조하지 않는다.** 캔버스에서 `757:958`과 같은 위치에 겹쳐 아래에 가려져 있는 이전 버전이다. 주석 내용이 최신본과 다르지만 요구사항 근거로 쓰지 않는다.

---

## 2. 디자인 토큰 (Figma Style 753:96)

### 색상

| 토큰 | 값 |
|---|---|
| Palette/Primary | `#4880EE` |
| Palette/Red | `#E84118` |
| Palette/Black | `#222222` |
| Palette/Gray | `#DADADA` |
| Palette/LightGray | `#F2F4F6` |
| Palette/White | `#FFFFFF` |
| Text/Primary | `#353C49` |
| Text/Secondary | `#6D7582` |
| Text/Subtitle | `#8D94A0` |

### 타이포그래피 (Noto Sans KR)

| 토큰 | 크기 | 행간 | 굵기 |
|---|---|---|---|
| Title1 | 24 | 24 | 700 |
| Title2 | 22 | 24 | 700 |
| Title3 | 18 | 18 | 700 |
| Body1 | 20 | 20 | 500 |
| Body2 | 14 | 14 | 500 |
| Body2 Bold | 14 | 14 | 700 |
| Caption | 16 | 16 | 500 |
| Small | 10 | 10 | 500 |

- 간격 / radius / shadow는 가이드에 없음 → 화면 시안 실측값으로 보완
- 행간 100%는 여러 줄 텍스트(책 소개)에서 시안 실측값 별도 확인

---

## 3. 기능 요구사항 (Figma 주석 기준)

### 화면
1. 도서 검색 초기 화면 / 검색 결과 없음 — "검색된 결과가 없습니다."
2. 도서 검색 결과 화면
3. 전체 검색 UI (검색 기록 포함)
4. 상세 검색 UI (팝업)
5. 내가 찜한 책 초기 화면 — "찜한 책이 없습니다."
6. 내가 찜한 책 화면

### 검색
- [ ] 검색어 입력 후 Enter로 검색
- [ ] 페이지당 10개
- [ ] "도서 검색 결과 총 N건" 표시

### 결과 리스트
- [ ] 행 클릭(상세보기) 시 accordion으로 펼침 — 큰 표지, 책 소개, 원가/할인가, 구매하기
- [ ] 할인가가 없으면 할인가 미노출
- [ ] 구매하기 → 새 탭으로 책 상세 페이지(API 응답 `url`) 이동
- [ ] 하트 아이콘 클릭 시 찜하기 토글

### 검색 기록
- [ ] 최대 8개, 초과 시 오래된 것부터 삭제
- [ ] 브라우저 재시작 후에도 유지
- [ ] 입력창 아래 드롭다운, 항목별 X 삭제

### 상세 검색 팝업
- [ ] '상세검색' 버튼 클릭 시 버튼 하단에 팝업
- [ ] 검색 조건 select: 제목 / 저자명 / 출판사 (→ API `target`: `title` / `person` / `publisher`)
- [ ] '검색하기' 클릭 시 팝업 닫히며 상세 검색 실행
- [ ] 전체 검색과 상세 검색은 동시 불가 — 상세 검색 시 전체 검색어 초기화, 전체 검색 시 상세 조건 초기화

### 찜하기
- [ ] 찜한 시점의 데이터를 스냅샷으로 저장 (API 결과와 달라질 수 있음)
- [ ] 브라우저 재시작 후에도 유지
- [ ] 찜 목록도 페이지당 10개, "찜한 책 총 N건"

### 잘못된 접근 (디자인 미명시 — 지원자 판단, [0010](adr/0010-not-found.md))
- [ ] 없는 경로(예: `/abc`) → "존재하지 않는 페이지입니다."
- [ ] URL의 `target`이 허용 값(`title` / `person` / `publisher`)이 아님 → 같은 화면, API 호출 안 함

---

## 4. 결정 필요 사항

| # | 항목 | 추천안 | 근거 | 결정 |
|---|---|---|---|---|
| 1 | 결과 목록 방식 | 무한 스크롤 | 디자인은 "페이지당 10개"만 명시하고 넘기는 방식은 미정(지원자 판단). 시안에 페이지 번호·더보기 버튼 없이 목록이 이어지는 표시만 있음. `useInfiniteQuery` 활용 | ☑ 무한 스크롤 ([0003](adr/0003-infinite-scroll.md)) |
| 2 | 상세 검색의 검색 기록 저장 | 전체 검색만 저장 | 기록 드롭다운이 전체 검색창에 붙어 있어 조건 혼재 시 재검색 의미가 모호 | ☑ 전체 검색만 저장 ([0004](adr/0004-search-history-scope.md)) |
| 3 | 클라이언트 상태 | Zustand + persist | 코드가 짧고 의도가 명확. 대안: `useSyncExternalStore` 직접 구현 | ☑ Zustand + persist ([0005](adr/0005-client-state-zustand.md)) |
| 4 | 커밋 방식 | Step 브랜치 + PR (as-is / to-be 영상 첨부) | PR마다 작업 내용·판단 근거·화면 변화가 남아 평가자가 과정을 확인하기 쉬움 | ☑ Step 브랜치 + PR ([0006](adr/0006-step-branch-pr-videos.md)) |
| 5 | 테스트 도구 | Vitest + Playwright | 로직은 단위 테스트, 화면은 브라우저 테스트(영상 녹화 겸용) | ☑ Vitest + Playwright ([0007](adr/0007-test-tools.md)) |
| 6 | 패키지 매니저 | pnpm | 설치 빠름, `.claude/` 훅·스킬이 pnpm 기준 | ☑ pnpm ([0008](adr/0008-pnpm.md)) |
| 7 | 빌드 도구 | Vite + React | SSR 이점 없는 CSR 서비스, 요구사항 "React.js"와 일치 | ☑ Vite + React ([0001](adr/0001-vite-react.md)) |
| 8 | 스타일링 | Tailwind v4 + Figma 토큰 | `@theme`에 스타일 가이드 이식, 가이드 밖 색 사용 차단 | ☑ Tailwind v4 ([0002](adr/0002-tailwind-figma-tokens.md)) |
| 9 | 작업 순서 · API 모킹 | 화면 구성 먼저, API 연결은 그 다음. 모킹은 MSW | 화면을 Figma와 먼저 맞춰 확정하고 데이터만 바꿔 끼움. 가짜 데이터를 한 곳에서 관리 | ☑ 화면 먼저 + MSW ([0009](adr/0009-screens-first-msw.md)) |
| 10 | 잘못된 경로·검색 조건 | "존재하지 않는 페이지입니다." 화면 | 잘못된 조건으로 검색을 진행하지 않음. 없는 경로와 같은 화면으로 일관되게 처리 | ☑ NotFound 화면 ([0010](adr/0010-not-found.md), 화면 구성은 → [0041](adr/0041-not-found-without-nodata.md)) |
| 11 | 린트 · TypeScript 버전 | ESLint + TS 6.0 | typescript-eslint가 TS `<6.1.0`만 지원. 타입 기반 린트 규칙 유지 | ☑ ESLint + TS 6.0 ([0011](adr/0011-eslint-typescript-6.md)) |
| 12 | 폴더 구조 | 기능별 | 기능 PR이 폴더 하나에서 끝남 | ☑ 역할별 ([0012](adr/0012-folder-structure-by-role.md)) |
| 13 | 폰트 불러오기 | `@fontsource-variable` | 전체 파일 4.2MB vs 조각 방식 약 200KB, 외부 서버 불필요 | ☑ `@fontsource-variable` ([0013](adr/0013-font-fontsource-variable.md)) |
| 14 | 라우터 사용 방식 | 데이터 모드 | route `lazy`로 코드 분할, `errorElement` | ☑ 데이터 모드 ([0014](adr/0014-react-router-data-mode.md)) |
| 15 | 갓 배포된 버전 설치 | pnpm 최소 배포 기간(24시간) 규칙 준수 | 악성 버전이 발견·삭제되기 전 설치를 피함. vite 8.4.0 대신 8.3.8 | ☑ 규칙 준수 ([0015](adr/0015-pnpm-minimum-release-age.md)) |
| 16 | 가이드 밖 시안 값 | 토큰 추가 | 시안 1:1 구현, 규칙 "실측 후 토큰 추가"와 일치 | ☑ 토큰 추가 ([0016](adr/0016-design-values-beyond-guide.md)) |
| 17 | 아이콘 확보·사용 | Figma 직접 내보내기 + React 컴포넌트 | API 한도 초과, 아이콘 7개뿐이라 플러그인 불필요 | ☑ 직접 내보내기 + 컴포넌트 ([0017](adr/0017-icons-react-components.md)) |
| 18 | Button 링크 처리 | `variant` + 스타일 함수 | 구매하기는 링크(`<a>`)여야 함 | ☑ `href` 유무로 `<a>`/`<button>` 분기 ([0018](adr/0018-button-href.md), `<a>`는 → `Link` [0040](adr/0040-button-href-router-link.md)) |
| 19 | 책 컴포넌트 데이터 | 화면용 `Book` 타입 | 카카오 규칙(-1 등)을 변환 함수 한 곳에 가둠 | ☑ `Book` + 공통 props 확장 ([0019](adr/0019-book-view-type.md), props는 → [0032](adr/0032-book-list-item-single-component.md)) |
| 20 | 공용 타입·이미지 위치 | `src/types/`, `src/assets/` | 여러 역할이 같이 쓰는 타입, import하는 이미지 | ☑ `src/types/`, `src/assets/` 추가 ([0020](adr/0020-folder-structure-types.md)) |
| 21 | 가격·하트 동작 (미명시) | 할인가 우선, 할인가 없으면 원가만, 작은 하트는 표시만 | 실제 결제 가격, 취소선은 비교 시에만 의미 | ☑ 작은 하트도 찜 토글 ([0021](adr/0021-price-and-heart-behavior.md)) |
| 22 | 공통 컴포넌트 확인 화면 | 개발용 `/dev/elements` | Elements와 비교, PR 영상, 운영 빌드 제외 | ☑ `/dev/elements` ([0022](adr/0022-dev-elements-page.md)) |
| 23 | 화면 너비 대응 | 데스크톱 기준 | 시안이 1920px 하나뿐 | ☑ 모바일까지 ([0023](adr/0023-responsive-mobile.md)) |
| 24 | 아이콘 props | 색은 `className`으로 | 시안의 크기·색 조합 고정 | ☑ `size`만 받고 색은 내부, 작은 테두리 하트는 회색 ([0024](adr/0024-icon-component-props.md)) |
| 25 | 클래스 이름 합치기 | clsx | 조건부 클래스가 여러 컴포넌트에 필요, 0.2KB | ☑ clsx ([0025](adr/0025-clsx.md)) |
| 26 | Header 반응형 배치 | 넓은 화면은 시안 그대로 3단계 | 1024px쯤에서 로고와 탭이 겹침 | ☑ 3단계 + 탭 항상 가운데 ([0026](adr/0026-header-responsive.md)) |
| 27 | SearchBox 검색어·배치 | 페이지가 관리, 좁은 화면은 입력창만 줄임 | URL 동기화·상세 검색 초기화를 페이지에서 처리 | ☑ 추천안 ([0027](adr/0027-searchbox-controlled.md), 상세검색 버튼은 → [0036](adr/0036-detail-search-component.md)) |
| 28 | Button 여백 | 변형별 좌우 여백 | 덮어쓰기 없이 상세보기 아이콘을 넣기 위해 | ☑ 여백 없이 가운데, 너비는 쓰는 쪽 ([0028](adr/0028-button-no-padding.md)) |
| 29 | 책 행 모바일 배치 | 세로로 쌓기 | 시안의 모든 요소 유지 | ☑ 세로로 쌓기 ([0029](adr/0029-book-row-responsive.md)) |
| 30 | fixture 마련·화면 단계 상태 전환 | 실제 응답 저장, 검색어로 선택 | 실제 예외 값 포함, 세 상태 모두 시연 | ☑ 추천안 ([0030](adr/0030-fixture-real-response.md)) |
| 31 | `Book.isbn` 값 | 13자리 → 10자리 → `url` | 책을 구별하는 값 하나, 비지 않음 | ☑ 추천안 ([0031](adr/0031-book-isbn-identifier.md)) |
| 32 | 접힌 행·펼친 행 구조 | 두 컴포넌트 유지 + 포커스 이동 | 기존 props 유지 | ☑ 하나로 합침, 상세보기 버튼 맨 앞 ([0032](adr/0032-book-list-item-single-component.md)) |
| 33 | 검색 기록 드롭다운 위치 | `SearchBox` 안 | 시안상 입력창과 한 상자 | ☑ 추천안 ([0033](adr/0033-search-history-dropdown.md)) |
| 34 | 상세 검색 팝업·Select | 직접 구현 | Headless UI는 앱 JS +37% | ☑ 직접 구현 ([0034](adr/0034-detail-search-popover.md)) |
| 35 | 책 목록·펼침 상태 위치 | `BookList` 컴포넌트 | 두 페이지 재사용, 검색어 바뀌면 초기화 | ☑ 추천안 ([0035](adr/0035-book-list-component.md)) |
| 36 | 상세 검색 컴포넌트·두 입력창 관계 | 버튼+팝업 한 컴포넌트, 글자 안 옮김, 닫으면 버림 | 상호 초기화를 페이지 한 곳에서 | ☑ 추천안 ([0036](adr/0036-detail-search-component.md)) |
| 37 | 본문 위치·좁은 화면 여백·잘린 책 소개 (미명시) | 가운데, 768px 미만 40px, 잘리면 "…" | 시안 프레임 불일치, 카카오가 250자에서 자름 | ☑ 추천안 ([0037](adr/0037-search-page-layout-and-contents.md)) |
| 38 | 찜 페이지 세로 간격 | 도서 검색과 맞춤 | 탭을 오가도 제목·목록 위치 그대로 | ☑ 추천안 ([0038](adr/0038-wishlist-page-spacing.md)) |
| 39 | 화면 단계 찜 페이지 상태 | 개발용 쿼리로 목록/빈 상태 전환 | 두 상태 모두 시연 | ☑ 목록만 고정, 빈 상태는 Step 8 ([0039](adr/0039-wishlist-fixture-list-only.md)) |
| 40 | 앱 안으로 가는 Button 링크 | `to` prop 추가 | 새로고침 없이 이동 | ☑ `href` 분기를 `Link`로 (사용자 제안, [0040](adr/0040-button-href-router-link.md)) |
| 41 | NotFound 화면 구성 | 제목 + 버튼만 (NoData 없이) | 책 아이콘은 "데이터 없음" 뜻이라 잘못된 주소와 안 맞음 | ☑ 추천안 ([0041](adr/0041-not-found-without-nodata.md)) |
| 42 | 검색 조건 위치 | URL이 기준 + 검색마다 push | 새로고침·뒤로가기·공유, 상호 초기화가 URL 한 번 바꾸기로 끝남 | ☑ 추천안 ([0042](adr/0042-search-state-url.md)) |
| 43 | MSW 다음 페이지·시나리오 | 실제 page 2~3 저장, 지연·에러는 검색어로 | 실제 데이터, 손으로 재현·PR 영상에 보임 | ☑ 추천안 ([0043](adr/0043-msw-fixtures-and-scenarios.md)) |
| 44 | 로딩·에러 화면 (미명시) | 스켈레톤 + 다시 시도 | 레이아웃 흔들림 적음, 다음 페이지 실패에도 목록 유지 | ☑ 추천안 ([0044](adr/0044-loading-error-ui.md)) |
| 45 | API·훅 구조, 테스트 범위 | 순수 함수·fetch는 Vitest, 화면은 Playwright, 감지 훅 직접 작성 | 의존성은 MSW 하나만 추가 | ☑ 추천안 ([0045](adr/0045-api-layer-and-tests.md)) |
| 46 | isbn이 같은 검색 결과 | 처음 것만 보여줌 | 실제 응답 866건 중 7건 겹침, isbn이 목록 key·찜 기준 | ☑ 추천안 ([0046](adr/0046-dedupe-books-by-isbn.md)) |
| 47 | 로딩 중 건수 표시 (미명시) | 숫자 자리만 스켈레톤 | 틀린 숫자를 보이지 않음 | ☑ 직전 건수 유지 ([0047](adr/0047-count-while-loading.md)) |

---

## 5. 작업 순서

각 Step = 브랜치·PR 하나. Step 안에서는 작업 단위마다 커밋.

화면 구성(Step 2~4)을 먼저 끝내고, API 연결과 기능(Step 5~8)은 그 다음에 붙인다. ([0009](adr/0009-screens-first-msw.md))

- **화면 구성 단계**: 화면에 보이는 것과 화면 안에서만 일어나는 동작(행 펼침, 팝업 열고 닫기, 드롭다운 표시)까지. 데이터는 카카오 응답 형식의 fixture JSON(`src/mocks/fixtures/`)을 직접 넣는다.
- **기능 단계**: fixture 자리에 실제 데이터와 저장 로직을 연결한다. 개발·테스트 중 API 응답은 MSW가 같은 fixture로 돌려준다.

### Step 1. 프로젝트 기반 ✅
- [x] Vite + React 19 + TypeScript 초기화
- [x] `package.json`에 `packageManager: pnpm@12.x`, `engines.node: >=26` 지정 (`.nvmrc`는 생성됨)
- [x] ESLint / Prettier, `@/` 경로 별칭
- [x] `.env.example`, `.gitignore` (`.env` 제외)
- [x] Tailwind v4 + `@theme` 토큰 (색상, 타이포), Noto Sans KR
- [x] QueryClient Provider + Devtools
- [x] React Router 라우트 (`/`, `/wishlist`, 그 외 경로 → NotFound 자리)
- [x] Vitest 설정
- [x] Playwright 설정 (`E2E_PORT`, `e2e:record` → `recordings/` 영상)
- [x] `package.json` 스크립트: `dev`, `build`, `typecheck`, `lint`, `test`, `e2e`, `e2e:record`

### Step 2. 공통 UI · 레이아웃 (Figma Elements `754:70`) ✅
Elements의 컴포넌트를 1:1로 화면 전용 컴포넌트로 만든다. 데이터는 props로만 받고, 검색·찜·펼침 같은 동작 로직은 연결하지 않는다.
- [x] 아이콘 추출 (`Style 753:96` Icon 섹션)
  - SVG: 검색, 화살표, 닫기, 하트 line/fill
  - PNG(@2x, 160×160): NoData 책 아이콘 — Figma에서 비트맵 이미지 채우기라, SVG로 내보내도 PNG(840×859)가 base64로 통째로 들어갈 뿐 벡터가 아님 (SVG 707KB vs PNG@2x 17KB)
  - 책 표지는 API `thumbnail`을 쓰므로 Figma에서 내보내지 않는다
- [x] Button — 각 컴포넌트 안의 버튼에서 변형 도출 (구매하기 primary, 상세보기 secondary, 상세검색 outline / 크기별)
- [x] `Header` + Layout (로고, 탭 2개, 활성 탭 밑줄)
- [x] `NoData` (아이콘 + 문구 props — "검색된 결과가 없습니다." / "찜한 책이 없습니다.")
- [x] `SearchCountText` (라벨 + 건수 props — "도서 검색 결과" / "찜한 책")
- [x] `SearchBox` (제목, 검색 입력창, 상세검색 버튼 — 입력·이벤트는 props로)
- [x] `BookListItem` (접힌 행: 표지, 제목, 저자, 가격, 구매하기, 상세보기)
- [x] `BookListItemDetail` (펼친 행: 큰 표지 + 하트, 책 소개, 원가/할인가, 구매하기)
  - props는 API 응답 타입이 아니라 화면에 필요한 값으로 설계 → 검색 결과(API)와 찜 목록(저장 데이터)에서 같은 컴포넌트 재사용
  - 할인가 없으면 할인가 미노출, 원가는 취소선 없이 구매하기 위로 ([0021](adr/0021-price-and-heart-behavior.md))
- [x] 좁은 화면 배치 — 컴포넌트별로 추천안 확인 후 구현 ([0023](adr/0023-responsive-mobile.md))
- [x] 개발용 `/dev/elements` 확인 화면 + Playwright 테스트 ([0022](adr/0022-dev-elements-page.md))

### Step 3. 화면 구성: 도서 검색 페이지 ✅
Figma `18:969`(초기), `18:805`(결과), `757:958`(검색 기록), `18:608`·`744:156`(상세 검색 팝업)
- [x] fixture: 카카오 응답 형식 JSON (`src/mocks/fixtures/`) — 결과 있음, 결과 없음 ([0030](adr/0030-fixture-real-response.md))
- [x] 카카오 응답 → `BookListItem` props 변환 함수 (Step 5에서 그대로 재사용) ([0031](adr/0031-book-isbn-identifier.md))
- [x] 페이지 레이아웃: "도서 검색" 제목, `SearchBox`, `SearchCountText`, 결과 목록
- [x] 초기 / 결과 없음 상태 — `NoData`
- [x] 결과 목록: 행별 펼침(accordion), 구매하기 새 탭 ([0035](adr/0035-book-list-component.md))
  - 여러 권을 동시에 펼칠 수 있다. 새로 검색하면 펼침이 초기화된다
  - 펼치고 접을 때 키보드 포커스를 상세보기 버튼에 유지한다. 접힌 행·펼친 행을 하나의 `BookListItem`으로 합쳐 버튼이 같은 요소로 남게 했다 ([0032](adr/0032-book-list-item-single-component.md))
- [x] 검색 기록 드롭다운 UI (입력창 포커스 시 표시, X 버튼) — 저장 로직 없음, 페이지는 빈 기록 ([0033](adr/0033-search-history-dropdown.md))
- [x] 상세 검색 팝업 UI: Popover + 조건 Select(제목/저자명/출판사), 외부 클릭·Esc로 닫기 — 검색 실행 없음 ([0034](adr/0034-detail-search-popover.md), [0036](adr/0036-detail-search-component.md))

### Step 4. 화면 구성: 내가 찜한 책 · NotFound 페이지 ✅
Figma `757:1435`(초기), `744:313`(목록)
- [x] 페이지 레이아웃: "내가 찜한 책" 제목, `SearchCountText`("찜한 책"), 목록 — 세로 간격은 도서 검색과 같게 ([0038](adr/0038-wishlist-page-spacing.md))
- [x] 빈 상태 — `NoData`("찜한 책이 없습니다.") — 분기만 넣고, 화면 확인·테스트는 Step 8 ([0039](adr/0039-wishlist-fixture-list-only.md))
- [x] 목록: Step 3과 같은 `BookList` 재사용 (fixture 10권, 하트는 Step 8 전까지 찜 안 함, [0035](adr/0035-book-list-component.md))
- [x] NotFound 화면: Header 유지, "존재하지 않는 페이지입니다." 제목 + 도서 검색으로 돌아가는 버튼 — Figma에 없는 화면. 책 아이콘이 어울리지 않아 `NoData`는 쓰지 않음 ([0041](adr/0041-not-found-without-nodata.md))
  - 버튼은 새로고침 없이 이동한다. Button의 링크를 `Link`로 그린다 ([0040](adr/0040-button-href-router-link.md))

### Step 5. API 연결
- [x] MSW 설정: 카카오 검색 handler (Step 3 fixture 사용, `page`/`size`/`is_end` 처리, 지연·에러·0건 시나리오)
  - 개발 서버: `VITE_API_MOCKING=enabled`일 때만 시작(`pnpm dev:mock`), 운영 빌드에 포함되지 않게 — `msw/vite` 플러그인은 worker 파일 제공에만 쓴다
  - Vitest: Node용 서버로 같은 handler 사용
  - Playwright: 모킹 켠 개발 서버로 실행
  - 실제 응답 page 1~3 저장, 3페이지에서 `is_end: true`. 지연·에러는 검색어로 고름 ([0043](adr/0043-msw-fixtures-and-scenarios.md))
- [x] `fetch` 래퍼 (`Authorization: KakaoAK {key}`), 요청 / 응답 타입 — 실패는 상태 코드를 담은 `KakaoApiError`, 4xx는 재시도 안 함 ([0045](adr/0045-api-layer-and-tests.md))
- [x] query key factory
- [x] `useInfiniteQuery` 검색 훅 (`meta.is_end`로 다음 페이지 판단)
  - 실제 API는 문서의 50페이지 너머도 응답하고 마지막에 `is_end`를 줘서 상한을 두지 않음
  - isbn이 같은 책은 처음 것만 보여줌 (866건 중 7건, [0046](adr/0046-dedupe-books-by-isbn.md))
- [x] 도서 검색 페이지의 fixture를 API 데이터로 교체: Enter 검색, 건수, 결과 목록
- [x] 무한 스크롤 (IntersectionObserver) — 목록 끝 200px 전에 다음 page. 목록이 화면보다 짧아도 이어서 부름
- [x] 로딩 / 에러 / 빈 상태 — 스켈레톤, 안내 + 다시 시도 ([0044](adr/0044-loading-error-ui.md)), 불러오는 동안 직전 건수 유지 ([0047](adr/0047-count-while-loading.md))
- [x] 검색 조건을 URL 쿼리(`?query=&target=`)로 관리 → 새로고침·뒤로가기 유지 ([0042](adr/0042-search-state-url.md))
- [x] URL을 읽을 때 `target` 검증: 허용 값이 아니면 NotFound 화면, API 호출 안 함. `SearchTarget` 타입으로 검증 안 된 값이 API 함수에 못 들어가게
- [x] 실제 키로 잘못된 `target` 요청 시 카카오 응답 확인 → MSW handler에 같은 동작 재현
  - 카카오는 허용되지 않은 `target`을 에러 없이 무시하고 전체 검색(200), 대소문자는 가리지 않음

### Step 6. 검색 기록 기능
- [ ] 검색 기록 store (Zustand + persist): 최대 8개, 중복 시 맨 앞으로 이동
- [ ] 드롭다운에 연결: 항목 삭제, 클릭 시 재검색
- [ ] 전체 검색만 저장 ([0004](adr/0004-search-history-scope.md))

### Step 7. 상세 검색 기능
- [ ] 팝업 '검색하기' → 조건(`target`)으로 검색 실행, 팝업 닫기
- [ ] 전체 검색 ↔ 상세 검색 상호 초기화

### Step 8. 찜하기 기능
- [ ] 찜 store (Zustand + persist): 찜한 시점 데이터 스냅샷 저장
- [ ] 하트 토글
- [ ] 찜 페이지의 fixture를 store 데이터로 교체 (10개 단위 무한 스크롤), 빈 상태 화면 확인·브라우저 테스트 ([0039](adr/0039-wishlist-fixture-list-only.md))

### Step 9. 성능 최적화 · 마무리
- [ ] `BookListItem` `memo`, 이미지 `loading="lazy"`
- [ ] `staleTime` 등 캐시 전략
- [ ] 라우트 단위 코드 분할
- [ ] 접근성 (`aria-expanded`, 키보드 조작)
- [ ] 빌드 / 린트 최종 점검
- [ ] 아이콘 SVG 통일 ([0024](adr/0024-icon-component-props.md)): Figma API 한도로 받은 SVG마다 상자와 여백이 제각각이다 (Chevron은 20 상자 안 10.5×6, Close는 20 상자 안 11.67, Heart는 24 상자). 그래서 크기를 바꿔 쓸 때 시안과 1~4px씩 어긋난다 (상세보기 화살표 12.6×7.2, 버튼 안 내용 4px 왼쪽, 검색 기록 X 14px). 쓰는 크기별 원본 SVG를 다시 받아 상자 규칙을 맞춘다.

### Step 10. README · 제출
- [ ] 프로젝트 개요
- [ ] 실행 방법 및 환경 설정
- [ ] 폴더 구조 및 주요 코드 설명
- [ ] 라이브러리 선택 이유
- [ ] 강조하고 싶은 기능 (디자인 미명시 사항에 대한 판단 근거 포함)
- [ ] 제출: 담당자 이메일로 GitHub 링크 + `.env` 공유, 제목 `[CDRI] 프론트엔드 사전과제 제출 - [이름]`
