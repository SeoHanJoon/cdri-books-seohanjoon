import type { KakaoBookSearchResponse } from '@/api/kakaoBook';
import type { SearchTarget } from '@/types/search';

import searchEmpty from './fixtures/search-empty.json';
import searchMurakami1 from './fixtures/search-murakami-1.json';
import searchMurakami2 from './fixtures/search-murakami-2.json';
import searchMurakami3 from './fixtures/search-murakami-3.json';
import searchMurakamiPerson1 from './fixtures/search-murakami-person-1.json';

export const EMPTY_RESPONSE: KakaoBookSearchResponse = searchEmpty;

export const FIXTURE_QUERY = '무라카미 하루키';
export const FIXTURE_TARGET: SearchTarget = 'person';

function fixtureKey(query: string, target?: SearchTarget) {
  return `${target ?? ''}:${query.trim()}`;
}

const FIXTURE_PAGES = new Map<string, KakaoBookSearchResponse[]>([
  [fixtureKey(FIXTURE_QUERY), [searchMurakami1, searchMurakami2, searchMurakami3]],
  [fixtureKey(FIXTURE_QUERY, FIXTURE_TARGET), [searchMurakamiPerson1]],
]);

export function getSearchFixture(
  query: string,
  page = 1,
  target?: SearchTarget,
): KakaoBookSearchResponse {
  const pages = FIXTURE_PAGES.get(fixtureKey(query, target));
  const response = pages?.[page - 1];
  if (!pages || !response) return EMPTY_RESPONSE;
  if (page === pages.length) return { ...response, meta: { ...response.meta, is_end: true } };
  return response;
}
