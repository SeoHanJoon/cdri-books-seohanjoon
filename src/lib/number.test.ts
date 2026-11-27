import { describe, expect, it } from 'vitest';

import { formatNumber } from './number';

describe('formatNumber', () => {
  it('세 자리마다 쉼표를 넣는다', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('천 미만은 쉼표 없이 표시한다', () => {
    expect(formatNumber(999)).toBe('999');
  });

  it('0을 표시한다', () => {
    expect(formatNumber(0)).toBe('0');
  });
});
