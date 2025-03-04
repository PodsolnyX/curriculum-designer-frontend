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
import {TransformComponent, useTransformContext} from "react-zoom-pan-pinch";
import React, {useEffect, useMemo, useState} from "react";
import {createPortal} from "react-dom";
import {CursorMode} from "@/pages/planPage/provider/types.ts";
import ScaleWrapper from "@/pages/planPage/ui/ScaleWrapper.tsx";
import ModuleArea from "@/pages/planPage/ui/ModuleField/ModuleArea.tsx";
import {PositionsProvider} from "@/pages/planPage/provider/PositionsProvider.tsx";
import {concatIds, getIdFromPrefix, setPrefixToId} from "@/pages/planPage/provider/prefixIdHelpers.ts";

const PlanPageWrapped = () => {

    const {
        semesters,
        loadingPlan,
        toolsOptions,
        modulesList,
        atomList,
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
            <ScaleWrapper>
                {!loadingPlan && <PlanHeader/> }
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
                    <div className={"flex relative"}>
                        <PositionsProvider>
                            <TransformComponent wrapperStyle={{ height: 'calc(100vh - 64px)', width: '100vw', cursor: toolsOptions.cursorMode === CursorMode.Hand ? "grab" : "auto" }}>
                                <div className={`flex flex-col pb-10 w-max ${toolsOptions.cursorMode === CursorMode.Hand ? "pointer-events-none" : "pointer-events-auto"}`}>
                                    {
                                        semesters.map(semester =>
                                            <SemesterField {...semester} key={semester.id}
                                                           subjectsContainerWidth={subjectsContainerWidth}
                                                           setSubjectsContainerWidth={(width) => setSubjectsContainerWidth(width)}
                                                           atomsIds={atomList
                                                               .filter(atom => !atom.parentModuleId && atom.semesters.some(atomSemester => atomSemester.semester.id === semester.id))
                                                                   .map(atom => concatIds(setPrefixToId(semester.id, "semesters"), setPrefixToId(atom.id, "subjects")))
                                                               || []
                                            }
                                            />
                                        )
                                    }
                                </div>
                                <div
                                    className={"h-full absolute"}
                                    style={{left: `${subjectsContainerWidth + 0.2}%`, width: `${100 - subjectsContainerWidth - 0.2}%`}}
                                >
                                    {
                                        atomList &&
                                        modulesList
                                            .filter(module => module.parentModuleId === null)
                                            .sort((a, b) =>
                                                (a?.semesters && b?.semesters && !!a.semesters[0] && !!b.semesters[0]) ? (a.semesters[0].semester.number - b.semesters[0].semester.number) : 0
                                            )
                                            // .sort((a, b) => b.semesters.length - a.semesters.length)
                                            .map((module, index) => <ModuleArea {...module} key={module.id}/>)
                                    }
                                </div>
                                <Overlay/>
                            </TransformComponent>
                        </PositionsProvider>
                        <Sidebar/>
                    </div>
                </DndContext>
            </ScaleWrapper>
        </div>
    )
}

const DraggableCard = React.memo(({ activeItemId, scale }: {scale: number, activeItemId: string}) => {

    const { getAtom } = usePlan();

    const atomInfo = useMemo(() => {
        return getAtom(Number(getIdFromPrefix(activeItemId)))
    }, [activeItemId, getAtom])

    if (!atomInfo) return null;

    return (
        <SubjectCard
            {...atomInfo}
            id={activeItemId as string}
            style={{ transform: `scale(${scale})` }}
        />
    );
});

const Overlay = () => {
    const { activeItemId } = usePlan();
    const { transformState } = useTransformContext();
    const scale = transformState.scale;
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    useEffect(() => {
        let animationFrameId = null;

        const handleMouseMove = (event) => {
            if (event.clientX !== 0 && event.clientY !== 0) {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
                animationFrameId = requestAnimationFrame(() => {
                    setCoords({ x: event.clientX, y: event.clientY });
                });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    const overlayStyle: React.CSSProperties = useMemo(
        () => ({
            position: "fixed",
            transform: "translate(-70%, -70%)",
            left: coords.x,
            top: coords.y,
        }),
        [coords]
    );

    return createPortal(
        <DragOverlay dropAnimation={dropAnimation} style={overlayStyle}>
            {activeItemId ? <DraggableCard activeItemId={activeItemId as string} scale={scale} /> : null}
        </DragOverlay>,
        document.body
    );
};

const dropAnimation: DropAnimation = {
    keyframes({transform}) {
        return [
            {
                transform: CSS.Transform.toString(transform.initial)
            },
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

const PlanPage = () => {
    return (
        <PlanProvider>
            <PlanPageWrapped/>
        </PlanProvider>
    )
};

export default PlanPage;