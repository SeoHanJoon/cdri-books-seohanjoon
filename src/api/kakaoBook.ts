import type { Book } from '@/types/book';

export const KAKAO_BOOK_SEARCH_URL = 'https://dapi.kakao.com/v3/search/book';

export interface KakaoBookDocument {
  title: string;
  contents: string;
  url: string;
  isbn: string;
  datetime: string;
  authors: string[];
  publisher: string;
  translators: string[];
  price: number;
  sale_price: number;
  thumbnail: string;
  status: string;
}

export interface KakaoBookSearchResponse {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: KakaoBookDocument[];
}

// 카카오 isbn은 "10자리 13자리"를 공백으로 이은 문자열이고, 한쪽만 있거나 비어 있을 수 있다.
function pickIsbn(isbn: string): string | undefined {
  const parts = isbn.split(' ').filter(Boolean);
  return parts.find((part) => part.length === 13) ?? parts.find((part) => part.length === 10);
}

// 카카오는 책 소개를 250자 안팎에서 문장 중간에 자른다.
const SENTENCE_END = /[.!?。…"'”’」』)]$/;

function formatContents(contents: string): string {
  const trimmed = contents.trimEnd();
  if (trimmed === '' || SENTENCE_END.test(trimmed)) return trimmed;
  return `${trimmed}…`;
}

export function toBook(document: KakaoBookDocument): Book {
  return {
    isbn: pickIsbn(document.isbn) ?? document.url,
    title: document.title,
    authors: document.authors,
    thumbnail: document.thumbnail,
    price: document.price,
    // 카카오는 할인가가 없으면 -1을 준다.
    salePrice: document.sale_price < 0 ? null : document.sale_price,
    url: document.url,
    contents: formatContents(document.contents),
  };
}
