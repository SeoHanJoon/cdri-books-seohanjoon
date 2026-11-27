import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { parseSearchParams, toDetailSearchCondition, toSearchParams } from '@/lib/searchParams';
import { useSearchHistoryStore } from '@/stores/searchHistoryStore';
import type { DetailSearchCondition } from '@/types/search';

export function useSearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parsed = parseSearchParams(searchParams);
  const urlKey = searchParams.toString();
  const urlQuery = parsed.status === 'ready' && !parsed.search.target ? parsed.search.query : '';
  const addHistory = useSearchHistoryStore((state) => state.add);

  const [query, setQuery] = useState(urlQuery);
  // 상세 검색끼리 오갈 때는 urlQuery가 계속 ''라서, URL 전체를 기준으로 바뀐 것을 알아챈다.
  const [syncedKey, setSyncedKey] = useState(urlKey);
  const [submittedKey, setSubmittedKey] = useState<string | null>(null);
  if (syncedKey !== urlKey) {
    setSyncedKey(urlKey);
    if (urlKey === submittedKey) setSubmittedKey(null);
    else setQuery(urlQuery);
  }

  const navigate = (next: URLSearchParams) => {
    if (next.toString() === urlKey) return;
    setSubmittedKey(next.toString());
    setSearchParams(next);
  };

  const search = (keyword: string) => {
    const trimmed = keyword.trim();
    addHistory(trimmed);
    navigate(trimmed === '' ? new URLSearchParams() : toSearchParams({ query: trimmed }));
  };

  const submit = () => search(query);

  const searchKeyword = (keyword: string) => {
    setQuery(keyword);
    search(keyword);
  };

  // 같은 조건으로 다시 검색하면 URL이 그대로라 동기화가 일어나지 않으므로 직접 비운다.
  const submitDetail = ({ target, keyword }: DetailSearchCondition) => {
    setQuery('');
    navigate(toSearchParams({ query: keyword, target }));
  };

  return {
    parsed,
    query,
    setQuery,
    submit,
    searchKeyword,
    detailDefault: toDetailSearchCondition(parsed),
    submitDetail,
  };
}
