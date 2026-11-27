import { clsx } from 'clsx';

interface ChevronIconProps {
  size: 20 | 24;
  direction?: 'down' | 'up';
}

export function ChevronIcon({ size, direction = 'down' }: ChevronIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={clsx('text-ui-gray', direction === 'up' && 'rotate-180')}
      aria-hidden="true"
    >
      <path d="M5.5 8L9.25 11.75L13 8L14.5 8.75L9.25 14L4 8.75L5.5 8Z" fill="currentColor" />
    </svg>
  );
}
