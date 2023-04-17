import { RefObject, useEffect } from "react";

export default function useResizeEffect<E extends HTMLElement>(
  ref: RefObject<E>,
  handler: (entry: ResizeObserverEntry, target: E | null) => void
) {
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      handler(entry, ref.current);
    });
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    return () => resizeObserver.disconnect();
  }, [handler]);
}
