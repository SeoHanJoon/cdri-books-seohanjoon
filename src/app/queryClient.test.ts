import { describe, expect, it } from 'vitest';

import { KakaoApiError } from '@/api/kakaoClient';

import { shouldRetry } from './queryClient';

describe('shouldRetry', () => {
  it('4xx 응답은 다시 시도하지 않는다', () => {
    expect(shouldRetry(0, new KakaoApiError(400, 'bad request'))).toBe(false);
    expect(shouldRetry(0, new KakaoApiError(401, 'wrong appKey'))).toBe(false);
  });

  it('5xx 응답은 한 번만 다시 시도한다', () => {
    expect(shouldRetry(0, new KakaoApiError(500, 'server error'))).toBe(true);
    expect(shouldRetry(1, new KakaoApiError(500, 'server error'))).toBe(false);
  });

  it('네트워크 오류도 한 번만 다시 시도한다', () => {
    expect(shouldRetry(0, new TypeError('Failed to fetch'))).toBe(true);
    expect(shouldRetry(1, new TypeError('Failed to fetch'))).toBe(false);
  });
});
