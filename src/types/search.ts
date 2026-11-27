export type SearchTarget = 'title' | 'person' | 'publisher';

export interface DetailSearchCondition {
  target: SearchTarget;
  keyword: string;
}
