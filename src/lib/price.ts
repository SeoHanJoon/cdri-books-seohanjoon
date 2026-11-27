import { formatNumber } from '@/lib/number';
import type { Book } from '@/types/book';

export function formatPrice(price: number): string {
  return `${formatNumber(price)}원`;
}

export function getFinalPrice({ price, salePrice }: Pick<Book, 'price' | 'salePrice'>): number {
  return salePrice ?? price;
}
