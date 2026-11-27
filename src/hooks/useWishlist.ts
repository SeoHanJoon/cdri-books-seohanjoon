import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useWishlistStore } from '@/stores/wishlistStore';

export function useWishlist() {
  const { books, toggle } = useWishlistStore(
    useShallow((state) => ({ books: state.books, toggle: state.toggle })),
  );
  const likedIsbns = useMemo(() => new Set(books.map((book) => book.isbn)), [books]);

  return { books, isLiked: (isbn: string) => likedIsbns.has(isbn), toggle };
}
