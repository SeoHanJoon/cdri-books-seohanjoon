import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { BookList } from '@/components/BookList';
import { DetailSearch } from '@/components/DetailSearch';
import { NoData } from '@/components/NoData';
import { SearchBox } from '@/components/SearchBox';
import { SearchCountText } from '@/components/SearchCountText';
import { useBookSearch } from '@/hooks/useBookSearch';
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
  if (syncedQuery !== urlQuery) {
    setSyncedQuery(urlQuery);
    setQuery(urlQuery);
  }

  const { data } = useBookSearch(search);

  if (parsed.status === 'invalid') return <NotFoundPage />;

  const submit = () => {
    const next = query.trim() === '' ? new URLSearchParams() : toSearchParams({ query });
    // 같은 검색을 다시 하면 방문 기록을 쌓지 않는다.
    if (next.toString() !== searchParams.toString()) setSearchParams(next);
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
        <SearchCountText label="도서 검색 결과" count={data?.totalCount ?? 0} />
      </div>
      {books.length > 0 ? (
        <div className="mt-8">
          <BookList
            key={search ? toSearchParams(search).toString() : ''}
            books={books}
            isLiked={isLiked}
            onToggleLike={ignoreToggleLike}
          />
        </div>
      ) : (
        <div className="mt-30">
          <NoData message="검색된 결과가 없습니다." />
        </div>
      )}
    </div>
  );
}
