import type { KakaoBookSearchResponse } from '@/api/kakaoBook';

import searchEmpty from './fixtures/search-empty.json';
import searchMurakami1 from './fixtures/search-murakami-1.json';
import searchMurakami2 from './fixtures/search-murakami-2.json';
import searchMurakami3 from './fixtures/search-murakami-3.json';

export const EMPTY_RESPONSE: KakaoBookSearchResponse = searchEmpty;

export const FIXTURE_QUERY = '무라카미 하루키';

const FIXTURE_PAGES = new Map<string, KakaoBookSearchResponse[]>([
  [FIXTURE_QUERY, [searchMurakami1, searchMurakami2, searchMurakami3]],
]);

export function getSearchFixture(query: string, page = 1): KakaoBookSearchResponse {
  const pages = FIXTURE_PAGES.get(query.trim());
  const response = pages?.[page - 1];
  if (!pages || !response) return EMPTY_RESPONSE;
  // 실제 응답은 3페이지도 is_end가 false다.
  if (page === pages.length) return { ...response, meta: { ...response.meta, is_end: true } };
  return response;
}
