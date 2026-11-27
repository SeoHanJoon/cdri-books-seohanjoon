import iconBook from '@/assets/icon-book.png';

interface NoDataProps {
  message: string;
}

export function NoData({ message }: NoDataProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <img src={iconBook} alt="" width={80} height={80} />
      <p className="text-caption text-text-secondary">{message}</p>
    </div>
  );
}
