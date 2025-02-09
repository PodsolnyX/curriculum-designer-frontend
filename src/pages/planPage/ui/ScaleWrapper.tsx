import React from "react";
import {CursorMode} from "@/pages/planPage/provider/types.ts";
import {TransformWrapper} from "react-zoom-pan-pinch";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";

const ScaleWrapper = ({children}: React.PropsWithChildren) => {

    const {toolsOptions} = usePlan();

    // const [position, setPosition] = useState({ x: 0, y: 0 });
    // const [isPanning, setIsPanning] = useState(false);
    // const sensitivity = 50; // Насколько близко к краю начинается панорамирование
    // const panSpeed = 10; // Скорость панорамирования
    // const requestRef = useRef<number | null>(null);
    // const minX = 0, maxX = 100; // Ограничения по X
    // const minY = 100, maxY = 200; // Ограничения по Y
    //
    // useEffect(() => {
    //     setPosition({x: 0, y: 0});
    // }, [activeItemId]);
    //
    // useEffect(() => {
    //     const handleMouseMove = (event: MouseEvent) => {
    //         if (!activeItemId) return;
    //         const { clientX, clientY } = event;
    //         const { innerWidth, innerHeight } = window;
    //
    //         let deltaX = 0, deltaY = 0;
    //
    //         // Проверяем, достиг ли курсор границы окна
    //         if (clientX < sensitivity) deltaX = panSpeed;
    //         if (clientX > innerWidth - sensitivity) deltaX = -panSpeed;
    //         if (clientY < sensitivity) deltaY = panSpeed;
    //         if (clientY > innerHeight - sensitivity) deltaY = -panSpeed;
    //
    //         if (deltaX !== 0 || deltaY !== 0) {
    //             setPosition((prev) => ({
    //                 x: prev.x + deltaX,
    //                 y: prev.y + deltaY,
    //             }));
    //             setIsPanning(true);
    //         } else {
    //             setIsPanning(false);
    //         }
    //     };
    //
    //     window.addEventListener("mousemove", handleMouseMove);
    //     return () => window.removeEventListener("mousemove", handleMouseMove);
    // }, [activeItemId]);
    //
    // useEffect(() => {
    //     let actionInterval;
    //     if (isPanning) {
    //         // Запускаем интервал для выполнения действия каждые 100 мс
    //         actionInterval = setInterval(() => console.log("Панорамирование"), 100);
    //     } else {
    //         clearInterval(actionInterval); // Очищаем интервал, если курсор не рядом с границей
    //     }
    //
    //     return () => clearInterval(actionInterval); // Очистка интервала при размонтировании
    // }, [isPanning]);
    //
    // useEffect(() => {
    //     const animate = () => {
    //         if (isPanning) {
    //             requestRef.current = requestAnimationFrame(animate);
    //         }
    //     };
    //
    //     if (isPanning) {
    //         requestRef.current = requestAnimationFrame(animate);
    //     } else if (requestRef.current) {
    //         cancelAnimationFrame(requestRef.current);
    //     }
    // }, [isPanning]);

    return (
        <TransformWrapper
            minScale={.3}
            maxScale={1.5}
            initialScale={1}
            limitToBounds={true}
            disablePadding={true}
            panning={{
                allowLeftClickPan: toolsOptions.cursorMode === CursorMode.Hand,
            }}
        >

            {() => {
                // useEffect(() => {
                //     if (isPanning && activeItemId) {
                //         setTransform(position.x, position.y, instance.transformState.scale, 200);
                //     }
                // }, [position, isPanning, setTransform, instance]);

                return (children);
            }}
        </TransformWrapper>
    )
}

export default ScaleWrapper;