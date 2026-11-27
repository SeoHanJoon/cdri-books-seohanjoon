import type { InfiniteData } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import type { KakaoBookSearchResponse } from '@/api/kakaoBook';
import { FIXTURE_QUERY, getSearchFixture } from '@/mocks/searchFixture';

import { bookKeys, getNextPage, selectBookSearchResult } from './useBookSearch';

const pagesOf = (...pages: KakaoBookSearchResponse[]): InfiniteData<KakaoBookSearchResponse> => ({
  pages,
  pageParams: pages.map((_, index) => index + 1),
});

describe('bookKeys', () => {
  it('검색 조건이 같으면 같은 key, 다르면 다른 key다', () => {
    expect(bookKeys.search({ query: '하루키' })).toEqual(bookKeys.search({ query: '하루키' }));
    expect(bookKeys.search({ query: '하루키' })).not.toEqual(
      bookKeys.search({ query: '하루키', target: 'person' }),
    );
  });

  it('모든 검색 key는 bookKeys.all로 시작한다', () => {
    expect(bookKeys.search({ query: '하루키' }).slice(0, bookKeys.all.length)).toEqual(
      bookKeys.all,
    );
  });
});

describe('getNextPage', () => {
  it('is_end가 false면 다음 page 번호를 준다', () => {
    expect(getNextPage(getSearchFixture(FIXTURE_QUERY, 1), 1)).toBe(2);
  });

  it('is_end가 true면 더 불러오지 않는다', () => {
    expect(getNextPage(getSearchFixture(FIXTURE_QUERY, 3), 3)).toBeUndefined();
  });
});

describe('selectBookSearchResult', () => {
  it('page를 순서대로 이어 붙이고 건수는 첫 page에서 읽는다', () => {
    const first = getSearchFixture(FIXTURE_QUERY, 1);
    const second = getSearchFixture(FIXTURE_QUERY, 2);

    const result = selectBookSearchResult(pagesOf(first, second));

    expect(result.books).toHaveLength(20);
    expect(result.books[10]?.title).toBe(second.documents[0]?.title);
    expect(result.totalCount).toBe(first.meta.total_count);
  });

  it('같은 isbn의 책이 다시 오면 처음 것만 남긴다', () => {
    const first = getSearchFixture(FIXTURE_QUERY, 1);
    const repeated = { ...first, documents: [first.documents[0]] };

    const result = selectBookSearchResult(pagesOf(first, repeated));

    expect(result.books).toHaveLength(10);
  });
});
