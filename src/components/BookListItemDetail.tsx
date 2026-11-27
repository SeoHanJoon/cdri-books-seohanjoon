import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import type { BookItemBaseProps } from '@/components/BookListItem';
import { Button } from '@/components/Button';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { HeartIcon } from '@/components/icons/HeartIcon';
import { formatPrice, getFinalPrice } from '@/lib/price';

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

export function BookListItemDetail({
  book,
  liked,
  onToggleLike,
  onToggleDetail,
}: BookItemBaseProps) {
  const hasSale = book.salePrice !== null;

  return (
    <article className="relative flex flex-col gap-6 border-b border-divider py-4 lg:flex-row lg:gap-8 lg:pt-6 lg:pr-4 lg:pb-9.75 lg:pl-13.5">
      <Button
        variant="secondary"
        onClick={onToggleDetail}
        aria-expanded={true}
        className="w-28.75 self-end lg:absolute lg:top-6.5 lg:right-4"
      >
        상세보기
        <ChevronIcon size={24} direction="up" />
      </Button>

      <div className="relative h-70 w-52.5 shrink-0 self-center lg:self-start">
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
          className="absolute top-0 right-0 p-2"
        >
          <HeartIcon size={24} filled={liked} />
        </button>
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
    </article>
  );
}
