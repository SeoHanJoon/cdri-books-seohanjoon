import { useMemo } from 'react';

import { useWishlistStore } from '@/stores/wishlistStore';

export function useWishlist() {
  const books = useWishlistStore((state) => state.books);
  const toggle = useWishlistStore((state) => state.toggle);
  const likedIsbns = useMemo(() => new Set(books.map((book) => book.isbn)), [books]);

  return { isLiked: (isbn: string) => likedIsbns.has(isbn), toggle };
}
