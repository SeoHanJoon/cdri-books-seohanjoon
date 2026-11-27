# 0019. 책 컴포넌트는 카카오 응답이 아닌 화면용 Book 타입을 받는다

- 상태: 일부 폐기 (props 모양 → 0032)
- 날짜: 2026-11-27
- 관련 Step: Step 2, Step 3, Step 8

## 배경
`BookListItem`(접힌 행)과 `BookListItemDetail`(펼친 행)은 검색 결과(카카오 API)와 찜 목록(저장해 둔 스냅샷) 양쪽에서 쓴다.
카카오 응답은 화면에 필요한 값과 형태가 다르다: 할인가가 없으면 `sale_price: -1`, `isbn`은 "10자리 13자리"를 공백으로 이은 문자열, 이름은 snake_case이고, 쓰지 않는 값(`datetime`, `publisher`, `translators`, `status`)도 있다.

## 선택지
- 데이터 타입
  - A안 화면용 `Book` 타입을 따로 두고 변환 함수 한 곳에서 바꿈: 컴포넌트·찜 저장이 카카오 형식을 모름 / 변환 코드 필요
  - B안 카카오 응답 타입을 그대로 사용: 코드가 짧음 / `sale_price < 0` 같은 카카오 규칙이 컴포넌트에 들어가고, 찜 목록이 카카오 형식으로 저장됨
- props 모양
  - A안 값마다 prop: 타입에 묶이지 않음 / props 10개 이상, 두 컴포넌트에 중복
  - B안 `book` 객체 하나 + 공통 props를 확장: 중복 없음

## 결정
데이터는 A안, props는 B안.
- 화면용 `Book`: `isbn`, `title`, `authors`, `thumbnail`, `price`, `salePrice: number | null`, `url`, `contents`
- 공통 props `BookItemBaseProps { book, liked, onToggleLike, onToggleDetail }`를 두 컴포넌트가 확장한다.
- 카카오 응답 타입은 `src/api/`(Step 5)에, `Book`은 `src/types/book.ts`에 둔다. ([0020](0020-folder-structure-types.md))

## 결과
- "할인가 없음"(-1 → `null`) 같은 카카오 규칙은 변환 함수 한 곳에만 있고, 단위 테스트로 지킨다.
- 카카오 API가 바뀌어도 변환 함수만 고치면 된다.
