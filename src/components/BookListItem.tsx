import { Button } from '@/components/Button';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { HeartIcon } from '@/components/icons/HeartIcon';
import { formatPrice, getFinalPrice } from '@/lib/price';
import type { Book } from '@/types/book';

export interface BookItemBaseProps {
  book: Book;
  liked: boolean;
  onToggleLike: () => void;
  onToggleDetail: () => void;
}

export function BookListItem({ book, liked, onToggleLike, onToggleDetail }: BookItemBaseProps) {
  return (
    <article className="flex flex-wrap gap-x-4 gap-y-3 border-b border-divider py-4 lg:h-25 lg:flex-nowrap lg:items-center lg:gap-0 lg:py-0 lg:pr-4 lg:pl-12">
      <div className="relative h-17 w-12 shrink-0 lg:mr-12">
        {book.thumbnail ? (
          <img src={book.thumbnail} alt="" className="size-full object-cover" />
        ) : (
          <div className="size-full bg-ui-gray" />
        )}
        <button
          type="button"
          aria-label="찜하기"
          aria-pressed={liked}
          onClick={onToggleLike}
          className="absolute -top-2 -right-2 p-2"
        >
          <HeartIcon size={16} filled={liked} />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 lg:flex-row lg:items-center lg:gap-0">
        <div className="flex min-w-0 flex-col gap-1 lg:flex-1 lg:flex-row lg:items-center lg:gap-4">
          <h2 className="truncate text-title3 text-text-primary">{book.title}</h2>
          <p className="truncate text-body2 text-text-secondary">{book.authors.join(', ')}</p>
        </div>
        <p className="shrink-0 text-title3 text-text-primary lg:ml-5.5 lg:w-33">
          {formatPrice(getFinalPrice(book))}
        </p>
      </div>

      <div className="flex w-full gap-2 lg:w-auto lg:shrink-0">
        <Button
          variant="primary"
          href={book.url}
          target="_blank"
          className="flex-1 lg:w-28.75 lg:flex-none"
        >
          구매하기
        </Button>
        <Button
          variant="secondary"
          onClick={onToggleDetail}
          aria-expanded={false}
          className="flex-1 lg:w-28.75 lg:flex-none"
        >
          상세보기
          <ChevronIcon size={24} />
        </Button>
      </div>
    </article>
  );
}
