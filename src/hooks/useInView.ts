import { type RefCallback, useCallback, useLayoutEffect, useRef } from 'react';

// 요소가 화면에 들어오면(rootMargin만큼 미리) onEnter를 부른다.
// 붙인 요소가 새로 그려질 때마다 다시 관찰하므로, 그려지는 순간 이미 화면 안이면 바로 부른다.
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
