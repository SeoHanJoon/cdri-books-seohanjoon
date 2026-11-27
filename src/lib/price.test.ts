import { describe, expect, it } from 'vitest';

import { formatPrice, getFinalPrice } from './price';

describe('formatPrice', () => {
  it('세 자리마다 쉼표를 넣고 "원"을 붙인다', () => {
    expect(formatPrice(13300)).toBe('13,300원');
  });

  it('천 원 미만은 쉼표 없이 표시한다', () => {
    expect(formatPrice(900)).toBe('900원');
  });

  it('백만 원 이상도 쉼표를 두 번 넣는다', () => {
    expect(formatPrice(1234567)).toBe('1,234,567원');
  });

  it('0원을 표시한다', () => {
    expect(formatPrice(0)).toBe('0원');
  });
});

describe('getFinalPrice', () => {
  it('할인가가 있으면 할인가를 돌려준다', () => {
    expect(getFinalPrice({ price: 16000, salePrice: 13500 })).toBe(13500);
  });

  it('할인가가 없으면 원가를 돌려준다', () => {
    expect(getFinalPrice({ price: 16000, salePrice: null })).toBe(16000);
  });

  it('할인가가 0원이면 0원을 돌려준다 (없음과 구분)', () => {
    expect(getFinalPrice({ price: 16000, salePrice: 0 })).toBe(0);
  });
});
