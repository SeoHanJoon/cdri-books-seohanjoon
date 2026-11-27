import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/mocks/node';

import { KakaoApiError, kakaoGet } from './kakaoClient';

const URL_UNDER_TEST = 'https://dapi.kakao.com/test';

afterEach(() => vi.unstubAllEnvs());

describe('kakaoGet', () => {
  it('KakaoAK 키를 Authorization 헤더에 담아 보낸다', async () => {
    vi.stubEnv('VITE_KAKAO_REST_API_KEY', 'test-key');
    let authorization: string | null = null;
    server.use(
      http.get(URL_UNDER_TEST, ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json({});
      }),
    );

    await kakaoGet(URL_UNDER_TEST, new URLSearchParams());

    expect(authorization).toBe('KakaoAK test-key');
  });

  it('실패 응답은 상태 코드와 카카오 메시지를 담은 KakaoApiError로 던진다', async () => {
    server.use(
      http.get(URL_UNDER_TEST, () =>
        HttpResponse.json(
          { errorType: 'AccessDeniedError', message: 'wrong appKey' },
          { status: 401 },
        ),
      ),
    );

    const error = await kakaoGet(URL_UNDER_TEST, new URLSearchParams()).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(KakaoApiError);
    expect(error).toMatchObject({ status: 401, message: 'wrong appKey' });
  });

  it('실패 응답 본문이 JSON이 아니어도 상태 코드를 남긴다', async () => {
    server.use(http.get(URL_UNDER_TEST, () => new HttpResponse('Bad Gateway', { status: 502 })));

    await expect(kakaoGet(URL_UNDER_TEST, new URLSearchParams())).rejects.toMatchObject({
      status: 502,
    });
  });
});
