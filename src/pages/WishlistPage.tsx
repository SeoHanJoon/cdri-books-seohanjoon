import { toBook } from '@/api/kakaoBook';
import { BookList } from '@/components/BookList';
import { NoData } from '@/components/NoData';
import { SearchCountText } from '@/components/SearchCountText';
import { FIXTURE_QUERY, getSearchFixture } from '@/mocks/searchFixture';

const books = getSearchFixture(FIXTURE_QUERY)?.documents.map(toBook) ?? [];
const isLiked = () => false;
const ignoreToggleLike = () => {};

export function WishlistPage() {
  return (
    <div className="pt-10 pb-40 md:pt-26">
      <h1 className="text-title2 text-text-primary">내가 찜한 책</h1>
      <div className="mt-5">
        <SearchCountText label="찜한 책" count={books.length} />
      </div>
      {books.length > 0 ? (
        <div className="mt-8">
          <BookList books={books} isLiked={isLiked} onToggleLike={ignoreToggleLike} />
        </div>
      ) : (
        <div className="mt-30">
          <NoData message="찜한 책이 없습니다." />
        </div>
      )}
    </div>
  );
}
