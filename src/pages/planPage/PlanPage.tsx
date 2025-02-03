import {
    defaultDropAnimationSideEffects,
    DndContext,
    DragOverlay,
    DropAnimation,
    KeyboardSensor,
    PointerSensor,
    pointerWithin,
    rectIntersection,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {SemesterField} from "@/pages/planPage/ui/SemesterField/SemesterField.tsx";
import {CSS} from "@dnd-kit/utilities";
import pageStyles from "@/pages/planPage/ui/SubjectCard/SubjectCard.module.scss";
import {SubjectCard} from "@/pages/planPage/ui/SubjectCard/SubjectCard.tsx";
import {PlanProvider, usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import Sidebar from "@/pages/planPage/ui/Sidebar/Sidebar.tsx";
import PageLoader from "@/shared/ui/PageLoader/PageLoader.tsx";
import PlanHeader from "@/pages/planPage/ui/Header/PlanHeader.tsx";
import {TransformComponent, TransformWrapper, useTransformContext} from "react-zoom-pan-pinch";
import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {CursorMode} from "@/pages/planPage/provider/types.ts";

const PlanPageWrapped = () => {

    const {
        semesters,
        loadingPlan,
        toolsOptions,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleDragCancel
    } = usePlan();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const [subjectsContainerWidth, setSubjectsContainerWidth] = useState(50);

    return (
        <div className={"flex flex-col bg-stone-100 relative"}>
            <PageLoader loading={loadingPlan}/>
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
                <PlanHeader/>
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                    collisionDetection={(args) => {
                        const pointerCollisions = pointerWithin(args);
                        if (pointerCollisions.length > 0) return pointerCollisions;
                        return rectIntersection(args);
                    }}
                >
                    <div className={"flex"}>
                        <TransformComponent wrapperStyle={{ height: 'calc(100vh - 64px)', width: '100vw', cursor: toolsOptions.cursorMode === CursorMode.Hand ? "grab" : "auto" }}>
                            <div className={`flex flex-col w-max ${toolsOptions.cursorMode === CursorMode.Hand ? "pointer-events-none" : "pointer-events-auto"}`}>
                                {
                                    !loadingPlan &&
                                    semesters.map(semester =>
                                        <SemesterField {...semester} key={semester.id}
                                                        subjectsContainerWidth={subjectsContainerWidth}
                                                       setSubjectsContainerWidth={(width) => setSubjectsContainerWidth(width)}
                                        />
                                    )
                                }
                            </div>
                            <Overlay/>
                        </TransformComponent>
                        <Sidebar/>
                    </div>
                </DndContext>
            </TransformWrapper>

        </div>
    )
}

const Overlay = () => {

    const { activeItemId } = usePlan();

    const DraggableCard = () => {

        const [coords, setCoords] = useState({x: 0, y: 0});
        const {transformState} = useTransformContext();

        useEffect(() => {
            const handleWindowMouseMove = event => {
                setCoords({
                    x: event.clientX,
                    y: event.clientY,
                });
            };

            window.addEventListener('mousemove', handleWindowMouseMove);

            return () => {
                window.removeEventListener(
                    'mousemove',
                    handleWindowMouseMove,
                );
            };
        }, []);

        return (
            <SubjectCard
                id={activeItemId || ""}
                style={{
                    position: "absolute",
                    left: (coords.x),
                    top: (coords.y),
                }}
            />
        )
    }

    return (
        createPortal(
            <DragOverlay dropAnimation={dropAnimation}>
                { activeItemId ? <DraggableCard/> : null }
            </DragOverlay>,
            document.body,
        )
    );
};

const dropAnimation: DropAnimation = {
    keyframes({transform}) {
        return [
            {transform: CSS.Transform.toString(transform.initial)},
            {
                transform: CSS.Transform.toString({
                    scaleX: 1,
                    scaleY: 1,
                    x: transform.final.x,
                    y: transform.final.y
                }),
            },
        ];
    },
    sideEffects: defaultDropAnimationSideEffects({
        className: {
            active: pageStyles.active,
        },
    }),
} as DropAnimation;

function removeTimestamps(text) {
    // Regular expression to match time formats like 20:54, 0:15, 1:03:24, etc.
    const timeRegex = /\b(?:\d{1,2}:){1,2}\d{2}\b/g;
    // Replace all matches with an empty string
    return text.replace(timeRegex, '').trim();
}

const PlanPage = () => {
    return (
        <PlanProvider>
            <PlanPageWrapped/>
        </PlanProvider>
    )
};

export default PlanPage;