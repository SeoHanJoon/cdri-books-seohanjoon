import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import { Button } from '@/components/Button';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { HeartIcon } from '@/components/icons/HeartIcon';
import { formatPrice, getFinalPrice } from '@/lib/price';
import type { Book } from '@/types/book';

export interface BookListItemProps {
  book: Book;
  liked: boolean;
  expanded: boolean;
  onToggleLike: () => void;
  onToggleDetail: () => void;
}

type ContentProps = Omit<BookListItemProps, 'expanded' | 'onToggleDetail'>;

function Cover({ thumbnail }: { thumbnail: string }) {
  return thumbnail ? (
    <img src={thumbnail} alt="" className="size-full object-cover" />
  ) : (
    <div className="size-full bg-ui-gray" />
  );
}

interface LikeButtonProps {
  liked: boolean;
  onToggleLike: () => void;
  size: 16 | 24;
  className: string;
}

function LikeButton({ liked, onToggleLike, size, className }: LikeButtonProps) {
  return (
    <button
      type="button"
      aria-label="찜하기"
      aria-pressed={liked}
      onClick={onToggleLike}
      className={clsx('absolute p-2', className)}
    >
      <HeartIcon size={size} filled={liked} />
    </button>
  );
}

function CollapsedContent({ book, liked, onToggleLike }: ContentProps) {
  return (
    <>
      <div className="col-span-2 flex min-w-0 gap-x-4 lg:flex-1 lg:items-center lg:gap-0">
        <div className="relative h-17 w-12 shrink-0 lg:mr-12">
          <Cover thumbnail={book.thumbnail} />
          <LikeButton
            liked={liked}
            onToggleLike={onToggleLike}
            size={16}
            className="-top-2 -right-2"
          />
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
      </div>

      <Button variant="primary" href={book.url} target="_blank" className="lg:w-28.75">
        구매하기
      </Button>
    </>
  );
}

interface PriceRowProps {
  label: string;
  className?: string;
  children: ReactNode;
}

function PriceRow({ label, className, children }: PriceRowProps) {
  return (
    <div className="flex h-6.5 items-center gap-2">
      <dt className="text-small text-text-subtitle">{label}</dt>
      <dd className={clsx('text-title3 text-text-primary', className)}>{children}</dd>
    </div>
  );
}

function ExpandedContent({ book, liked, onToggleLike }: ContentProps) {
  const hasSale = book.salePrice !== null;

  return (
    <>
      <div className="relative h-70 w-52.5 shrink-0 self-center lg:self-start">
        <Cover thumbnail={book.thumbnail} />
        <LikeButton liked={liked} onToggleLike={onToggleLike} size={24} className="top-0 right-0" />
      </div>

      <div className="flex flex-col lg:mt-5 lg:w-90">
        <div className="flex flex-wrap items-center gap-x-4">
          <h2 className="text-title3 leading-6.5 text-text-primary">{book.title}</h2>
          <p className="text-body2 leading-5.5 text-text-subtitle">{book.authors.join(', ')}</p>
        </div>
        <h3 className="mt-4 text-body2-bold leading-6.5 text-text-primary">책 소개</h3>
        <p className="mt-3 text-small leading-4 whitespace-pre-line text-text-primary">
          {book.contents}
        </p>
      </div>

      <div className="flex flex-col items-end gap-7 lg:ml-auto lg:self-end">
        <dl className="flex flex-col items-end gap-2 pr-1">
          {hasSale && (
            <PriceRow label="원가" className="font-demilight line-through">
              {formatPrice(book.price)}
            </PriceRow>
          )}
          <PriceRow label={hasSale ? '할인가' : '원가'}>
            {formatPrice(getFinalPrice(book))}
          </PriceRow>
        </dl>
        <Button variant="primary" href={book.url} target="_blank" className="w-full lg:w-60">
          구매하기
        </Button>
      </div>
    </>
  );
}

export function BookListItem({
  book,
  liked,
  expanded,
  onToggleLike,
  onToggleDetail,
}: BookListItemProps) {
  const Content = expanded ? ExpandedContent : CollapsedContent;

  return (
    <article
      className={clsx(
        'relative border-b border-divider py-4',
        expanded
          ? 'flex flex-col gap-6 lg:flex-row lg:gap-8 lg:pt-6 lg:pr-4 lg:pb-9.75 lg:pl-13.5'
          : 'grid grid-cols-2 gap-x-2 gap-y-3 lg:flex lg:h-25 lg:items-center lg:gap-0 lg:py-0 lg:pr-4 lg:pl-12',
      )}
    >
      <Button
        variant="secondary"
        onClick={onToggleDetail}
        aria-expanded={expanded}
        className={clsx(
          expanded
            ? 'w-28.75 self-end lg:absolute lg:top-6.5 lg:right-4'
            : 'order-last lg:ml-2 lg:w-28.75',
        )}
      >
        상세보기
        <ChevronIcon size={24} direction={expanded ? 'up' : 'down'} />
      </Button>
      <Content book={book} liked={liked} onToggleLike={onToggleLike} />
    </article>
  );
}
