import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode, useCallback,
} from 'react';

interface PositionsContextProps {
    heights: Record<string, Record<string, number>>;
    updateHeight: (rowId: string, containerId: string, height: number) => void;
    getMaxHeight: (rowId: string) => number;
    getTopCoordinate: (rowId: string) => number;
}

const PositionsContext = createContext<PositionsContextProps>({
    heights: {},
    updateHeight: () => {},
    getMaxHeight: () => 0,
    getTopCoordinate: () => 0,
});

export const PositionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [heights, setHeights] = useState<Record<string, Record<string, number>>>({});

    const updateHeight = useCallback((rowId: string, containerId: string, height: number) => {

        const currentHeight = height[rowId]?.[containerId];
        if (currentHeight === height) return

        setHeights(prev => {
            return {
                ...prev,
                [rowId]: {
                    ...(prev[rowId] || {}),
                    [containerId]: height,
                },
            };
        });
    }, []);

    const getMaxHeight = useCallback((rowId: string) => {
        const rowHeights = heights[rowId] || {};
        return Object.values(rowHeights).reduce((max, h) => Math.max(max, h), 0);
    }, [heights]);

    const getTopCoordinate = useCallback((rowId: string) => {
        let totalCoordinate = 0;
        const rowIds = Object.keys(heights);
        for (const currentRowId of rowIds) {
            if (currentRowId === rowId) break;
            totalCoordinate += getMaxHeight(currentRowId);
        }
        return totalCoordinate;
    }, [heights, getMaxHeight]);

    console.log(heights)

    return (
        <PositionsContext.Provider value={{ heights, updateHeight, getMaxHeight, getTopCoordinate }}>
            {children}
        </PositionsContext.Provider>
    );
};

export const usePositions = () => useContext(PositionsContext);

interface ContainerProps {
    rowId: string;
    id: string;
    children: ReactNode;
    rootClassName?: string
}

export const Container: React.FC<ContainerProps> = ({ rowId, id, children, rootClassName  }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { updateHeight, getMaxHeight } = usePositions();
    const maxHeight = getMaxHeight(rowId);

    useEffect(() => {
        const element = contentRef.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver(([entry]) => {
            if (entry) {
                const height = entry.contentRect.height;
                updateHeight(rowId, id, height);
            }
        });

        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, [rowId, id, updateHeight]);

    return (
        <div style={{ height: maxHeight || 'auto'}} className={rootClassName}>
            <div ref={contentRef}>{children}</div>
        </div>
    );
};