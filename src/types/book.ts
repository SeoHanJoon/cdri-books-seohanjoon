/** 화면에 필요한 책 정보. 카카오 응답은 변환 함수에서 이 형태로 바꾼다. */
export interface Book {
  isbn: string;
  title: string;
  authors: string[];
  thumbnail: string;
  price: number;
  /** 할인가가 없으면 `null` (카카오 응답은 -1) */
  salePrice: number | null;
  url: string;
  contents: string;
}
