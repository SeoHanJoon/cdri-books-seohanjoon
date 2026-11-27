# 0064. components 안을 ui·book·search·feedback으로 나누고, Header는 app으로 옮긴다

- 상태: 채택
- 날짜: 2026-11-28
- 관련 Step: Step 11

## 배경
`components/`에 파일 13개가 한 층에 있다. 디자인 기본 요소(Button, Select, 아이콘), 책 목록, 검색 입력, 안내 화면, 레이아웃(Header)이 섞여 있어 폴더만 보고는 묶음이 보이지 않는다. `SearchCountText`는 찜 페이지("찜한 책 총 N건")에서도 쓰는데 이름에 Search가 붙어 있다.

## 선택지
- A안 유지: 13개면 아직 찾을 만함 / 묶음이 안 보임
- B안 `components/` 안만 묶기: 바깥의 역할별 구조([0012](0012-folder-structure-by-role.md))는 그대로 / import 경로가 많이 바뀜
- C안 한 페이지만 쓰는 컴포넌트를 `pages/<페이지>/`로: 기능별 구조라 0012와 반대

## 결정
B안. (사용자 선택)
- `components/ui/`: Button, Select, `icons/` — 화면 내용과 무관한 디자인 기본 요소
- `components/book/`: BookList, BookListItem, BookListSkeleton, LoadMoreFooter — 책 목록과 그 끝
- `components/search/`: SearchBox, DetailSearch — 검색 입력
- `components/feedback/`: NoData, ErrorMessage, CountText — 결과 상태 안내. `SearchCountText`는 두 페이지가 쓰므로 `CountText`로 이름을 바꾼다
- Header는 RootLayout 한 곳에서만 쓰는 레이아웃이라 `app/`의 RootLayout 옆으로 옮긴다

## 결과
- 폴더 이름만 보고 컴포넌트의 역할을 알 수 있다. 0012의 "역할별" 원칙을 `components/` 안까지 이어 간다.
- 새 컴포넌트를 만들 때 어느 묶음에 넣을지 정해야 한다.
