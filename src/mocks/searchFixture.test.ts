import { describe, expect, it } from 'vitest';

import { FIXTURE_QUERY, getSearchFixture } from './searchFixture';

describe('getSearchFixture', () => {
  it('빈 검색어는 검색하지 않은 것으로 보고 null을 준다', () => {
    expect(getSearchFixture('')).toBeNull();
    expect(getSearchFixture('   ')).toBeNull();
  });

  it('fixture에 있는 검색어는 결과를 준다', () => {
    const response = getSearchFixture(FIXTURE_QUERY);
    expect(response?.documents).toHaveLength(10);
    expect(response?.meta.total_count).toBeGreaterThan(10);
  });

  it('앞뒤 공백은 무시한다', () => {
    expect(getSearchFixture(`  ${FIXTURE_QUERY} `)).toBe(getSearchFixture(FIXTURE_QUERY));
  });

  it('fixture에 없는 검색어는 0건 응답을 준다', () => {
    const response = getSearchFixture('없는 책');
    expect(response?.documents).toEqual([]);
    expect(response?.meta.total_count).toBe(0);
  });

  it('fixture의 책은 서로 다른 isbn을 가진다', () => {
    const isbns = getSearchFixture(FIXTURE_QUERY)?.documents.map((document) => document.isbn);
    expect(new Set(isbns).size).toBe(isbns?.length);
  });
});
