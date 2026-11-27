import { type SubmitEvent, useEffect, useId, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { Select, type SelectOption } from '@/components/ui/Select';
import type { DetailSearchCondition, SearchTarget } from '@/types/search';

const TARGET_OPTIONS: readonly SelectOption<SearchTarget>[] = [
  { value: 'title', label: '제목' },
  { value: 'person', label: '저자명' },
  { value: 'publisher', label: '출판사' },
];

interface DetailSearchPanelProps {
  defaultValue: DetailSearchCondition;
  onSubmit: (condition: DetailSearchCondition) => void;
  onClose: () => void;
  onTabOut: () => void;
}

function DetailSearchPanel({ defaultValue, onSubmit, onClose, onTabOut }: DetailSearchPanelProps) {
  const [target, setTarget] = useState(defaultValue.target);
  const [keyword, setKeyword] = useState(defaultValue.keyword);
  const [keywordMissing, setKeywordMissing] = useState(false);
  const keywordRef = useRef<HTMLInputElement>(null);
  const keywordHintId = useId();

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (keyword.trim() === '') {
      setKeywordMissing(true);
      keywordRef.current?.focus();
      return;
    }
    onClose();
    onSubmit({ target, keyword });
  };

  return (
    <div
      role="dialog"
      aria-label="상세 검색"
      className="absolute top-full right-0 z-20 mt-3.75 w-[min(360px,calc(100vw-32px))] rounded-lg bg-white shadow-popover md:right-auto md:left-1/2 md:w-90 md:-translate-x-1/2"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-9">
        <div className="flex gap-1">
          <Select
            label="검색 조건"
            options={TARGET_OPTIONS}
            value={target}
            onChange={setTarget}
            autoFocus
          />
          <input
            ref={keywordRef}
            type="text"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              setKeywordMissing(false);
            }}
            placeholder="검색어 입력"
            aria-label="상세 검색어"
            aria-invalid={keywordMissing}
            aria-describedby={keywordMissing ? keywordHintId : undefined}
            enterKeyHint="search"
            className="h-9 min-w-0 flex-1 border-b border-primary pl-2.25 text-body2 text-black outline-none placeholder:text-text-subtitle"
          />
          <span id={keywordHintId} className="sr-only">
            검색어를 입력해 주세요.
          </span>
        </div>
        <Button variant="primary-small" type="submit" className="w-full">
          검색하기
        </Button>
      </form>
      <button
        type="button"
        aria-label="상세 검색 닫기"
        onClick={onClose}
        onKeyDown={(event) => {
          if (event.key === 'Tab' && !event.shiftKey) onTabOut();
        }}
        className="absolute top-2 right-2"
      >
        <CloseIcon size={20} />
      </button>
    </div>
  );
}

interface DetailSearchProps {
  defaultValue: DetailSearchCondition;
  onSubmit: (condition: DetailSearchCondition) => void;
}

export function DetailSearch({ defaultValue, onSubmit }: DetailSearchProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const closeAndFocusTrigger = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative shrink-0"
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <Button
        ref={triggerRef}
        variant="outline"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="w-18"
      >
        상세검색
      </Button>
      {open && (
        <DetailSearchPanel
          defaultValue={defaultValue}
          onSubmit={onSubmit}
          onClose={closeAndFocusTrigger}
          onTabOut={() => setOpen(false)}
        />
      )}
    </div>
  );
}
