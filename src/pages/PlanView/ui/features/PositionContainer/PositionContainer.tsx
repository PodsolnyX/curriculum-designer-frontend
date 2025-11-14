import React, {
  CSSProperties,
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { positionsStore } from '@/pages/PlanView/stores/positionsStore.ts';
import { observer } from 'mobx-react-lite';

interface ContainerProps {
  rowId: string;
  id: string;
  children: ReactNode;
  rootClassName?: string | ((height: number) => string);
  rootStyles?: CSSProperties | ((height: number) => CSSProperties);
  countHorizontalCoordinates?: boolean;
  countHeights?: boolean;
  childrenClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>((props, ref) => {
  const {
    rowId,
    id,
    children,
    rootClassName,
    countHorizontalCoordinates,
    rootStyles,
    countHeights = true,
    childrenClassName,
    onClick,
  } = props;

  const contentRef = useRef<HTMLDivElement | null>(null);
  const maxHeight = positionsStore.getMaxHeight(rowId);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry) {
        const height = entry.contentRect.height;
        countHeights && positionsStore.updateHeight(rowId, id, height);
        countHorizontalCoordinates &&
          positionsStore.updateHorizontalCoordinate(
            rowId,
            id,
            entry.contentRect.width,
          );
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [rowId, id]);

  const styles = useMemo(() => {
    let defaultStyles: CSSProperties = {
      height: maxHeight || 'auto',
    };
    if (typeof rootStyles === 'function') defaultStyles = rootStyles(maxHeight);
    else if (typeof rootStyles === 'object') defaultStyles = rootStyles;
    return defaultStyles;
  }, [maxHeight, rootStyles]);

  return (
    <div
      style={styles}
      className={
        typeof rootClassName === 'string'
          ? rootClassName
          : rootClassName?.(maxHeight)
      }
      ref={ref}
      onClick={onClick}
    >
      <div ref={contentRef} className={childrenClassName}>
        {children}
      </div>
    </div>
  );
});

export const PositionContainer = observer(Container);
