import { useState } from 'react';

import type { SearchUrl } from '@/hooks/useSearchUrl';
import { useSearchHistoryStore } from '@/stores/searchHistoryStore';

export function useMainSearch({ parsed, key, push }: SearchUrl) {
  const urlQuery = parsed.status === 'ready' && !parsed.search.target ? parsed.search.query : '';
  const addHistory = useSearchHistoryStore((state) => state.add);

  const [query, setQuery] = useState(urlQuery);
  // 상세 검색끼리 오갈 때는 urlQuery가 계속 ''라서, URL 전체로 바뀐 것을 알아챈다.
  const [syncedKey, setSyncedKey] = useState(key);
  // URL은 검색한 뒤 한 박자 늦게 바뀐다. 직접 보낸 URL이 도착할 때 덮어쓰면 그 사이 친 글자가 사라진다.
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
