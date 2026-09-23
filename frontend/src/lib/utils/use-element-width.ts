import { useCallback, useState, type RefCallback } from "react";

/** Tracks an element's content width via ResizeObserver. 0 until measured. */
export function useElementWidth<T extends HTMLElement>(): [RefCallback<T>, number] {
  const [width, setWidth] = useState(0);

  const ref = useCallback<RefCallback<T>>((node) => {
    if (!node) return;
    setWidth(node.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(node);
    // React 19 callback refs may return a cleanup function.
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}
