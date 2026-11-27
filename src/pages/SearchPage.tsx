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
  // 상세 검색 중에는 메인 입력창을 비운다. 두 검색은 동시에 할 수 없다.
  const urlQuery = search && !search.target ? search.query : '';

  const [query, setQuery] = useState(urlQuery);
  // 뒤로가기 등으로 URL의 검색어가 바뀌면 입력창도 따라간다. 렌더 중에 맞춰야 이전 글자가 한 번 그려지지 않는다.
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  // URL은 검색 직후가 아니라 조금 뒤에 바뀐다. 직접 검색한 결과로 바뀐 것이면 그 사이 입력한 글자를 덮어쓰지 않는다.
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
  // 첫 page 실패 뒤 다시 시도하는 동안에도 status는 error로 남는다.
  const isLoadingFirstPage =
    search !== null && (status === 'pending' || (status === 'error' && !data && isFetching));
  const isFirstPageError = status === 'error' && !data && !isFetching;

  // 새 결과가 오기 전까지는 직전에 보여준 건수를 그대로 둔다.
  const [shownCount, setShownCount] = useState(0);
  const currentCount = isLoadingFirstPage ? null : (data?.totalCount ?? 0);
  if (currentCount !== null && currentCount !== shownCount) setShownCount(currentCount);

  const loadMoreRef = useInView(() => void fetchNextPage());
  // 불러오는 중이나 실패한 뒤에는 감지 요소를 빼서 같은 page를 거듭 부르지 않는다.
  // 다시 그려질 때 새로 관찰하므로, 받은 page가 짧아 목록 끝이 계속 보여도 다음 page를 부른다.
  const canLoadMore = hasNextPage && !isFetchingNextPage && !isFetchNextPageError;

  if (parsed.status === 'invalid') return <NotFoundPage />;

  const submit = () => {
    const trimmed = query.trim();
    const next = trimmed === '' ? new URLSearchParams() : toSearchParams({ query: trimmed });
    // 같은 검색을 다시 하면 방문 기록을 쌓지 않는다.
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
