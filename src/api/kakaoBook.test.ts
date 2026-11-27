import { describe, expect, it } from 'vitest';

import { type KakaoBookDocument, toBook } from './kakaoBook';

const DOCUMENT: KakaoBookDocument = {
  title: '노르웨이의 숲',
  contents: '책 소개',
  url: 'https://search.daum.net/search?w=bookpage&bookId=1',
  isbn: '8937434482 9788937434488',
  datetime: '2013-09-02T00:00:00.000+09:00',
  authors: ['무라카미 하루키'],
  publisher: '민음사',
  translators: ['양억관'],
  price: 17000,
  sale_price: 15300,
  thumbnail: 'https://search1.kakaocdn.net/thumb/1',
  status: '정상판매',
};

describe('toBook', () => {
  it('화면에 필요한 값만 옮긴다', () => {
    expect(toBook(DOCUMENT)).toEqual({
      isbn: '9788937434488',
      title: '노르웨이의 숲',
      authors: ['무라카미 하루키'],
      thumbnail: 'https://search1.kakaocdn.net/thumb/1',
      price: 17000,
      salePrice: 15300,
      url: 'https://search.daum.net/search?w=bookpage&bookId=1',
      contents: '책 소개',
    });
  });

  it('할인가가 -1이면 null로 바꾼다', () => {
    expect(toBook({ ...DOCUMENT, sale_price: -1 }).salePrice).toBeNull();
  });

  it('할인가가 0원이면 할인가로 유지한다', () => {
    expect(toBook({ ...DOCUMENT, sale_price: 0 }).salePrice).toBe(0);
  });

  describe('isbn', () => {
    it('13자리가 10자리보다 앞에 있어도 13자리를 고른다', () => {
      expect(toBook({ ...DOCUMENT, isbn: '9788937434488 8937434482' }).isbn).toBe('9788937434488');
    });

    it('10자리만 있으면 10자리를 쓴다', () => {
      expect(toBook({ ...DOCUMENT, isbn: '8937434482 ' }).isbn).toBe('8937434482');
    });

    it('13자리만 있으면 13자리를 쓴다', () => {
      expect(toBook({ ...DOCUMENT, isbn: ' 9788937434488' }).isbn).toBe('9788937434488');
    });

    it('비어 있으면 url을 쓴다', () => {
      expect(toBook({ ...DOCUMENT, isbn: '' }).isbn).toBe(DOCUMENT.url);
    });
  });

  it('저자와 표지가 비어 있어도 그대로 옮긴다', () => {
    const book = toBook({ ...DOCUMENT, authors: [], thumbnail: '' });
    expect(book.authors).toEqual([]);
    expect(book.thumbnail).toBe('');
  });
});
