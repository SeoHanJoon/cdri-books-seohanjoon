import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { BOOK_PAGE_SIZE } from '@/api/kakaoBook';
import { BookList } from '@/components/BookList';
import { BookListSkeleton } from '@/components/BookListSkeleton';
import { DetailSearch } from '@/components/DetailSearch';
import { ErrorMessage } from '@/components/ErrorMessage';
import { NoData } from '@/components/NoData';
import { SearchBox } from '@/components/SearchBox';
import { SearchCountText } from '@/components/SearchCountText';
import { useBookSearch } from '@/hooks/useBookSearch';
import { useInView } from '@/hooks/useInView';
import { parseSearchParams, toSearchParams } from '@/lib/searchParams';
import { NotFoundPage } from '@/pages/NotFoundPage';
import type { DetailSearchCondition } from '@/types/search';

const isLiked = () => false;
const ignoreToggleLike = () => {};
const NO_HISTORY: string[] = [];
const ignoreHistory = () => {};
const EMPTY_DETAIL_SEARCH: DetailSearchCondition = { target: 'title', keyword: '' };
const ignoreDetailSearch = () => {};

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parsed = parseSearchParams(searchParams);
  const search = parsed.status === 'ready' ? parsed.search : null;
  const urlQuery = search && !search.target ? search.query : '';

  const [query, setQuery] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  if (syncedQuery !== urlQuery) {
    setSyncedQuery(urlQuery);
    if (urlQuery === submittedQuery) setSubmittedQuery(null);
    else setQuery(urlQuery);
  }

  const {
    data,
    status,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
    refetch,
  } = useBookSearch(search);
  const isLoadingFirstPage =
    search !== null && (status === 'pending' || (status === 'error' && !data && isFetching));
  const isFirstPageError = status === 'error' && !data && !isFetching;

  const [shownCount, setShownCount] = useState(0);
  const currentCount = isLoadingFirstPage ? null : (data?.totalCount ?? 0);
  if (currentCount !== null && currentCount !== shownCount) setShownCount(currentCount);

  const loadMoreRef = useInView(() => void fetchNextPage());
  const canLoadMore = hasNextPage && !isFetchingNextPage && !isFetchNextPageError;

  if (parsed.status === 'invalid') return <NotFoundPage />;

  const submit = () => {
    const trimmed = query.trim();
    const next = trimmed === '' ? new URLSearchParams() : toSearchParams({ query: trimmed });
    if (next.toString() === searchParams.toString()) return;
    setSubmittedQuery(trimmed);
    setSearchParams(next);
  };

  const books = data?.books ?? [];

  return (
    <div className="pt-10 pb-40 md:pt-26">
      <SearchBox
        value={query}
        onValueChange={setQuery}
        onSubmit={submit}
        detailSearch={
          <DetailSearch defaultValue={EMPTY_DETAIL_SEARCH} onSubmit={ignoreDetailSearch} />
        }
        history={NO_HISTORY}
        onHistorySelect={ignoreHistory}
        onHistoryRemove={ignoreHistory}
      />
      <div className="mt-6.25">
        <SearchCountText label="도서 검색 결과" count={currentCount ?? shownCount} />
      </div>
      {isLoadingFirstPage ? (
        <div className="mt-8">
          <BookListSkeleton count={BOOK_PAGE_SIZE} />
        </div>
      ) : isFirstPageError ? (
        <div className="mt-30">
          <ErrorMessage message="검색 결과를 불러오지 못했습니다." onRetry={() => void refetch()} />
        </div>
      ) : books.length > 0 ? (
        <div className="mt-8">
          <BookList
            key={search ? toSearchParams(search).toString() : ''}
            books={books}
            isLiked={isLiked}
            onToggleLike={ignoreToggleLike}
          />
          {isFetchingNextPage && <BookListSkeleton count={1} />}
          {isFetchNextPageError && !isFetchingNextPage && (
            <div className="mt-8">
              <ErrorMessage
                message="다음 목록을 불러오지 못했습니다."
                onRetry={() => void fetchNextPage()}
              />
            </div>
          )}
          {canLoadMore && <div ref={loadMoreRef} />}
        </div>
      ) : (
        <div className="mt-30">
          <NoData message="검색된 결과가 없습니다." />
        </div>
      )}
    </div>
  );
}
