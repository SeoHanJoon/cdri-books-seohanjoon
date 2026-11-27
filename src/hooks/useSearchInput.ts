import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { parseSearchParams, toSearchParams } from '@/lib/searchParams';

export function useSearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parsed = parseSearchParams(searchParams);
  const urlQuery = parsed.status === 'ready' && !parsed.search.target ? parsed.search.query : '';

  const [query, setQuery] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  if (syncedQuery !== urlQuery) {
    setSyncedQuery(urlQuery);
    if (urlQuery === submittedQuery) setSubmittedQuery(null);
    else setQuery(urlQuery);
  }

  const submit = () => {
    const trimmed = query.trim();
    const next = trimmed === '' ? new URLSearchParams() : toSearchParams({ query: trimmed });
    if (next.toString() === searchParams.toString()) return;
    setSubmittedQuery(trimmed);
    setSearchParams(next);
  };

  return { parsed, query, setQuery, submit };
}
