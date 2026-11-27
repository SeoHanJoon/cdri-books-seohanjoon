import { type RefObject, useEffect, useLayoutEffect, useRef } from 'react';

export type DismissReason = 'escape' | 'outside';

export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onDismiss: (reason: DismissReason) => void,
) {
  const onDismissRef = useRef(onDismiss);
  useLayoutEffect(() => {
    onDismissRef.current = onDismiss;
  });

  useEffect(() => {
    const root = ref.current;
    if (!open || !root) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!root.contains(event.target as Node)) onDismissRef.current('outside');
    };
    // 안쪽 Select가 Esc를 먼저 처리하면(목록만 닫기) 막아 둔다.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) onDismissRef.current('escape');
    };
    // 다음 포커스 대상이 없으면(안쪽 빈 곳 클릭 등) 닫지 않는다. 바깥 클릭은 pointerdown이 잡는다.
    const handleFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (next && !root.contains(next)) onDismissRef.current('outside');
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    root.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      root.removeEventListener('focusout', handleFocusOut);
    };
  }, [ref, open]);
}
