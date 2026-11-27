import { useState } from 'react';

import { BOOK_PAGE_SIZE } from '@/api/kakaoBook';
import { BookList } from '@/components/book/BookList';
import { BookListSkeleton } from '@/components/book/BookListSkeleton';
import { LoadMoreFooter } from '@/components/book/LoadMoreFooter';
import { CountText } from '@/components/feedback/CountText';
import { ErrorMessage } from '@/components/feedback/ErrorMessage';
import { NoData } from '@/components/feedback/NoData';
import { DetailSearch } from '@/components/search/DetailSearch';
import { SearchBox } from '@/components/search/SearchBox';
import { useBookSearch } from '@/hooks/useBookSearch';
import { useDetailSearch } from '@/hooks/useDetailSearch';
import { useMainSearch } from '@/hooks/useMainSearch';
import { useSearchUrl } from '@/hooks/useSearchUrl';
import { useWishlist } from '@/hooks/useWishlist';
import { toSearchParams } from '@/lib/searchParams';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useSearchHistoryStore } from '@/stores/searchHistoryStore';
import type { BookSearch } from '@/types/search';

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
  const wishlist = useWishlist();
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
          isLiked={wishlist.isLiked}
          onToggleLike={wishlist.toggle}
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
        <CountText label="도서 검색 결과" count={currentCount ?? shownCount} />
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
      <h1 className="text-title2 text-text-primary">도서 검색</h1>
      <div className="mt-7">
        <SearchBox
          value={main.query}
          onValueChange={main.setQuery}
          onSubmit={main.submit}
          detailSearch={
            <DetailSearch
              defaultValue={detail.defaultValue}
              onSubmit={(condition) => {
                main.clear();
                detail.submit(condition);
              }}
            />
          }
          history={history}
          onHistorySelect={main.searchKeyword}
          onHistoryRemove={removeHistory}
        />
      </div>
      <SearchResults search={url.parsed.status === 'ready' ? url.parsed.search : null} />
    </div>
  );
}
