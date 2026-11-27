import { formatNumber } from '@/lib/number';

interface CountTextProps {
  label: string;
  count: number;
}

export function CountText({ label, count }: CountTextProps) {
  return (
    <p
      aria-live="polite"
      aria-atomic="true"
      className="flex gap-4 text-caption leading-6 text-text-primary"
    >
      <span>{label}</span>
      <span className="font-normal">
        총 <span className="font-medium text-primary">{formatNumber(count)}</span>건
      </span>
    </p>
  );
}
