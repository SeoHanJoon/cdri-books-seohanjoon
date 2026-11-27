import { clsx } from 'clsx';
import {
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  type SubmitEvent,
  useRef,
  useState,
} from 'react';

import { CloseIcon } from '@/components/icons/CloseIcon';
import { SearchIcon } from '@/components/icons/SearchIcon';

interface SearchBoxProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  /** 입력창 오른쪽, 상세검색 버튼 자리 */
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const showHistory = historyOpen && history.length > 0;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHistoryOpen(false);
    onSubmit();
  };

  const handleBlur = (event: FocusEvent<HTMLFormElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setHistoryOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') setHistoryOpen(false);
  };

  // 누른 버튼이 목록에서 사라지면 포커스가 <body>로 빠지므로 입력창으로 돌려놓는다.
  // focus()가 여는 onFocus보다 닫기가 나중에 반영되도록 순서를 지킨다.
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
    <div className="flex flex-col gap-7">
      <h1 className="text-title2 text-text-primary">도서 검색</h1>
      <div className="flex items-center gap-4">
        <div className="relative h-12.5 max-w-120 min-w-0 flex-1">
          <form
            role="search"
            onSubmit={handleSubmit}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
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
                  <li
                    key={keyword}
                    className="relative h-10 hover:bg-gray has-focus-visible:bg-gray"
                  >
                    {/* 검색어 버튼이 줄 전체를 덮고 X는 그 위에 얹는다. 오른쪽 여백(8 + 24 + 25px)은 긴 검색어가 X 밑으로 들어가지 않게 한다. */}
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
    </div>
  );
}
