# 0011. 린트는 ESLint, TypeScript는 6.0을 쓴다

- 상태: 채택
- 날짜: 2026-11-27
- 관련 Step: Step 1

## 배경
최신 TypeScript는 7.0(Go로 다시 작성한 컴파일러)이고, Vite 공식 템플릿(create-vite 9.4)도 TS 7 + Oxlint(Rust 기반 린터)를 기본으로 만든다.
그런데 ESLint에서 TypeScript 코드를 검사하는 typescript-eslint(8.74)는 TypeScript `>=4.8.4 <6.1.0`까지만 지원한다. TS 7은 기존 JavaScript API를 제공하지 않기 때문이다.

## 선택지
- A안 ESLint + TS 6.0: 타입 정보를 쓰는 규칙(`recommendedTypeChecked`)과 react-hooks v7 규칙을 모두 사용, 평가자에게 익숙 / TS 7의 빠른 타입 검사를 못 씀
- B안 Oxlint + TS 7: 공식 템플릿 기본값, 매우 빠름 / 규칙 수가 적고 타입 기반 규칙은 별도 도구(tsrs) 필요
- C안 ESLint + TS 7(typecheck)·TS 6(lint) 함께: 둘의 장점 / TypeScript 두 버전을 설치하고 동작 차이를 관리해야 함

## 결정
A안. 이 규모의 앱에서는 타입 검사 속도 차이를 느끼기 어렵고, 놓친 `await`나 `any` 전파처럼 타입 정보가 있어야 잡히는 실수를 린트로 막는 쪽이 더 중요하다고 봤다.

## 결과
- `pnpm lint`가 ESLint(타입 기반 규칙 포함)와 Prettier 검사를 함께 실행한다.
- typescript-eslint가 TS 7을 지원하면 TypeScript만 올리면 된다.
