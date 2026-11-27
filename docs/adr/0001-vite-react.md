# 0001. 빌드 도구로 Vite + React를 쓴다

- 상태: 채택
- 날짜: 2026-11-27
- 관련 Step: Step 1

## 배경
필수 스택은 React.js, TypeScript, React Query다. React를 Vite 위에서 쓸지, Next.js(App Router) 위에서 쓸지 정해야 했다.
이 서비스는 사용자가 검색어를 입력해야 데이터 조회가 시작되고, 찜 목록·검색 기록은 브라우저(localStorage)에만 있다.

## 선택지
- A안 Vite + React: 요구사항 "React.js"와 그대로 일치, 설정이 단순, React Query를 `QueryClientProvider` 하나로 사용 / SSR·SEO 없음
- B안 Next.js 16: Route Handler로 API 키를 서버에 숨길 수 있음, SSR·SEO / 서버·클라이언트 컴포넌트 경계, hydration, `useSearchParams`의 Suspense 요구 등 신경 쓸 것이 늘어남. localStorage 데이터는 서버 렌더링 시 hydration 불일치 처리가 필요

## 결정
A안. 화면의 거의 모든 동작이 사용자 입력 이후 클라이언트에서 일어나서 SSR로 얻는 이점이 없다.
API 키 노출은 과제 안내(`.env` 사용, 키가 담긴 `.env`를 이메일로 전달)가 클라이언트 호출을 전제로 하고 있어 B안의 장점이 크지 않다.

## 결과
- 평가 항목(컴포넌트 설계, 상태 관리, API 연동, 성능)에 집중할 수 있다.
- `VITE_` 환경변수는 번들에 포함되어 브라우저에서 보인다. 실서비스라면 BFF(프록시 서버)로 키를 숨겨야 한다는 점을 README에 적는다.
