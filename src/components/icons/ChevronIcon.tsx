import { fitViewBox } from './fitViewBox';

const PATH = 'M5.5 8L9.25 11.75L13 8L14.5 8.75L9.25 14L4 8.75L5.5 8Z';
const SHAPE = { x: 4, y: 8, width: 10.5, height: 6 };

const SIZES = {
  // 상세 검색 팝업 Select (Figma에서 받은 원본 그대로)
  sm: { width: 20, height: 20, viewBox: '0 0 20 20' },
  // 상세보기 버튼 14×8. 같은 비율이라 sm 도형을 키워서 쓴다.
  lg: {
    width: 14,
    height: 8,
    viewBox: fitViewBox(SHAPE, { width: 14, height: 8 }, { x: 0, y: 0, width: 14, height: 8 }),
  },
};

interface ChevronIconProps {
  size: 'sm' | 'lg';
  direction?: 'down' | 'up';
}

export function ChevronIcon({ size, direction = 'down' }: ChevronIconProps) {
  const { width, height, viewBox } = SIZES[size];
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      className={direction === 'up' ? 'rotate-180 text-ui-gray' : 'text-ui-gray'}
      aria-hidden="true"
    >
      <path d={PATH} fill="currentColor" />
    </svg>
  );
}
