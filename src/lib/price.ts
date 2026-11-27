import type { Book } from '@/types/book';

const numberFormat = new Intl.NumberFormat('ko-KR');

export function formatPrice(price: number): string {
  return `${numberFormat.format(price)}원`;
}

export function getFinalPrice({ price, salePrice }: Pick<Book, 'price' | 'salePrice'>): number {
  return salePrice ?? price;
}
