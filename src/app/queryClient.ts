import { QueryClient } from '@tanstack/react-query';

import { KakaoApiError } from '@/api/kakaoClient';

const MAX_RETRIES = 1;

// 4xx는 요청 자체가 잘못된 것이라 다시 보내도 같은 결과다. 서버 오류와 네트워크 오류만 한 번 더 시도한다.
export function shouldRetry(failureCount: number, error: Error): boolean {
  if (error instanceof KakaoApiError && error.status < 500) return false;
  return failureCount < MAX_RETRIES;
}

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: shouldRetry } },
});
