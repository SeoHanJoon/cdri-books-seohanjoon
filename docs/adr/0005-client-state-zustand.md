# 0005. 찜 목록과 검색 기록은 Zustand + persist로 관리한다

- 상태: 채택
- 날짜: 2026-11-27
- 관련 Step: Step 6, Step 8

## 배경
찜 목록과 검색 기록은 서버와 무관한 브라우저 전용 데이터이고, 브라우저를 다시 열어도 유지되어야 한다.
찜 목록은 "찜한 시점의 데이터"를 보관해야 해서 API 결과와 달라질 수 있다. (Figma 주석)
서버 데이터(검색 결과)는 React Query가 맡는다.

## 선택지
- A안 Zustand + persist 미들웨어: Zustand에 포함된 공식 미들웨어가 localStorage 저장·복원을 처리, `version`/`migrate`로 저장 형태 변경에 대응 / 의존성 1개 추가
- B안 `useSyncExternalStore` + localStorage 직접 구현: 의존성 없음 / 저장·구독·복원·형태 변경 처리를 직접 작성하고 테스트해야 함
- C안 React Query로 관리 (`persistQueryClient`): 도구 하나로 통일 / 서버 캐시를 저장하는 기능이라 서버와 다시 맞추면 안 되는 "찜한 시점 데이터"와 성격이 맞지 않음

## 결정
A안. 서버 상태는 React Query, 클라이언트 상태는 Zustand로 역할을 나눈다.
persist는 Zustand 패키지에 포함된 공식 미들웨어라 별도 설치가 필요 없다. v3.1.4(2020-11)부터 `zustand/middleware`에 들어 있었고, 최신 v5.1.0까지 유지되고 있다.

## 결과
- "브라우저 재시작 후에도 유지" 요구사항을 store 선언 한 곳에서 해결한다.
- 찜 데이터 형태가 바뀌면 `version`을 올리고 `migrate`로 이전 데이터를 변환한다.
- 여러 탭 간 실시간 동기화는 기본 제공되지 않는다. 필요하면 `storage` 이벤트로 보완한다.
