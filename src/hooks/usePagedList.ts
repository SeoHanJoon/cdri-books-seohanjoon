import { useState } from 'react';

export function usePagedList<T>(items: T[], pageSize: number) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  return {
    visibleItems: items.slice(0, visibleCount),
    hasMore: visibleCount < items.length,
    loadMore: () => setVisibleCount((count) => count + pageSize),
  };
}
