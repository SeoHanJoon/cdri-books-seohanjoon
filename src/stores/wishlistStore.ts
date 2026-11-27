import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { syncAcrossTabs } from '@/stores/syncAcrossTabs';
import type { Book } from '@/types/book';

interface WishlistState {
  books: Book[];
  toggle: (book: Book) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      books: [],
      toggle: (book) =>
        set(({ books }) =>
          books.some((item) => item.isbn === book.isbn)
            ? { books: books.filter((item) => item.isbn !== book.isbn) }
            : { books: [book, ...books] },
        ),
    }),
    {
      name: 'cdri-books/wishlist',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ books }) => ({ books }),
    },
  ),
);

syncAcrossTabs(useWishlistStore);
