import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
// Vitest도 이 설정을 그대로 쓴다. 별칭·플러그인을 앱과 테스트가 공유한다.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // tsconfig.app.json의 paths(`@/*`)를 그대로 쓴다. 별칭을 두 곳에 적지 않기 위해서다.
    tsconfigPaths: true,
  },
  test: {
    // 단위 테스트는 코드 옆 *.test.ts(x). e2e/*.spec.ts는 Playwright가 맡는다.
    include: ['src/**/*.test.{ts,tsx}'],
    // 화면과 분리된 로직만 테스트하므로 우선 node. DOM이 필요한 훅 테스트(Step 5)에서 jsdom을 추가한다.
    environment: 'node',
    // Step 1에는 테스트할 로직이 아직 없다.
    passWithNoTests: true,
  },
})
