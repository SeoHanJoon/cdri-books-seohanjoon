import type { Book } from '@/types/book';

export function mergeShownBooks(shown: Book[], current: Book[]): Book[] {
  const shownIsbns = new Set(shown.map((book) => book.isbn));
  const added = current.filter((book) => !shownIsbns.has(book.isbn));
  return added.length === 0 ? shown : [...added, ...shown];
}
