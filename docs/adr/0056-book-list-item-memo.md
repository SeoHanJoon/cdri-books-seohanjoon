# 0056. BookListItem은 콜백 props를 책·isbn을 받는 함수로 바꾸고 memo로 감싼다

- 상태: 채택
- 날짜: 2026-11-27
- 관련 Step: Step 9

## 배경
검색창에 한 글자 칠 때마다 `SearchPage` → `SearchResults` → `BookList`가 다시 그려지고, 목록의 모든 `BookListItem`도 따라 그려진다. 무한 스크롤로 100권을 불러왔으면 한 글자에 100행이다.
`BookList`가 행마다 `onToggleLike={() => onToggleLike(book)}`처럼 새 함수를 넘겨서, `memo`만 씌우면 props가 늘 달라 효과가 없다.
책 객체는 안정적이다. TanStack Query가 `select` 결과에도 구조 공유를 적용해, 다음 페이지를 불러와도 기존 `Book` 객체를 그대로 쓴다.

## 선택지
- A안 콜백을 `onToggleLike(book)`, `onToggleDetail(isbn)`으로 바꾸고 `memo`: 의존성 없음, 바뀐 행만 다시 그림 / 공개 props가 바뀌어 쓰는 곳을 고쳐야 함
- B안 React Compiler 도입: 코드 그대로 / babel 플러그인 2개 추가, 빌드가 느려지고 행 하나만 바뀌어도 목록 전체가 다시 그려지는 문제는 남음
- C안 `memo`에 함수 props를 무시하는 비교 함수: 바뀌는 코드가 가장 적음 / 함수가 바뀌어도 옛 함수를 쓰는 버그가 숨을 수 있음

## 결정
A안. (사용자 선택)
- `BookListItem`은 `memo`로 감싸고, 받은 `book`·`book.isbn`을 넘겨 콜백을 부른다.
- `BookList`는 펼침 토글을 `useCallback`으로 고정하고, 찜 토글은 Zustand store의 함수(바뀌지 않음)를 그대로 넘긴다.
- 표지 `<img>`에 `loading="lazy"`를 붙여 화면 밖 표지는 스크롤해서 가까워질 때 받는다.

## 결과
- 입력·찜 토글·펼침 때 바뀐 행만 다시 그려진다.
- `BookListItem`의 콜백이 인자를 받게 되어, 쓰는 곳(`BookList`)이 함께 바뀐다.
