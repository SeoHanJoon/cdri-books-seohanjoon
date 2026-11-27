# 0020. 역할별 폴더 구조에 src/types/를 추가한다

- 상태: 채택
- 날짜: 2026-11-27
- 관련 Step: Step 2 이후 전체

## 배경
[0012](0012-folder-structure-by-role.md)에서 `src/`를 역할별(`app/`, `pages/`, `components/`, `hooks/`, `api/`, `stores/`, `lib/`, `mocks/`, `styles/`)로 나눴다.
화면용 `Book` 타입([0019](0019-book-view-type.md))은 컴포넌트, 변환 함수, 찜 store가 함께 쓰는데, 둘 곳이 없다.

## 선택지
- A안 `src/types/` 추가: 여러 곳이 같이 쓰는 타입을 찾기 쉬움 / 폴더 하나 증가
- B안 `src/lib/book.ts`: 기존 폴더 사용 / 함수 모음인 `lib`에 타입만 담은 파일이 섞임

## 결정
A안. 역할별 구조는 그대로 두고 `types/`(여러 역할이 같이 쓰는 타입)만 추가한다.
한 곳에서만 쓰는 타입(예: 카카오 응답 타입은 `api/`, 컴포넌트 props는 그 컴포넌트 파일)은 쓰는 곳 옆에 둔다.

## 결과
- 폴더 구조: `app/`, `pages/`, `components/`, `hooks/`, `api/`, `stores/`, `lib/`, `types/`, `mocks/`, `styles/`
