import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode, useCallback, CSSProperties, useMemo,
} from 'react';

interface PositionsContextProps {
    heights: Record<string, Record<string, number>>;
    updateHeight: (rowId: string, containerId: string, height: number) => void;
    updateHorizontalCoordinate: (rowId: string, containerId: string, width: number) => void;
    getMaxHeight: (rowId: string) => number;
    getHorizontalCoordinate: (rowId: string, containerId: string) => number;
    getTopCoordinate: (rowId: string) => number;
}

const PositionsContext = createContext<PositionsContextProps>({
    heights: {},
    updateHeight: () => {},
    getMaxHeight: () => 0,
    getTopCoordinate: () => 0,
    updateHorizontalCoordinate: () => {},
    getHorizontalCoordinate: () => 0,
});

export const PositionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [heights, setHeights] = useState<Record<string, Record<string, number>>>({});
    const [horizontalCoordinates, setHorizontalCoordinates] = useState<Record<string, Record<string, number>>>({});

    const updateHeight = useCallback((rowId: string, containerId: string, height: number) => {

        const currentHeight = heights[rowId]?.[containerId];
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

    const updateHorizontalCoordinate = useCallback((rowId: string, containerId: string, width: number) => {
        setHorizontalCoordinates(prev => {

            return {
                ...prev,
                [rowId]: {
                    ...(prev[rowId] || {}),
                    [containerId]: width,
                },
            };
        });
    }, []);

    const getMaxHeight = useCallback((rowId: string) => {
        const rowHeights = heights[rowId] || {};
        return Object.values(rowHeights).reduce((max, h) => Math.max(max, h), 0);
    }, [heights]);

    const getHorizontalCoordinate = useCallback((rowId: string, containerId: string) => {

        const gap = 40;
        let totalCoordinate = 20;
        const currentCoordinates = horizontalCoordinates[rowId] || {};

        const findModuleFirstEntry = (_containerId: string) => {

            for (const rowId of Object.keys(horizontalCoordinates)) {
                const rowData = horizontalCoordinates[rowId];
                if (rowData && _containerId in rowData) {
                    const idsList = Object.keys(rowData);
                    if (idsList.indexOf(_containerId) === 0) {
                        return rowData[_containerId] + gap;
                    }
                    else {
                        return findModuleFirstEntry(idsList[idsList.indexOf(_containerId) - 1]) + rowData[_containerId] + gap;
                    }
                }
            }
        }

        const coordinatesList = Object.entries(currentCoordinates);

        if (
            coordinatesList.length &&
            coordinatesList[0][0] &&
            coordinatesList[0][0] !== containerId &&
            coordinatesList[coordinatesList.findIndex(cord => cord[0] === containerId) - 1]
        ) {
            totalCoordinate += findModuleFirstEntry(
                coordinatesList[coordinatesList.findIndex(cord => cord[0] === containerId) - 1][0]
            )
        }

        return totalCoordinate;
    }, [horizontalCoordinates]);

    const getTopCoordinate = useCallback((rowId: string) => {
        let totalCoordinate = 0;
        const rowIds = Object.keys(heights);
        for (const currentRowId of rowIds) {
            if (currentRowId === rowId) break;
            totalCoordinate += getMaxHeight(currentRowId);
        }
        return totalCoordinate;
    }, [heights, getMaxHeight]);

    const value: PositionsContextProps = {
        heights,
        updateHeight,
        getMaxHeight,
        getTopCoordinate,
        updateHorizontalCoordinate,
        getHorizontalCoordinate
    };

    return (
        <PositionsContext.Provider value={value}>
            {children}
        </PositionsContext.Provider>
    );
};

export const usePositions = () => useContext(PositionsContext);

interface ContainerProps {
    rowId: string;
    id: string;
    children: ReactNode;
    rootClassName?: string | ((height: number) => string);
    rootStyles?: CSSProperties | ((height: number) => CSSProperties);
    countHorizontalCoordinates?: boolean;
    countHeights?: boolean;
    childrenClassName?: string;
}


export const PositionContainer = (props: ContainerProps) => {
    const {
        rowId,
        id,
        children,
        rootClassName,
        countHorizontalCoordinates,
        rootStyles,
        countHeights = true,
        childrenClassName
    } = props;

    const contentRef = useRef<HTMLDivElement | null>(null);
    const { updateHeight, getMaxHeight, updateHorizontalCoordinate } = usePositions();
    const maxHeight = getMaxHeight(rowId);

    useEffect(() => {
        const element = contentRef.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver(([entry]) => {
            if (entry) {
                const height = entry.contentRect.height;
                countHeights && updateHeight(rowId, id, height);
                countHorizontalCoordinates && updateHorizontalCoordinate(rowId, id, entry.contentRect.width);
            }
        });

        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, [rowId, id, updateHeight, updateHorizontalCoordinate]);

    const styles = useMemo(() => {
        let defaultStyles: CSSProperties = {
            height: maxHeight || 'auto'
        }
        if (typeof(rootStyles) === "function") defaultStyles = rootStyles(maxHeight)
        else if (typeof(rootStyles) === "object") defaultStyles = rootStyles;
        return defaultStyles;
    }, [maxHeight, rootStyles])

    return (
        <div
            style={styles}
            className={typeof(rootClassName) === "string" ? rootClassName : rootClassName?.(maxHeight)}
        >
            <div ref={contentRef} className={childrenClassName}>
                {children}
            </div>
        </div>
    );
};