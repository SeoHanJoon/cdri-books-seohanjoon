import { clsx } from 'clsx';
import { type KeyboardEvent, useId, useRef, useState } from 'react';

import { ChevronIcon } from '@/components/icons/ChevronIcon';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  label: string;
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  autoFocus?: boolean;
}

/**
 * WAI-ARIA "select-only combobox" 패턴. 포커스는 항상 버튼에 두고,
 * 목록에서 가리키는 항목은 aria-activedescendant로 알린다.
 */
export function Select<T extends string>({
  label,
  options,
  value,
  onChange,
  autoFocus,
}: SelectProps<T>) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // 시안은 고른 항목을 목록에서 뺀다.
  const choices = options.filter((option) => option.value !== value);
  const selected = options.find((option) => option.value === value);
  const optionId = (index: number) => `${id}-option-${index}`;

  // 마우스로 열면 시안처럼 아무 항목도 강조하지 않고, 키보드로 열면 첫 항목을 가리킨다.
  const openList = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const choose = (index: number) => {
    setOpen(false);
    if (index >= 0) onChange(choices[index].value);
  };

  const handleClick = () => {
    // Safari는 버튼을 눌러도 포커스를 주지 않아 직접 준다. 그래야 방향키와 바깥 클릭 닫기가 동작한다.
    triggerRef.current?.focus();
    if (open) setOpen(false);
    else openList(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        openList(0);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, choices.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        choose(activeIndex);
        break;
      case 'Escape':
        // 목록만 닫고, 바깥 팝업까지 닫히지 않게 한다.
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-listbox` : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        autoFocus={autoFocus}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onBlur={() => setOpen(false)}
        className="flex h-9 w-25 items-center border-b border-divider pl-2 text-body2-bold text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {selected?.label}
        <span className="absolute right-1">
          <ChevronIcon size={20} direction={open ? 'up' : 'down'} />
        </span>
      </button>

      {open && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          aria-label={label}
          className="absolute top-10.5 left-0 z-10 w-25 bg-white shadow-dropdown"
        >
          {choices.map((option, index) => (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={index === activeIndex}
              // 누르는 순간 버튼에서 포커스가 빠져 목록이 닫히지 않게 한다.
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(index)}
              className={clsx(
                'flex h-7.5 cursor-pointer items-center pl-2 text-body2 text-text-subtitle',
                index === activeIndex && 'bg-light-gray',
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
