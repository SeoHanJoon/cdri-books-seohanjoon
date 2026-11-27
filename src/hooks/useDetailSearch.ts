import type { SearchUrl } from '@/hooks/useSearchUrl';
import { toDetailSearchCondition } from '@/lib/searchParams';
import type { DetailSearchCondition } from '@/types/search';

export function useDetailSearch({ parsed, push }: SearchUrl) {
  return {
    defaultValue: toDetailSearchCondition(parsed),
    submit: ({ target, keyword }: DetailSearchCondition) => push({ query: keyword.trim(), target }),
  };
}
