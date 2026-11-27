import '@fontsource-variable/noto-sans-kr';
import '@/styles/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_API_MOCKING !== 'enabled') return;
  const { worker } = await import('@/mocks/browser');
  // 폰트·표지 이미지·Vite 모듈 요청은 모킹 대상이 아니라 그대로 보낸다.
  await worker.start({ onUnhandledFrame: 'bypass' });
}

void enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
