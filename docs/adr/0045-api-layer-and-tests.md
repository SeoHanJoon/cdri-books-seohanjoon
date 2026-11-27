# 0045. API 함수·검색 훅 구조와 테스트 범위

- 상태: 채택
- 날짜: 2026-11-27
- 관련 Step: Step 5

## 배경
카카오 API를 부르는 함수, React Query 검색 훅, 무한 스크롤 감지, 에러 재시도를 어떻게 나누고 어디까지 단위 테스트할지 정해야 한다.
지금 Vitest는 `node` 환경이고 React 컴포넌트를 그리는 도구(Testing Library, jsdom)가 없다.

## 선택지
- 테스트 범위
  - A안 순수 함수 + fetch 함수(MSW Node 서버)는 Vitest, 화면 흐름은 Playwright: 새 라이브러리 없음 / 훅은 화면을 통해서만 확인
  - B안 A안 + 훅을 Testing Library·jsdom으로 테스트: 훅을 따로 검증 / 라이브러리 2개 추가, 같은 흐름을 두 번 테스트
- 무한 스크롤 감지
  - A안 IntersectionObserver를 감싼 작은 훅 직접 작성: 의존성 없음, 20줄 안팎 / 직접 관리
  - B안 `react-intersection-observer`: 검증된 구현 / 기능 하나에 의존성 추가

## 결정
테스트 A안, 감지 A안. (사용자 선택)
- `src/api/kakaoBook.ts`: `searchBooks({ query, target, page })`. `Authorization: KakaoAK {key}` 헤더를 붙이고, 실패하면 상태 코드를 담은 `KakaoApiError`를 던진다.
- `src/hooks/`: query key factory(`bookKeys.search({ query, target })`)와 `useInfiniteQuery` 검색 훅. 다음 페이지는 `meta.is_end`로 판단한다. ([0003](0003-infinite-scroll.md))
- 재시도: 4xx(요청이 잘못됨)는 다시 해도 같으므로 재시도하지 않고, 5xx·네트워크 오류만 한 번 더 시도한다.
- 무한 스크롤: 목록 끝 표시 요소가 화면 200px 앞까지 오면 다음 페이지를 부른다.

## 결과
- 의존성은 MSW 하나만 늘어난다.
- URL 검증, 다음 페이지 계산, 요청 헤더·파라미터, 에러 변환은 단위 테스트로 빠르게 확인한다.
- 로딩·에러·무한 스크롤은 실제 브라우저에서 Playwright로 확인하고, 그 영상이 PR에 붙는다.
