# 0048. MSW worker 파일은 msw/vite 플러그인으로 개발 서버에서만 제공한다

- 상태: 채택
- 날짜: 2026-11-27
- 관련 Step: Step 5

## 배경
브라우저에서 MSW를 쓰려면 `mockServiceWorker.js`를 앱과 같은 주소에서 제공해야 한다. [0009](0009-screens-first-msw.md)는 이 파일을 `public/`에 두는 방식을 전제로 "운영 빌드에서 제외 처리 필요"라고 적었다.
Vite는 `public/`의 파일을 운영 빌드에 그대로 복사한다. 설치한 MSW 3.0.8에는 Vite 플러그인(`msw/vite`)이 새로 들어 있다.

## 선택지
- A안 `msw/vite` 플러그인: 개발 서버가 `node_modules`의 worker 파일을 직접 제공, 저장소에 파일이 없고 MSW를 올려도 다시 만들 필요 없음, 앱이 `virtual:msw`를 쓰지 않으면 빌드에 넣지 않음 / v3에 새로 생겨 사례가 적음
- B안 `public/`에 파일 추가(`msw init`): 공식 문서의 익숙한 방식 / 운영 빌드에도 복사되어 빼는 설정이 따로 필요, MSW를 올릴 때마다 파일을 다시 만들어야 함

## 결정
A안. (사용자 선택)
플러그인은 worker 파일 제공에만 쓴다. 실행은 실험 기능인 `virtual:msw`(`msw/experimental`) 대신 안정 API인 `setupWorker`/`setupServer`를 쓴다.
브라우저 모킹은 `import.meta.env.DEV`이고 `VITE_API_MOCKING=enabled`일 때만 동적 import로 시작한다.

## 결과
- `pnpm build` 결과물에 worker 파일과 MSW 코드가 없다. (`dist`에서 확인)
- 0009의 "`public/mockServiceWorker.js` 추가, 운영 빌드에서 제외 처리"는 이 ADR로 바뀐다.
- 플러그인의 기본 모드(`auto`)는 `virtual:msw`를 쓰는 번들에만 worker를 넣는다. `worker-only` 모드는 운영 빌드에도 넣으므로 쓰지 않는다.
