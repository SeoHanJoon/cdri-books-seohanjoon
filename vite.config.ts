import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // tsconfig.app.json의 paths(`@/*`)를 그대로 쓴다. 별칭을 두 곳에 적지 않기 위해서다.
    tsconfigPaths: true,
  },
  test: {
    // e2e/*.spec.ts는 Playwright가 실행하므로 제외한다.
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'node',
    passWithNoTests: true,
  },
})
