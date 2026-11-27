# 0022. 공통 컴포넌트는 개발용 /dev/elements 화면에서 확인한다

- 상태: 채택
- 날짜: 2026-11-27
- 관련 Step: Step 2

## 배경
Step 2에서는 공통 컴포넌트만 만들고, 이 컴포넌트를 쓰는 화면은 Step 3부터 생긴다.
그래도 Figma Elements(`754:70`)와 비교하고, Playwright 테스트와 PR 영상([0006](0006-step-branch-pr-videos.md))을 만들 화면이 필요하다.

## 선택지
- A안 개발 모드 전용 `/dev/elements` 라우트: 설정이 거의 없음, Elements 프레임과 같은 배치로 비교 / 운영 빌드에서 빼는 처리 필요
- B안 Storybook: 표준 컴포넌트 미리보기 도구 / 이 과제 규모에는 설정과 의존성이 과함
- C안 Step 3에서 확인: 추가 작업 없음 / Step 2 PR에 화면 근거가 없음

## 결정
A안. `import.meta.env.DEV`일 때만 라우트를 등록해 운영 빌드에는 들어가지 않게 한다.

## 결과
- Step 2 PR에서 Figma Elements와 화면을 나란히 비교할 수 있다.
- 컴포넌트에 변형(할인가 유무, 찜 여부 등)이 생기면 이 화면에도 추가한다.
