import { QueryClient } from '@tanstack/react-query';

import { KakaoApiError } from '@/api/kakaoClient';

const MAX_RETRIES = 1;

export function shouldRetry(failureCount: number, error: Error): boolean {
  if (error instanceof KakaoApiError && error.status < 500) return false;
  return failureCount < MAX_RETRIES;
}

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: shouldRetry } },
});
