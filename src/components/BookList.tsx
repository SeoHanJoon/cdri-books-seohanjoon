import { useCallback, useState } from 'react';

import { BookListItem } from '@/components/BookListItem';
import type { Book } from '@/types/book';

interface BookListProps {
  books: Book[];
  isLiked: (isbn: string) => boolean;
  onToggleLike: (book: Book) => void;
}

export function BookList({ books, isLiked, onToggleLike }: BookListProps) {
  const [expandedIsbns, setExpandedIsbns] = useState<ReadonlySet<string>>(() => new Set());

  const toggleDetail = useCallback(
    (isbn: string) =>
      setExpandedIsbns((prev) => {
        const next = new Set(prev);
        if (!next.delete(isbn)) next.add(isbn);
        return next;
      }),
    [],
  );

  return (
    <ul>
      {books.map((book) => (
        <li key={book.isbn}>
          <BookListItem
            book={book}
            liked={isLiked(book.isbn)}
            expanded={expandedIsbns.has(book.isbn)}
            onToggleLike={onToggleLike}
            onToggleDetail={toggleDetail}
          />
        </li>
      ))}
    </ul>
  );
}
