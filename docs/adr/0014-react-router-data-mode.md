# 0014. React Router는 데이터 모드로 쓴다

- 상태: 채택
- 날짜: 2026-11-27
- 관련 Step: Step 1, Step 9

## 배경
React Router 8은 선언형 모드(`<BrowserRouter><Routes>`), 데이터 모드(`createBrowserRouter` + `RouterProvider`), 프레임워크 모드를 제공한다.
프레임워크 모드는 서버·빌드 도구까지 맡는 방식이라 Vite CSR 앱([0001](0001-vite-react.md))에는 맞지 않는다.
v8부터 `react-router-dom` 패키지가 없어져 `react-router`와 `react-router/dom`에서 import한다.

## 선택지
- A안 데이터 모드: 라우트 단위 코드 분할을 route의 `lazy` 속성으로 처리, 라우트 에러 화면(`errorElement`) 지원, 새로 추가되는 훅(`unstable_useRouterState`)도 이 모드 전용 / 선언형보다 덜 익숙할 수 있음
- B안 선언형 모드: 가장 익숙하고 단순 / 코드 분할을 `React.lazy` + `Suspense`로 직접 구성

## 결정
A안. Step 9의 라우트 단위 코드 분할을 라우터 설정 안에서 해결할 수 있다.

## 결과
- 라우트 정의가 `src/app/router.tsx` 한 곳에 객체로 모인다.
- 없는 경로(`*`)도 공통 레이아웃 아래에 두어 Header가 유지된다. ([0010](0010-not-found.md))
