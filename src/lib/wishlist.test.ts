import { describe, expect, it } from 'vitest';

import { mergeShownBooks } from '@/lib/wishlist';
import type { Book } from '@/types/book';

function makeBook(isbn: string): Book {
  return {
    isbn,
    title: `책 ${isbn}`,
    authors: ['저자'],
    thumbnail: '',
    price: 10000,
    salePrice: null,
    url: `https://example.com/${isbn}`,
    contents: '',
  };
}

function isbnsOf(books: Book[]) {
  return books.map((book) => book.isbn);
}

const a = makeBook('a');
const b = makeBook('b');
const c = makeBook('c');

describe('찜 페이지에 보여줄 목록', () => {
  it('찜을 해제한 책도 보여준 자리에 그대로 남긴다', () => {
    expect(isbnsOf(mergeShownBooks([a, b, c], [a, c]))).toEqual(['a', 'b', 'c']);
  });

  it('모두 해제해도 보여준 책은 남긴다', () => {
    expect(isbnsOf(mergeShownBooks([a, b], []))).toEqual(['a', 'b']);
  });

  it('해제했다가 다시 찜해도 자리가 바뀌지 않는다', () => {
    expect(isbnsOf(mergeShownBooks([a, b, c], [b, a, c]))).toEqual(['a', 'b', 'c']);
  });

  it('새로 찜한 책은 맨 위에 더한다', () => {
    expect(isbnsOf(mergeShownBooks([b, c], [a, b, c]))).toEqual(['a', 'b', 'c']);
  });

  it('새로 찜한 책이 여러 권이면 찜 목록 순서대로 맨 위에 더한다', () => {
    expect(isbnsOf(mergeShownBooks([c], [a, b, c]))).toEqual(['a', 'b', 'c']);
  });

  it('더할 책이 없으면 받은 배열을 그대로 돌려준다', () => {
    const shown = [a, b];
    expect(mergeShownBooks(shown, [a])).toBe(shown);
  });
});
