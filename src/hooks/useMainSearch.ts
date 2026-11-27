import { useState } from 'react';

import type { SearchUrl } from '@/hooks/useSearchUrl';
import { useSearchHistoryStore } from '@/stores/searchHistoryStore';

export function useMainSearch({ parsed, key, push }: SearchUrl) {
  const urlQuery = parsed.status === 'ready' && !parsed.search.target ? parsed.search.query : '';
  const addHistory = useSearchHistoryStore((state) => state.add);

  const [query, setQuery] = useState(urlQuery);
  const [syncedKey, setSyncedKey] = useState(key);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  if (syncedKey !== key) {
    setSyncedKey(key);
    if (key === pendingKey) setPendingKey(null);
    else setQuery(urlQuery);
  }

  const search = (keyword: string) => {
    const trimmed = keyword.trim();
    addHistory(trimmed);
    setQuery(trimmed);
    setPendingKey(push(trimmed === '' ? null : { query: trimmed }));
  };

  return {
    query,
    setQuery,
    submit: () => search(query),
    searchKeyword: search,
    clear: () => setQuery(''),
  };
}
