import type { Book } from '@/types/book';

const numberFormat = new Intl.NumberFormat('ko-KR');

export function formatPrice(price: number): string {
  return `${numberFormat.format(price)}원`;
}

/** 실제로 내는 가격. 할인가가 있으면 할인가, 없으면 원가. */
export function getFinalPrice({ price, salePrice }: Pick<Book, 'price' | 'salePrice'>): number {
  return salePrice ?? price;
}
