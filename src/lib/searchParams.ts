import type { BookSearch, DetailSearchCondition, SearchTarget } from '@/types/search';

const SEARCH_TARGETS: Record<SearchTarget, true> = { title: true, person: true, publisher: true };

export function isSearchTarget(value: string): value is SearchTarget {
  return Object.hasOwn(SEARCH_TARGETS, value);
}

export type ParsedSearchParams =
  { status: 'idle' } | { status: 'invalid' } | { status: 'ready'; search: BookSearch };

export function parseSearchParams(params: URLSearchParams): ParsedSearchParams {
  const target = params.get('target');
  if (target !== null && !isSearchTarget(target)) return { status: 'invalid' };

  const query = params.get('query')?.trim() ?? '';
  if (query === '') return { status: 'idle' };

  return { status: 'ready', search: target === null ? { query } : { query, target } };
}

export function toSearchParams({ query, target }: BookSearch): URLSearchParams {
  const params = new URLSearchParams({ query });
  if (target) params.set('target', target);
  return params;
}

const EMPTY_DETAIL_SEARCH: DetailSearchCondition = { target: 'title', keyword: '' };

export function toDetailSearchCondition(parsed: ParsedSearchParams): DetailSearchCondition {
  if (parsed.status !== 'ready' || !parsed.search.target) return EMPTY_DETAIL_SEARCH;
  return { target: parsed.search.target, keyword: parsed.search.query };
}
