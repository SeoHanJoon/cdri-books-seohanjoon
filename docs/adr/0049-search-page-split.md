# 0049. 도서 검색 페이지를 입력 훅, 결과 컴포넌트, 목록 끝 컴포넌트로 나눈다

- 상태: 채택
- 날짜: 2026-11-27
- 관련 Step: Step 5, Step 8

## 배경
API를 연결하고 나니 `SearchPage` 한 컴포넌트가 네 가지 일을 맡았다. URL ↔ 입력창 동기화(state 3개), 검색 요청과 상태 판단, 불러오는 동안 건수 유지, 무한 스크롤과 4가지 상태(로딩·에러·빈 결과·목록) 그리기다. 그리기는 삼항 연산자가 세 겹으로 겹쳐 있었다.

## 선택지
- A안 훅 1 + 컴포넌트 2: `useSearchInput`(URL 해석·입력창·검색), `SearchResults`(요청·건수·상태별 화면), `LoadMoreFooter`(감지 요소·다음 page 스켈레톤·다시 시도) / 파일 2개 증가
- B안 `SearchResults`만 분리: 변경 작음 / 입력창 동기화는 페이지에 남고, Step 8 찜 목록에서 무한 스크롤 부분을 다시 나눠야 함
- C안 파일 안 정리만: 겹친 삼항 연산자를 early return으로 / 한 컴포넌트가 네 가지 일을 맡는 것은 그대로

## 결정
A안. (사용자 선택)
- `SearchPage`는 입력과 화면 배치만 맡는다. 잘못된 `target`이면 `SearchResults`를 그리지 않으므로 요청도 나가지 않는다.
- `SearchResults`는 `useBookSearch`를 직접 부른다. 첫 page를 불러오는 중인지는 `!data && isFetching`으로 판단한다. 검색 조건이 없을 때는 `skipToken`이라 요청 중이 아니므로 따로 확인하지 않는다.
- `LoadMoreFooter`(`hasNextPage`, `isLoading`, `isError`, `onLoadMore`)는 다음 page를 불러오는 중이면 스켈레톤, 실패하면 다시 시도, 더 있으면 감지 요소를 그린다.

## 결과
- 페이지 컴포넌트가 25줄 안팎이 되고, 각 부분을 따로 읽을 수 있다.
- Step 8 찜 목록의 10개 단위 무한 스크롤에서 `LoadMoreFooter`를 그대로 쓴다.
