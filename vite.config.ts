import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { msw } from 'msw/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // 개발 서버에서 MSW worker 파일을 제공한다. 앱이 `virtual:msw`를 쓰지 않으므로 빌드 결과에는 넣지 않는다.
  plugins: [react(), tailwindcss(), msw()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'node',
    setupFiles: ['src/mocks/setupTests.ts'],
    passWithNoTests: true,
  },
});
