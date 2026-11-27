import type { SubmitEvent } from 'react';

import { Button } from '@/components/Button';
import { SearchIcon } from '@/components/icons/SearchIcon';

interface SearchBoxProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  onDetailSearchClick: () => void;
}

export function SearchBox({ value, onValueChange, onSubmit, onDetailSearchClick }: SearchBoxProps) {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="flex flex-col gap-7">
      <h1 className="text-title2 text-text-primary">도서 검색</h1>
      <div className="flex items-center gap-4">
        <form
          role="search"
          onSubmit={handleSubmit}
          className="flex h-12.5 max-w-120 min-w-0 flex-1 items-center gap-2.75 rounded-full bg-light-gray pr-5 pl-2.5"
        >
          <SearchIcon />
          <input
            type="text"
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            placeholder="검색어를 입력하세요"
            aria-label="검색어"
            enterKeyHint="search"
            className="min-w-0 flex-1 bg-transparent text-caption text-black outline-none placeholder:text-text-subtitle"
          />
        </form>
        <Button variant="outline" onClick={onDetailSearchClick} className="w-18">
          상세검색
        </Button>
      </div>
    </div>
  );
}
