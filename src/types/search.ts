export type SearchTarget = 'title' | 'person' | 'publisher';

export interface DetailSearchCondition {
  target: SearchTarget;
  keyword: string;
}

export interface BookSearch {
  query: string;
  target?: SearchTarget;
}
