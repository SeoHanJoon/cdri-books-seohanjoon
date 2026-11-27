import { type InfiniteData, skipToken, useInfiniteQuery } from '@tanstack/react-query';

import { type KakaoBookSearchResponse, searchBooks, toBook } from '@/api/kakaoBook';
import type { Book } from '@/types/book';
import type { BookSearch } from '@/types/search';

export const bookKeys = {
  all: ['books'] as const,
  search: (search: BookSearch | null) => [...bookKeys.all, 'search', search] as const,
};

const FIRST_PAGE = 1;
const STALE_TIME_MS = 5 * 60 * 1000;

export function getNextPage(lastPage: KakaoBookSearchResponse, lastPageParam: number) {
  return lastPage.meta.is_end ? undefined : lastPageParam + 1;
}

export interface BookSearchResult {
  books: Book[];
  totalCount: number;
}

// 카카오는 같은 isbn의 책을 두 번 줄 때가 있다("무라카미 하루키" 866건 중 7건).
export function selectBookSearchResult(
  data: InfiniteData<KakaoBookSearchResponse>,
): BookSearchResult {
  const books = new Map<string, Book>();
  for (const document of data.pages.flatMap((page) => page.documents)) {
    const book = toBook(document);
    if (!books.has(book.isbn)) books.set(book.isbn, book);
  }
  return { books: [...books.values()], totalCount: data.pages[0]?.meta.total_count ?? 0 };
}

export function useBookSearch(search: BookSearch | null) {
  return useInfiniteQuery({
    queryKey: bookKeys.search(search),
    queryFn: search ? ({ pageParam, signal }) => searchBooks(search, pageParam, signal) : skipToken,
    initialPageParam: FIRST_PAGE,
    staleTime: STALE_TIME_MS,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => getNextPage(lastPage, lastPageParam),
    select: selectBookSearchResult,
  });
}
