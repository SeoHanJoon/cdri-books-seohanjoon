import { useState } from 'react';

import { toBook } from '@/api/kakaoBook';
import { BookList } from '@/components/BookList';
import { DetailSearch } from '@/components/DetailSearch';
import { NoData } from '@/components/NoData';
import { SearchBox } from '@/components/SearchBox';
import { SearchCountText } from '@/components/SearchCountText';
import { getSearchFixture } from '@/mocks/searchFixture';
import type { DetailSearchCondition } from '@/types/search';

// 찜하기는 Step 8, 검색 기록은 Step 6, 상세 검색은 Step 7에서 연결한다.
const isLiked = () => false;
const ignoreToggleLike = () => {};
const NO_HISTORY: string[] = [];
const ignoreHistory = () => {};
const EMPTY_DETAIL_SEARCH: DetailSearchCondition = { target: 'title', keyword: '' };
const ignoreDetailSearch = () => {};

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const response = getSearchFixture(submittedQuery);
  const books = response?.documents.map(toBook) ?? [];

  return (
    <div className="pt-26 pb-40">
      <SearchBox
        value={query}
        onValueChange={setQuery}
        onSubmit={() => setSubmittedQuery(query)}
        detailSearch={
          <DetailSearch defaultValue={EMPTY_DETAIL_SEARCH} onSubmit={ignoreDetailSearch} />
        }
        history={NO_HISTORY}
        onHistorySelect={ignoreHistory}
        onHistoryRemove={ignoreHistory}
      />
      <div className="mt-6.25">
        <SearchCountText label="도서 검색 결과" count={response?.meta.total_count ?? 0} />
      </div>
      {books.length > 0 ? (
        <div className="mt-8">
          <BookList
            key={submittedQuery}
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
