# 0054. 찜 연결은 useWishlist 훅 하나로, 테스트용 저장소는 stores 폴더에서 함께 쓴다

- 상태: 채택
- 날짜: 2026-11-27
- 관련 Step: Step 8

## 배경
도서 검색과 찜 페이지 모두 `BookList`에 `isLiked`, `onToggleLike`를 넘긴다. ([0035](0035-book-list-component.md))
찜 store를 연결하면 두 페이지가 "찜 목록 읽기 → isbn `Set` 만들기 → `isLiked`·토글 만들기"를 똑같이 쓰게 된다. ([0053](0053-wishlist-store-and-page.md))
또 검색 기록 store 테스트의 메모리 저장소(약 20줄, [0050](0050-search-history-store.md))가 찜 store 테스트에도 그대로 필요하다.

## 선택지
- 찜 연결
  - A안 `useWishlist()` 훅이 `{ isLiked, toggle }`을 돌려줌: 같은 코드가 한 곳, `Set` 규칙도 한 곳
  - B안 페이지마다 store를 직접 씀: 파일이 하나 적음 / 같은 4~5줄이 두 페이지에 반복
  - C안 `BookList`가 store를 직접 읽음: 페이지가 가장 짧음 / 0035를 바꿔야 하고, `BookList`가 store에 묶여 `/dev/elements`처럼 따로 쓰기 어려움
- 테스트용 저장소
  - A안 `src/stores/testStorage.ts`: 쓰는 테스트 옆, 새 폴더 없음
  - B안 `src/test/` 새 폴더: 테스트 도우미 전용 자리 / 역할별 폴더 구조([0012](0012-folder-structure-by-role.md))에 폴더 추가
  - C안 테스트마다 복사: 파일 하나만 보면 됨 / 같은 20줄이 두 곳

## 결정
둘 다 A안. (사용자 선택)
- `src/hooks/useWishlist.ts`가 store의 찜 목록으로 isbn `Set`을 만들어 `isLiked(isbn)`, `toggle(book)`을 돌려준다. 페이지는 이 둘을 `BookList`에 넘기기만 한다. 0035의 props는 그대로다.
- `src/stores/testStorage.ts`에 메모리 저장소와 전역 바꿔 끼우기를 두고, 검색 기록·찜 store 테스트가 같이 쓴다. 파일 이름으로 테스트 전용임을 드러낸다.

## 결과
- 찜 여부를 판단하는 규칙이 바뀌어도 훅 한 곳만 고친다.
- `BookList`는 계속 store를 모르고 props만 받는다.
- 테스트 도우미는 운영 코드에서 import하지 않으므로 운영 빌드에 들어가지 않는다.
