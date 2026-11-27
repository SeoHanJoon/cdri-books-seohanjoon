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
      className={direction === 'up' ? 'rotate-180 text-ui-gray' : 'text-ui-gray'}
      aria-hidden="true"
    >
      <path d="M5.5 8L9.25 11.75L13 8L14.5 8.75L9.25 14L4 8.75L5.5 8Z" fill="currentColor" />
    </svg>
  );
}
