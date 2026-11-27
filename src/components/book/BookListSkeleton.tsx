import { clsx } from 'clsx';

import { COLLAPSED_ROW } from '@/components/book/collapsedRowLayout';

function Bar({ className }: { className: string }) {
  return <div className={clsx('bg-light-gray', className)} />;
}

function SkeletonRow() {
  return (
    <div className={COLLAPSED_ROW.row}>
      <div className={COLLAPSED_ROW.main}>
        <Bar className={COLLAPSED_ROW.cover} />
        <div className={COLLAPSED_ROW.info}>
          <div className={COLLAPSED_ROW.titleAuthor}>
            <Bar className="h-4.5 w-40 rounded" />
            <Bar className="h-3.5 w-20 rounded" />
          </div>
          <div className={COLLAPSED_ROW.price}>
            <Bar className="h-4.5 w-20 rounded" />
          </div>
        </div>
      </div>
      <Bar className={clsx('h-12 rounded-lg', COLLAPSED_ROW.buyButton)} />
      <Bar className={clsx('h-12 rounded-lg', COLLAPSED_ROW.detailButton)} />
    </div>
  );
}

interface BookListSkeletonProps {
  count: number;
}

export function BookListSkeleton({ count }: BookListSkeletonProps) {
  return (
    <div role="status" className="motion-safe:animate-pulse">
      <span className="sr-only">불러오는 중입니다.</span>
      <div aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <SkeletonRow key={index} />
        ))}
      </div>
    </div>
  );
}
