import { describe, expect, it } from 'vitest';

import { FIXTURE_QUERY, getSearchFixture } from './searchFixture';

describe('getSearchFixture', () => {
  it('fixture에 있는 검색어는 page마다 10권씩 준다', () => {
    for (const page of [1, 2, 3]) {
      expect(getSearchFixture(FIXTURE_QUERY, page).documents).toHaveLength(10);
    }
  });

  it('저장한 마지막 page에서만 is_end가 true다', () => {
    expect(getSearchFixture(FIXTURE_QUERY, 1).meta.is_end).toBe(false);
    expect(getSearchFixture(FIXTURE_QUERY, 2).meta.is_end).toBe(false);
    expect(getSearchFixture(FIXTURE_QUERY, 3).meta.is_end).toBe(true);
  });

  it('page를 주지 않으면 1페이지를 준다', () => {
    expect(getSearchFixture(FIXTURE_QUERY)).toBe(getSearchFixture(FIXTURE_QUERY, 1));
  });

  it('앞뒤 공백은 무시한다', () => {
    expect(getSearchFixture(`  ${FIXTURE_QUERY} `)).toBe(getSearchFixture(FIXTURE_QUERY));
  });

  it('fixture에 없는 검색어는 0건 응답을 준다', () => {
    const response = getSearchFixture('없는 책');
    expect(response.documents).toEqual([]);
    expect(response.meta.total_count).toBe(0);
  });

  it('모든 page의 책은 서로 다른 isbn을 가진다', () => {
    const isbns = [1, 2, 3].flatMap((page) =>
      getSearchFixture(FIXTURE_QUERY, page).documents.map((document) => document.isbn),
    );
    expect(new Set(isbns).size).toBe(30);
  });
});
