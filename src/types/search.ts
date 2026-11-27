export type SearchTarget = 'title' | 'person' | 'publisher';

export interface DetailSearchCondition {
  target: SearchTarget;
  keyword: string;
}

// URL과 API 요청이 함께 쓰는 검색 조건. target이 없으면 전체 검색이다.
export interface BookSearch {
  query: string;
  target?: SearchTarget;
}
