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
import { useDetailSearch } from '@/hooks/useDetailSearch';
import { useMainSearch } from '@/hooks/useMainSearch';
import { useSearchUrl } from '@/hooks/useSearchUrl';
import { toSearchParams } from '@/lib/searchParams';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useSearchHistoryStore } from '@/stores/searchHistoryStore';
import type { BookSearch } from '@/types/search';

const isLiked = () => false;
const ignoreToggleLike = () => {};

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
  const url = useSearchUrl();
  const main = useMainSearch(url);
  const detail = useDetailSearch(url);
  const history = useSearchHistoryStore((state) => state.keywords);
  const removeHistory = useSearchHistoryStore((state) => state.remove);

  if (url.parsed.status === 'invalid') return <NotFoundPage />;

  return (
    <div className="pt-10 pb-40 md:pt-26">
      <SearchBox
        value={main.query}
        onValueChange={main.setQuery}
        onSubmit={main.submit}
        detailSearch={
          <DetailSearch
            defaultValue={detail.defaultValue}
            onSubmit={(condition) => {
              // 같은 조건으로 다시 검색하면 URL이 그대로라 입력창 동기화가 일어나지 않는다.
              main.clear();
              detail.submit(condition);
            }}
          />
        }
        history={history}
        onHistorySelect={main.searchKeyword}
        onHistoryRemove={removeHistory}
      />
      <SearchResults search={url.parsed.status === 'ready' ? url.parsed.search : null} />
    </div>
  );
}
