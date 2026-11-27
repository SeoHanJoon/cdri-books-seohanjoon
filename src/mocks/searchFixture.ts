import type { KakaoBookSearchResponse } from '@/api/kakaoBook';

import searchEmpty from './fixtures/search-empty.json';
import searchMurakami from './fixtures/search-murakami.json';

const EMPTY: KakaoBookSearchResponse = searchEmpty;

const FIXTURES = new Map<string, KakaoBookSearchResponse>([['무라카미 하루키', searchMurakami]]);

export const FIXTURE_QUERY = '무라카미 하루키';

export function getSearchFixture(query: string): KakaoBookSearchResponse | null {
  const keyword = query.trim();
  if (keyword === '') return null;
  return FIXTURES.get(keyword) ?? EMPTY;
}
