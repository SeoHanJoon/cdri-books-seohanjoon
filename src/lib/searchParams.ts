import type { BookSearch, SearchTarget } from '@/types/search';

const SEARCH_TARGETS: Record<SearchTarget, true> = { title: true, person: true, publisher: true };

export function isSearchTarget(value: string): value is SearchTarget {
  return Object.hasOwn(SEARCH_TARGETS, value);
}

export type ParsedSearchParams =
  { status: 'idle' } | { status: 'invalid' } | { status: 'ready'; search: BookSearch };

export function parseSearchParams(params: URLSearchParams): ParsedSearchParams {
  const target = params.get('target');
  // 카카오는 허용되지 않은 target을 에러 없이 무시하고 전체 검색을 한다.
  if (target !== null && !isSearchTarget(target)) return { status: 'invalid' };

  const query = params.get('query')?.trim() ?? '';
  if (query === '') return { status: 'idle' };

  return { status: 'ready', search: target === null ? { query } : { query, target } };
}

export function toSearchParams({ query, target }: BookSearch): URLSearchParams {
  const params = new URLSearchParams({ query: query.trim() });
  if (target) params.set('target', target);
  return params;
}
