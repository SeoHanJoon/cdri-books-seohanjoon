import { useState } from 'react';

import { BOOK_PAGE_SIZE } from '@/api/kakaoBook';
import { BookList } from '@/components/BookList';
import { BookListSkeleton } from '@/components/BookListSkeleton';
import { DetailSearch } from '@/components/DetailSearch';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadMoreFooter } from '@/components/LoadMoreFooter';
import { NoData } from '@/components/NoData';
import { SearchBox } from '@/components/SearchBox';
import { SearchCountText } from '@/components/SearchCountText';
import { useBookSearch } from '@/hooks/useBookSearch';
import { useSearchInput } from '@/hooks/useSearchInput';
import { toSearchParams } from '@/lib/searchParams';
import { NotFoundPage } from '@/pages/NotFoundPage';
import type { BookSearch, DetailSearchCondition } from '@/types/search';

const isLiked = () => false;
const ignoreToggleLike = () => {};
const NO_HISTORY: string[] = [];
const ignoreHistory = () => {};
const EMPTY_DETAIL_SEARCH: DetailSearchCondition = { target: 'title', keyword: '' };
const ignoreDetailSearch = () => {};

interface SearchResultsProps {
  search: BookSearch | null;
}

function SearchResults({ search }: SearchResultsProps) {
  const {
    data,
    isFetching,
    isError,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
    refetch,
  } = useBookSearch(search);
  const isLoadingFirstPage = !data && isFetching;

  const [shownCount, setShownCount] = useState(0);
  const currentCount = isLoadingFirstPage ? null : (data?.totalCount ?? 0);
  if (currentCount !== null && currentCount !== shownCount) setShownCount(currentCount);

  const renderList = () => {
    if (isLoadingFirstPage) {
      return (
        <div className="mt-8">
          <BookListSkeleton count={BOOK_PAGE_SIZE} />
        </div>
      );
    }
    if (!data && isError) {
      return (
        <div className="mt-30">
          <ErrorMessage message="검색 결과를 불러오지 못했습니다." onRetry={() => void refetch()} />
        </div>
      );
    }
    if (!data || data.books.length === 0) {
      return (
        <div className="mt-30">
          <NoData message="검색된 결과가 없습니다." />
        </div>
      );
    }
    return (
      <div className="mt-8">
        <BookList
          key={search ? toSearchParams(search).toString() : ''}
          books={data.books}
          isLiked={isLiked}
          onToggleLike={ignoreToggleLike}
        />
        <LoadMoreFooter
          hasNextPage={hasNextPage}
          isLoading={isFetchingNextPage}
          isError={isFetchNextPageError}
          onLoadMore={() => void fetchNextPage()}
        />
      </div>
    );
  };

  return (
    <>
      <div className="mt-6.25">
        <SearchCountText label="도서 검색 결과" count={currentCount ?? shownCount} />
      </div>
      {renderList()}
    </>
  );
}

export function SearchPage() {
  const { parsed, query, setQuery, submit } = useSearchInput();

  if (parsed.status === 'invalid') return <NotFoundPage />;

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
      <SearchResults search={parsed.status === 'ready' ? parsed.search : null} />
    </div>
  );
}
