# 0040. Button의 링크는 React Router Link로 그린다

- 상태: 채택
- 날짜: 2026-11-27
- 관련 Step: Step 4

## 배경
NotFound 화면에 "도서 검색으로 돌아가기" 버튼이 필요하다. ([0010](0010-not-found.md))
`Button`은 `href`가 있으면 일반 `<a>`로 그린다. ([0018](0018-button-href.md)) 그래서 앱 안 주소(`/`)로 가도 페이지 전체를 새로 불러온다. JS를 다시 받고, React Query 캐시도 비워진다.

## 선택지
- A안 `href` 분기를 `<a>` 대신 `Link`로 그림: props 그대로, 앱 안 주소는 새로고침 없이 이동 / Button을 라우터 밖에서 쓸 수 없음
- B안 `to` prop을 따로 추가해 `Link`로 그림: `href`(바깥)와 `to`(앱 안)가 이름으로 구분됨 / props 갈래가 셋이 됨
- C안 `href` 그대로 둠: 변경 없음 / 누를 때 전체 새로고침
- D안 `<button>` + `navigate('/')`: 새로고침 없음 / 링크가 아니라 우클릭 새 탭, 스크린리더 링크 안내를 잃음

## 결정
A안. (사용자 제안)
설치된 React Router 8.5.3의 `Link`는 출처(origin)가 다른 주소를 `isExternal`로 보고 클릭을 가로채지 않는다. 구매하기의 카카오 주소와 `target="_blank"`도 일반 `<a>`처럼 동작하므로, 바깥·앱 안 주소를 한 갈래(`href`)로 처리할 수 있다.

## 결과
- 쓰는 쪽은 바뀌지 않는다. `<Button href="/">`는 새로고침 없이 이동하고, `<Button href={url} target="_blank">`는 그대로 새 탭을 연다.
- `Link`가 라우터 정보를 읽으므로 Button은 `RouterProvider` 안에서만 그릴 수 있다. 지금 모든 화면이 라우터 안에 있다.
- 0018의 "`href`면 `<a>`" 중 그리는 태그만 바뀐다. 판별 유니온 props는 그대로다.
