import { useEffect, useRef } from 'react';

const VIEW_WIDTH_VARIABLE_NAME = '--plan-view-width';

export const useViewWidth = () => {
  const viewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentElement = viewRef.current;
    if (!currentElement) return;

    const updateWidth = () => {
      const width = currentElement.offsetWidth;
      currentElement.style.setProperty(VIEW_WIDTH_VARIABLE_NAME, `${width}px`);
    };

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(currentElement);

    updateWidth();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return viewRef;
};
