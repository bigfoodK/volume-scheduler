import { RefObject, useEffect, useState } from "react";

export default function useResizeEffect<E extends HTMLElement>(
  ref: RefObject<E>,
  handler: (entry: ResizeObserverEntry, target: E | null) => void
) {
  const [previousCanvasSize, setPreviousCanvasSize] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      if (
        previousCanvasSize.width === entry.contentRect.width &&
        previousCanvasSize.height === entry.contentRect.height
      ) {
        return;
      }
      setPreviousCanvasSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
      handler(entry, ref.current);
    });
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    return () => resizeObserver.disconnect();
  }, [handler, previousCanvasSize, setPreviousCanvasSize]);
}
