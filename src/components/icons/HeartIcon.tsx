import { fitViewBox } from './fitViewBox';

const FILL_PATH =
  'M7.5 4C4.46244 4 2 6.46245 2 9.5C2 15 8.5 20 12 21.1631C15.5 20 22 15 22 9.5C22 6.46245 19.5375 4 16.5 4C14.6398 4 12.9953 4.92345 12 6.3369C11.0047 4.92345 9.36015 4 7.5 4Z';
const FILL_SHAPE = { x: 2, y: 4, width: 20, height: 17.1631 };

const LINE_PATH =
  'M1 9.5C1 5.91017 3.91015 3 7.5 3C9.24701 3 10.8329 3.68982 12 4.80968C13.1671 3.68982 14.753 3 16.5 3C20.0898 3 23 5.91017 23 9.5C23 12.6341 21.164 15.4994 19.0231 17.6615C16.8724 19.8335 14.2421 21.4718 12.3154 22.1121C12.1106 22.1801 11.8894 22.1801 11.6846 22.1121C9.75788 21.4718 7.12761 19.8335 4.97692 17.6615C2.83596 15.4994 1 12.6341 1 9.5ZM7.5 5C5.01472 5 3 7.01473 3 9.5C3 11.8659 4.41404 14.2506 6.39808 16.2543C8.24453 18.119 10.4368 19.5021 12 20.1011C13.5632 19.5021 15.7555 18.119 17.6019 16.2543C19.586 14.2506 21 11.8659 21 9.5C21 7.01473 18.9853 5 16.5 5C14.9789 5 13.6337 5.75379 12.8176 6.91266C12.6303 7.17865 12.3253 7.3369 12 7.3369C11.6747 7.3369 11.3697 7.17865 11.1824 6.91266C10.3663 5.75379 9.02112 5 7.5 5Z';
const LINE_SHAPE = { x: 1, y: 3, width: 22, height: 19.1631 };

// Figma의 16px 하트는 24px 하트를 축소한 것이 아니라 16px 상자 안 (1.33, 1.77)에 13.33×12.23으로 따로 그려져 있다.
const SMALL_TARGET = { x: 4 / 3, y: 1.7667, width: 40 / 3, height: 12.2333 };
const SMALL_BOX = { width: 16, height: 16 };

interface HeartIconProps {
  filled: boolean;
  size: 'sm' | 'lg';
}

export function HeartIcon({ filled, size }: HeartIconProps) {
  const path = filled ? FILL_PATH : LINE_PATH;
  const shape = filled ? FILL_SHAPE : LINE_SHAPE;
  const isSmall = size === 'sm';
  const box = isSmall ? 16 : 24;

  return (
    <svg
      width={box}
      height={box}
      viewBox={isSmall ? fitViewBox(shape, SMALL_BOX, SMALL_TARGET) : '0 0 24 24'}
      preserveAspectRatio={isSmall ? 'none' : undefined}
      className={filled ? 'text-red' : 'text-gray'}
      aria-hidden="true"
    >
      {filled ? (
        <path
          d={path}
          fill="currentColor"
          // 24px 채움 하트에만 Figma처럼 2px 테두리가 있다. 16px까지 테두리를 두면 원본보다 2px 커진다.
          stroke={isSmall ? 'none' : 'currentColor'}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path d={path} fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
      )}
    </svg>
  );
}
