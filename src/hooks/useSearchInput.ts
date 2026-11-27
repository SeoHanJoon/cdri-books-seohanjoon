import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { parseSearchParams, toSearchParams } from '@/lib/searchParams';
import { useSearchHistoryStore } from '@/stores/searchHistoryStore';

export function useSearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parsed = parseSearchParams(searchParams);
  const urlQuery = parsed.status === 'ready' && !parsed.search.target ? parsed.search.query : '';
  const addHistory = useSearchHistoryStore((state) => state.add);

  const [query, setQuery] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  if (syncedQuery !== urlQuery) {
    setSyncedQuery(urlQuery);
    if (urlQuery === submittedQuery) setSubmittedQuery(null);
    else setQuery(urlQuery);
  }

  const search = (keyword: string) => {
    const trimmed = keyword.trim();
    addHistory(trimmed);
    const next = trimmed === '' ? new URLSearchParams() : toSearchParams({ query: trimmed });
    if (next.toString() === searchParams.toString()) return;
    setSubmittedQuery(trimmed);
    setSearchParams(next);
  };

  const submit = () => search(query);

  const searchKeyword = (keyword: string) => {
    setQuery(keyword);
    search(keyword);
  };

  return { parsed, query, setQuery, submit, searchKeyword };
}
