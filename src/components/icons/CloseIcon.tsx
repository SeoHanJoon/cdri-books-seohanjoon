import { fitViewBox } from './fitViewBox';

const PATH =
  'M14.6582 4.16666L9.99984 8.82499L5.3415 4.16666L4.1665 5.34166L8.82484 9.99999L4.1665 14.6583L5.3415 15.8333L9.99984 11.175L14.6582 15.8333L15.8332 14.6583L11.1748 9.99999L15.8332 5.34166L14.6582 4.16666Z';
const SHAPE = { x: 4.1665, y: 4.16666, width: 11.6667, height: 11.6667 };

const SIZES = {
  // 상세 검색 팝업 닫기 (Figma에서 받은 원본 그대로)
  sm: { box: 20, viewBox: '0 0 20 20', color: 'text-ui-gray' },
  // 검색 기록 항목 삭제: 24px 상자 안 16×16. 같은 모양이라 sm 도형을 키워서 쓴다.
  lg: {
    box: 24,
    viewBox: fitViewBox(SHAPE, { width: 24, height: 24 }, { x: 4, y: 4, width: 16, height: 16 }),
    color: 'text-black',
  },
};

interface CloseIconProps {
  size: 'sm' | 'lg';
}

export function CloseIcon({ size }: CloseIconProps) {
  const { box, viewBox, color } = SIZES[size];
  return (
    <svg width={box} height={box} viewBox={viewBox} className={color} aria-hidden="true">
      <path d={PATH} fill="currentColor" />
    </svg>
  );
}
