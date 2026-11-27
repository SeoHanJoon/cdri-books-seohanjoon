import { describe, expect, it } from 'vitest';

import { fitViewBox } from './fitViewBox';

describe('fitViewBox', () => {
  it('도형이 이미 목표 위치·크기에 있으면 원본 viewBox와 같다', () => {
    const shape = { x: 4, y: 8, width: 10.5, height: 6 };
    expect(fitViewBox(shape, { width: 20, height: 20 }, shape)).toBe('0 0 20 20');
  });

  it('도형을 상자에 꽉 차게 키우면 viewBox가 도형 영역과 같다', () => {
    expect(
      fitViewBox(
        { x: 4, y: 8, width: 10.5, height: 6 },
        { width: 14, height: 8 },
        { x: 0, y: 0, width: 14, height: 8 },
      ),
    ).toBe('4 8 10.5 6');
  });

  it('목표 위치만큼 여백을 원본 단위로 바꿔 viewBox 시작점을 앞당긴다', () => {
    // 35/3(≈11.67) → 16, 상자 24 안 (4, 4)
    expect(
      fitViewBox(
        { x: 25 / 6, y: 25 / 6, width: 35 / 3, height: 35 / 3 },
        { width: 24, height: 24 },
        { x: 4, y: 4, width: 16, height: 16 },
      ),
    ).toBe('1.25 1.25 17.5 17.5');
  });

  it('가로세로 배율이 달라도 각 축을 따로 맞춘다', () => {
    expect(
      fitViewBox(
        { x: 0, y: 0, width: 10, height: 10 },
        { width: 20, height: 10 },
        { x: 0, y: 0, width: 20, height: 5 },
      ),
    ).toBe('0 0 10 20');
  });
});
