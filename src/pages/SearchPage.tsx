import { useState } from 'react';

import { toBook } from '@/api/kakaoBook';
import { BookList } from '@/components/BookList';
import { NoData } from '@/components/NoData';
import { SearchBox } from '@/components/SearchBox';
import { SearchCountText } from '@/components/SearchCountText';
import { getSearchFixture } from '@/mocks/searchFixture';

// 찜하기는 Step 8, 검색 기록은 Step 6에서 store와 연결한다.
const isLiked = () => false;
const ignoreToggleLike = () => {};
const NO_HISTORY: string[] = [];
const ignoreHistory = () => {};

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
        onDetailSearchClick={() => {}}
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
