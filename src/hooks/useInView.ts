import { type RefCallback, useCallback, useLayoutEffect, useRef } from 'react';

export function useInView(onEnter: () => void, rootMargin = '200px'): RefCallback<Element> {
  const onEnterRef = useRef(onEnter);
  useLayoutEffect(() => {
    onEnterRef.current = onEnter;
  });

  return useCallback(
    (node: Element | null) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) onEnterRef.current();
        },
        { rootMargin },
      );
      observer.observe(node);
      return () => observer.disconnect();
    },
    [rootMargin],
  );
}
