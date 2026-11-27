import { BookListSkeleton } from '@/components/book/BookListSkeleton';
import { ErrorMessage } from '@/components/feedback/ErrorMessage';
import { useInView } from '@/hooks/useInView';

interface LoadMoreFooterProps {
  hasNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  onLoadMore: () => void;
}

export function LoadMoreFooter({
  hasNextPage,
  isLoading,
  isError,
  onLoadMore,
}: LoadMoreFooterProps) {
  const loadMoreRef = useInView(onLoadMore);

  if (isLoading) return <BookListSkeleton count={1} />;
  if (isError) {
    return (
      <div className="mt-8">
        <ErrorMessage message="다음 목록을 불러오지 못했습니다." onRetry={onLoadMore} />
      </div>
    );
  }
  if (!hasNextPage) return null;
  return <div ref={loadMoreRef} />;
}
