import { describe, expect, it } from 'vitest';

import { KAKAO_BOOK_SEARCH_URL, type KakaoBookSearchResponse } from '@/api/kakaoBook';

import { ERROR_QUERY, NEXT_PAGE_ERROR_QUERY, SLOW_QUERY } from './handlers';
import { FIXTURE_QUERY, FIXTURE_TARGET } from './searchFixture';

async function request(params: Record<string, string>) {
  const response = await fetch(`${KAKAO_BOOK_SEARCH_URL}?${new URLSearchParams(params)}`);
  return { status: response.status, body: (await response.json()) as KakaoBookSearchResponse };
}

describe('카카오 책 검색 handler', () => {
  it('page에 맞는 fixture를 준다', async () => {
    const first = await request({ query: FIXTURE_QUERY, page: '1' });
    const second = await request({ query: FIXTURE_QUERY, page: '2' });

    expect(first.body.documents).toHaveLength(10);
    expect(second.body.documents[0]?.isbn).not.toBe(first.body.documents[0]?.isbn);
  });

  it('target이 있으면 그 target의 fixture를 준다', async () => {
    const { body } = await request({ query: FIXTURE_QUERY, target: FIXTURE_TARGET });

    expect(body.meta.total_count).toBe(780);
  });

  it('허용되지 않은 target은 카카오처럼 무시하고 전체 검색 결과를 준다', async () => {
    const { status, body } = await request({ query: FIXTURE_QUERY, target: 'foo' });

    expect(status).toBe(200);
    expect(body.meta.total_count).toBe(866);
  });

  it('target은 카카오처럼 대소문자를 가리지 않는다', async () => {
    const { body } = await request({ query: FIXTURE_QUERY, target: FIXTURE_TARGET.toUpperCase() });

    expect(body.meta.total_count).toBe(780);
  });

  it(`"${ERROR_QUERY}" 검색어는 500 에러를 준다`, async () => {
    const { status } = await request({ query: ERROR_QUERY });

    expect(status).toBe(500);
  });

  it(`"${SLOW_QUERY}" 검색어는 결과를 준다`, async () => {
    const { body } = await request({ query: SLOW_QUERY });

    expect(body.documents).toHaveLength(10);
  }, 5000);

  it(`"${NEXT_PAGE_ERROR_QUERY}" 검색어는 1페이지만 주고 그 뒤로는 500 에러를 준다`, async () => {
    const first = await request({ query: NEXT_PAGE_ERROR_QUERY, page: '1' });
    const second = await request({ query: NEXT_PAGE_ERROR_QUERY, page: '2' });

    expect(first.body.documents).toHaveLength(10);
    expect(second.status).toBe(500);
  });
});
