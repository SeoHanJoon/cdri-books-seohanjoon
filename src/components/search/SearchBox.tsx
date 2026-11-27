import { clsx } from 'clsx';
import { type MouseEvent, type ReactNode, type SubmitEvent, useRef, useState } from 'react';

import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { SearchIcon } from '@/components/ui/icons/SearchIcon';
import { useDismiss } from '@/hooks/useDismiss';

interface SearchBoxProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  detailSearch: ReactNode;
  history: string[];
  onHistorySelect: (keyword: string) => void;
  onHistoryRemove: (keyword: string) => void;
}

export function SearchBox({
  value,
  onValueChange,
  onSubmit,
  detailSearch,
  history,
  onHistorySelect,
  onHistoryRemove,
}: SearchBoxProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const showHistory = historyOpen && history.length > 0;

  useDismiss(formRef, historyOpen, () => setHistoryOpen(false));

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHistoryOpen(false);
    onSubmit();
  };

  // 안쪽 빈 곳을 눌러도 포커스가 입력창에서 빠지지 않게 한다. 드롭다운은 열린 채 둔다.
  const keepInputFocus = (event: MouseEvent<HTMLFormElement>) => {
    if (!(event.target as Element).closest('input, button')) event.preventDefault();
  };

  const selectHistory = (keyword: string) => {
    inputRef.current?.focus();
    setHistoryOpen(false);
    onHistorySelect(keyword);
  };

  const removeHistory = (keyword: string) => {
    inputRef.current?.focus();
    onHistoryRemove(keyword);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-12.5 max-w-120 min-w-0 flex-1">
        <form
          role="search"
          ref={formRef}
          onSubmit={handleSubmit}
          onMouseDown={keepInputFocus}
          className={clsx(
            'absolute inset-x-0 top-0 bg-light-gray',
            showHistory ? 'z-10 rounded-3xl' : 'rounded-full',
          )}
        >
          <div className="flex h-12.5 items-center gap-2.75 pr-5 pl-2.5">
            <SearchIcon />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(event) => onValueChange(event.target.value)}
              onFocus={() => setHistoryOpen(true)}
              onClick={() => setHistoryOpen(true)}
              placeholder="검색어를 입력하세요"
              aria-label="검색어"
              enterKeyHint="search"
              className="min-w-0 flex-1 bg-transparent text-caption text-black outline-none placeholder:text-text-subtitle"
            />
          </div>
          {showHistory && (
            <ul aria-label="검색 기록" className="flex flex-col pt-1.75 pb-4">
              {history.map((keyword) => (
                <li key={keyword} className="relative h-10 hover:bg-gray has-focus-visible:bg-gray">
                  <button
                    type="button"
                    onClick={() => selectHistory(keyword)}
                    className="size-full truncate pr-14.25 pl-12.75 text-left text-caption text-text-subtitle outline-none"
                  >
                    {keyword}
                  </button>
                  <button
                    type="button"
                    aria-label={`${keyword} 검색 기록 삭제`}
                    onClick={() => removeHistory(keyword)}
                    className="absolute top-1/2 right-6.25 -translate-y-1/2"
                  >
                    <CloseIcon size={24} className="text-black" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
      {detailSearch}
    </div>
  );
}
