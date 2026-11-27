# 0027. SearchBox의 검색어는 페이지가 관리하고, 좁은 화면에서는 입력창만 줄인다

- 상태: 일부 폐기 (onDetailSearchClick → 0036)
- 날짜: 2026-11-27
- 관련 Step: Step 2, Step 5, Step 7

## 배경
검색어는 Step 5에서 URL(`?query=`)과 동기화되고(뒤로가기·새로고침 유지), Step 7에서 상세 검색을 하면 비워져야 한다. 즉 SearchBox 밖에서 검색어를 바꿔야 하는 경우가 있다.
시안은 1920px 하나뿐이고 SearchBox는 입력창 480px + 간격 16px + 상세검색 버튼 72px이다.

## 선택지
- 검색어 관리
  - A안 페이지가 관리(`value`, `onValueChange`): URL 동기화·초기화가 페이지 한 곳에서 끝남 / 쓰는 쪽에 상태 하나 필요
  - B안 SearchBox 안에서 관리, Enter 때 `onSubmit(query)`만 알림: 쓰기 간단 / 밖에서 검색어를 바꾸려면 `key` 재생성 같은 추가 장치 필요
- 좁은 화면
  - A안 한 줄 유지, 입력창만 줄임(최대 480px): 시안 구조 그대로 / 375px에서 입력창 약 255px
  - B안 상세검색 버튼을 아래 줄로: 입력창이 넓음 / 헤더와 합치면 위쪽이 길어짐

## 결정
검색어는 A안, 좁은 화면도 A안. (사용자 선택)
Enter 검색은 입력창의 키 입력이 아니라 `<form>` 제출로 받는다. 키 입력으로 Enter를 직접 감지하면 한글 조합 중 Enter에서 검색이 두 번 실행되는 문제가 있다.

## 결과
- `<SearchBox value={query} onValueChange={setQuery} onSubmit={search} onDetailSearchClick={openPopup} />`
- 한글 조합 중 Enter 동작은 브라우저 테스트에서 실제 키 입력으로 확인해야 한다.
