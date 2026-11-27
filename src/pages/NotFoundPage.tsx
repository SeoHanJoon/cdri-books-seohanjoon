import { Button } from '@/components/Button';
import { NoData } from '@/components/NoData';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-8 pt-10 pb-40 md:pt-26">
      <NoData message="존재하지 않는 페이지입니다." />
      <Button variant="primary" href="/" className="px-5">
        도서 검색으로 돌아가기
      </Button>
    </div>
  );
}
