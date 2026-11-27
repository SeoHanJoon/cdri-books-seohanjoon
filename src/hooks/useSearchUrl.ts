import { useSearchParams } from 'react-router';

import { parseSearchParams, toSearchParams } from '@/lib/searchParams';
import type { BookSearch } from '@/types/search';

export function useSearchUrl() {
  const [searchParams, setSearchParams] = useSearchParams();
  const key = searchParams.toString();

  const push = (search: BookSearch | null): string | null => {
    const next = search ? toSearchParams(search) : new URLSearchParams();
    if (next.toString() === key) return null;
    setSearchParams(next);
    return next.toString();
  };

  return { parsed: parseSearchParams(searchParams), key, push };
}

export type SearchUrl = ReturnType<typeof useSearchUrl>;
