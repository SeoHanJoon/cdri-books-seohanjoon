import { useState } from 'react';

import { BookList } from '@/components/book/BookList';
import { LoadMoreFooter } from '@/components/book/LoadMoreFooter';
import { CountText } from '@/components/feedback/CountText';
import { NoData } from '@/components/feedback/NoData';
import { usePagedList } from '@/hooks/usePagedList';
import { useWishlist } from '@/hooks/useWishlist';
import { mergeShownBooks } from '@/lib/wishlist';

const WISHLIST_PAGE_SIZE = 10;

export function WishlistPage() {
  const wishlist = useWishlist();

  const [shownBooks, setShownBooks] = useState(wishlist.books);
  const mergedBooks = mergeShownBooks(shownBooks, wishlist.books);
  if (mergedBooks !== shownBooks) setShownBooks(mergedBooks);

  const paged = usePagedList(mergedBooks, WISHLIST_PAGE_SIZE);

  return (
    <div className="pt-10 pb-40 md:pt-26">
      <h1 className="text-title2 text-text-primary">내가 찜한 책</h1>
      <div className="mt-5">
        <CountText label="찜한 책" count={wishlist.books.length} />
      </div>
      {mergedBooks.length > 0 ? (
        <div className="mt-8">
          <BookList
            books={paged.visibleItems}
            isLiked={wishlist.isLiked}
            onToggleLike={wishlist.toggle}
          />
          <LoadMoreFooter
            key={paged.visibleItems.length}
            hasNextPage={paged.hasMore}
            isLoading={false}
            isError={false}
            onLoadMore={paged.loadMore}
          />
        </div>
      ) : (
        <div className="mt-30">
          <NoData message="찜한 책이 없습니다." />
        </div>
      )}
    </div>
  );
}
