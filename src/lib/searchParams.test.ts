import { describe, expect, it } from 'vitest';

import { isSearchTarget, parseSearchParams, toSearchParams } from './searchParams';

const parse = (search: string) => parseSearchParams(new URLSearchParams(search));

describe('isSearchTarget', () => {
  it('제목, 저자명, 출판사만 허용한다', () => {
    expect(['title', 'person', 'publisher'].every(isSearchTarget)).toBe(true);
    expect(isSearchTarget('foo')).toBe(false);
    expect(isSearchTarget('')).toBe(false);
  });

  it('대소문자가 다르면 허용하지 않는다', () => {
    expect(isSearchTarget('TITLE')).toBe(false);
  });

  it('Object의 기본 속성 이름은 허용하지 않는다', () => {
    expect(isSearchTarget('toString')).toBe(false);
    expect(isSearchTarget('constructor')).toBe(false);
  });
});

describe('parseSearchParams', () => {
  it('검색어가 없으면 검색하지 않은 상태다', () => {
    expect(parse('')).toEqual({ status: 'idle' });
    expect(parse('?query=')).toEqual({ status: 'idle' });
    expect(parse('?query=%20%20')).toEqual({ status: 'idle' });
  });

  it('검색어만 있으면 전체 검색이다', () => {
    expect(parse('?query=하루키')).toEqual({ status: 'ready', search: { query: '하루키' } });
  });

  it('검색어 앞뒤 공백을 지운다', () => {
    expect(parse('?query=%20하루키%20')).toEqual({ status: 'ready', search: { query: '하루키' } });
  });

  it('허용된 target이 있으면 상세 검색이다', () => {
    expect(parse('?query=하루키&target=person')).toEqual({
      status: 'ready',
      search: { query: '하루키', target: 'person' },
    });
  });

  it('허용되지 않은 target은 검색어가 있든 없든 잘못된 요청이다', () => {
    expect(parse('?query=하루키&target=foo')).toEqual({ status: 'invalid' });
    expect(parse('?target=foo')).toEqual({ status: 'invalid' });
    expect(parse('?query=하루키&target=')).toEqual({ status: 'invalid' });
  });
});

describe('toSearchParams', () => {
  it('전체 검색은 query만 담는다', () => {
    expect(toSearchParams({ query: '하루키' }).toString()).toBe(
      new URLSearchParams({ query: '하루키' }).toString(),
    );
  });

  it('상세 검색은 target도 담는다', () => {
    expect(toSearchParams({ query: '하루키', target: 'publisher' }).get('target')).toBe(
      'publisher',
    );
  });

  it('parseSearchParams로 다시 읽으면 같은 검색이 된다', () => {
    const search = { query: '무라카미 하루키', target: 'title' } as const;
    expect(parseSearchParams(toSearchParams(search))).toEqual({ status: 'ready', search });
  });
});
