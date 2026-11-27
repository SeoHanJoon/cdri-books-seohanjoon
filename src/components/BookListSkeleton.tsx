import { clsx } from 'clsx';

function Bar({ className }: { className: string }) {
  return <div className={clsx('bg-light-gray', className)} />;
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-3 border-b border-divider py-4 lg:flex lg:h-25 lg:items-center lg:gap-0 lg:py-0 lg:pr-4 lg:pl-12">
      <div className="col-span-2 flex min-w-0 gap-x-4 lg:flex-1 lg:items-center lg:gap-0">
        <Bar className="h-17 w-12 shrink-0 lg:mr-12" />
        <div className="flex min-w-0 flex-1 flex-col gap-2 lg:flex-row lg:items-center lg:gap-0">
          <div className="flex min-w-0 flex-col gap-1 lg:flex-1 lg:flex-row lg:items-center lg:gap-4">
            <Bar className="h-4.5 w-40 rounded" />
            <Bar className="h-3.5 w-20 rounded" />
          </div>
          <Bar className="h-4.5 w-20 rounded lg:mr-13 lg:ml-5.5" />
        </div>
      </div>
      <Bar className="h-12 rounded-lg lg:w-28.75" />
      <Bar className="h-12 rounded-lg lg:ml-2 lg:w-28.75" />
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
