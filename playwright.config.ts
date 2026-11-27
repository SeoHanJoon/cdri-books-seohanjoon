import { defineConfig, devices } from '@playwright/test';

// 개발 서버(5173)와 다른 포트를 기본값으로 둔다. 평소 띄워 둔 개발 서버를 e2e가 재사용하지 않게 하기 위해서다.
const port = Number(process.env.E2E_PORT ?? 5183);
const baseURL = `http://localhost:${port}`;

// 녹화 모드: 영상을 recordings/<테스트 이름>-chromium/video.webm으로 남긴다.
const isRecording = process.env.E2E_RECORD === '1';

export default defineConfig({
  testDir: './e2e',
  // Playwright는 실행 전에 이 폴더를 비운다. 녹화 모드에서는 이전 영상이 지워진다.
  outputDir: isRecording ? './recordings' : './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: isRecording ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    locale: 'ko-KR',
    trace: 'on-first-retry',
    video: isRecording
      ? {
          mode: 'on',
          // 영상 용량을 줄이려고 화면을 축소해 저장한다.
          size: { width: 1280, height: 720 },
          // 영상 위에 테스트 이름과 동작(클릭·입력)을 표시해 보는 사람이 흐름을 따라가기 쉽게 한다.
          show: { test: { position: 'top-left' }, actions: { position: 'top-right' } },
        }
      : 'off',
    // 녹화할 때는 동작 사이를 천천히 진행해 사람이 영상을 따라갈 수 있게 한다.
    launchOptions: { slowMo: isRecording ? 500 : 0 },
  },
  projects: [
    {
      name: 'chromium',
      // Figma 시안 프레임이 1920×1080이다. devices의 기본 viewport를 덮어쓴다.
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
    },
  ],
  webServer: {
    command: `pnpm dev --port ${port} --strictPort`,
    url: baseURL,
    // 카카오 API 대신 MSW가 fixture로 응답한다. 키 없이 항상 같은 데이터로 실행된다.
    env: { VITE_API_MOCKING: 'enabled' },
    // CI에서는 항상 새로 띄운다. 다른 코드로 떠 있는 서버를 재사용하지 않기 위해서다.
    reuseExistingServer: !process.env.CI,
  },
});
