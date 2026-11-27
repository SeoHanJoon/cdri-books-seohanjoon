interface SearchCountTextProps {
  label: string;
  count: number;
}

export function SearchCountText({ label, count }: SearchCountTextProps) {
  return (
    <p className="flex gap-4 text-caption leading-6 text-text-primary">
      <span>{label}</span>
      <span className="font-normal">
        총 <span className="font-medium text-primary">{count.toLocaleString('ko-KR')}</span>건
      </span>
    </p>
  );
}
