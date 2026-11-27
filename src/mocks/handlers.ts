import { delay, http, HttpResponse } from 'msw';

import { KAKAO_BOOK_SEARCH_URL } from '@/api/kakaoBook';

import { EMPTY_RESPONSE, FIXTURE_QUERY, getSearchFixture } from './searchFixture';

export const ERROR_QUERY = '에러';
export const SLOW_QUERY = '느린 검색';
export const NEXT_PAGE_ERROR_QUERY = '다음 페이지 에러';
const SLOW_DELAY_MS = 3000;

// 실제 카카오 API로 확인한 동작: target은 대소문자를 가리지 않고, 허용되지 않은 값은 에러 없이 무시하고 전체 검색을 한다.
const KAKAO_TARGETS = new Set(['title', 'person', 'publisher']);

export const handlers = [
  http.get(KAKAO_BOOK_SEARCH_URL, async ({ request }) => {
    const params = new URL(request.url).searchParams;
    const query = params.get('query') ?? '';
    const target = params.get('target')?.toLowerCase();
    const page = Number(params.get('page') ?? '1');

    if (query === ERROR_QUERY || (query === NEXT_PAGE_ERROR_QUERY && page > 1)) {
      await delay();
      return HttpResponse.json(
        { errorType: 'InternalServerError', message: 'mocked server error' },
        { status: 500 },
      );
    }

    await delay(query === SLOW_QUERY ? SLOW_DELAY_MS : undefined);

    // 상세 검색(target 지정) 응답은 아직 저장하지 않았다.
    if (target && KAKAO_TARGETS.has(target)) return HttpResponse.json(EMPTY_RESPONSE);

    const fixtureQuery =
      query === SLOW_QUERY || query === NEXT_PAGE_ERROR_QUERY ? FIXTURE_QUERY : query;
    return HttpResponse.json(getSearchFixture(fixtureQuery, page));
  }),
];
