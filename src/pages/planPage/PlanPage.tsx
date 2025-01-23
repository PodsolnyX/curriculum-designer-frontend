import {
    defaultDropAnimationSideEffects,
    DndContext, DragMoveEvent,
    DragOverlay, DropAnimation,
    KeyboardSensor,
    PointerSensor, pointerWithin, rectIntersection,
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

const PlanPageWrapped = () => {

    const {
        semesters,
        activeItemId,
        activeSubject,
        loadingPlan,
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

    const [pos, setPos] = useState<{x: number, y: number}>({x: 0, y: 0});

    const handleDragMove = (event: DragMoveEvent) => {
        const { delta, activatorEvent, cl } = event;

        // console.log((activatorEvent?.clientX + delta.x) / , activatorEvent?.clientY + delta.y)

        // const cursorX = activatorEvent.clientX;
        // const cursorY = activatorEvent.clientY;
        //
        // // Учитываем масштаб
        // setOverlayPosition({
        //     x: cursorX / scale,
        //     y: cursorY / scale,
        // });
    };

    return (
        <div className={"flex flex-col bg-stone-100 relative"}>
            <PageLoader loading={loadingPlan}/>
            <PlanHeader/>
            <TransformWrapper
                minScale={.5}
                maxScale={1}
                initialScale={1}
                limitToBounds={true}
                disablePadding={true}
                panning={{
                    allowLeftClickPan: false,
                }}
            >
                {
                    ({instance}) => {

                        const {scale, positionY, positionX} = instance.transformState;

                        return (
                            <DndContext
                                sensors={sensors}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDragEnd={handleDragEnd}
                                onDragCancel={handleDragCancel}
                                // modifiers={[(args) => {
                                //     console.log(args, args.transform.y, positionX, positionY);
                                //     return {
                                //         ...args.transform,
                                //         x: (args.transform.x - positionX ) / scale ,
                                //         y: (args.transform.y - positionY ) / scale,
                                //     }
                                // }]}
                                collisionDetection={(args) => {
                                    const pointerCollisions = pointerWithin(args);
                                    if (pointerCollisions.length > 0) return pointerCollisions;
                                    return rectIntersection(args);
                                }}
                            >
                                <div className={"flex"}>
                                    <TransformComponent
                                        // contentClass={"flex absolute"}
                                        wrapperStyle={{ height: 'calc(100vh - 64px)', width: '100vw' }}
                                    >

                                        {/*<Scrollbars*/}
                                        {/*    style={{height: "calc(100vh - 62px)", width: "calc(100vw)"}}*/}
                                        {/*>*/}
                                        <div className={"flex flex-col w-max"} >
                                            {
                                                semesters.map(semester =>
                                                    <SemesterField {...semester} key={semester.id}/>
                                                )
                                            }
                                        </div>
                                        <Overlay/>
                                        {/*</Scrollbars>*/}
                                        {/*<DragOverlay dropAnimation={dropAnimation}>*/}
                                        {/*    /!*{ activeItemId ?*!/*/}
                                        {/*    /!*    // <div style={{position: "absolute", left: pos.x, top: pos.y}} className={"h-36 w-36 bg-red-700"}>*!/*/}
                                        {/*    /!*    //*!/*/}
                                        {/*    /!*    // </div>*!/*/}
                                        {/*    /!*    <SubjectCard*!/*/}
                                        {/*    /!*        id={activeItemId}*!/*/}
                                        {/*    /!*        {...activeSubject}*!/*/}
                                        {/*    /!*        style={{*!/*/}
                                        {/*    /!*            position: "absolute",*!/*/}
                                        {/*    /!*            transform: CSS.Translate.toString({*!/*/}
                                        {/*    /!*                x: pos.x,*!/*/}
                                        {/*    /!*                y: pos.y,*!/*/}
                                        {/*    /!*                scaleY: 1,*!/*/}
                                        {/*    /!*                scaleX: 1,*!/*/}
                                        {/*    /!*            })*!/*/}
                                        {/*    /!*        }}*!/*/}
                                        {/*    /!*    />*!/*/}
                                        {/*    /!*    : null*!/*/}
                                        {/*    /!*}*!/*/}
                                        {/*    {*/}
                                        {/*        activeItemId ?*/}
                                        {/*        createPortal(*/}
                                        {/*        <DragOverlay style={{*/}
                                        {/*            position: "absolute",*/}
                                        {/*            left: 500,*/}
                                        {/*            top: 300,*/}
                                        {/*        }}>*/}
                                        {/*            <SubjectCard*/}
                                        {/*                    id={activeItemId}*/}
                                        {/*                    {...activeSubject}*/}
                                        {/*                    // style={{*/}
                                        {/*                    //     position: "absolute",*/}
                                        {/*                    //     transform: CSS.Translate.toString({*/}
                                        {/*                    //         x: pos.x,*/}
                                        {/*                    //         y: pos.y,*/}
                                        {/*                    //         scaleY: 1,*/}
                                        {/*                    //         scaleX: 1,*/}
                                        {/*                    //     })*/}
                                        {/*                    // }}*/}
                                        {/*                />*/}
                                        {/*        </DragOverlay>,*/}
                                        {/*        document.body,*/}
                                        {/*    ) : null}*/}
                                        {/*    /!*{ activeItemId ?*!/*/}
                                        {/*    /!*    // <div style={{position: "absolute", left: pos.x, top: pos.y}} className={"h-36 w-36 bg-red-700"}>*!/*/}
                                        {/*    /!*    //*!/*/}
                                        {/*    /!*    // </div>*!/*/}
                                        {/*    /!*    <SubjectCard*!/*/}
                                        {/*    /!*        id={activeItemId}*!/*/}
                                        {/*    /!*        {...activeSubject}*!/*/}
                                        {/*    /!*        style={{*!/*/}
                                        {/*    /!*            position: "absolute",*!/*/}
                                        {/*    /!*            transform: CSS.Translate.toString({*!/*/}
                                        {/*    /!*                x: pos.x,*!/*/}
                                        {/*    /!*                y: pos.y,*!/*/}
                                        {/*    /!*                scaleY: 1,*!/*/}
                                        {/*    /!*                scaleX: 1,*!/*/}
                                        {/*    /!*            })*!/*/}
                                        {/*    /!*        }}*!/*/}
                                        {/*    /!*    />*!/*/}
                                        {/*    /!*    : null*!/*/}
                                        {/*    /!*}*!/*/}
                                        {/*</DragOverlay>*/}

                                    </TransformComponent>
                                    <Sidebar/>
                                </div>
                            </DndContext>
                        )
                    }
                }
            </TransformWrapper>

        </div>
    )
}

const Overlay = () => {
    const [coords, setCoords] = useState({x: 0, y: 0});
    const {transformState} = useTransformContext();
    const {
        activeItemId
    } = usePlan();

    const {scale, positionY, positionX} = transformState;

    useEffect(() => {
        const handleWindowMouseMove = event => {
            setCoords({
                x: event.clientX,
                y: event.clientY,
            });
        };

        if (!activeItemId) return;

        window.addEventListener('mousemove', handleWindowMouseMove);

        return () => {
            window.removeEventListener(
                'mousemove',
                handleWindowMouseMove,
            );
        };
    }, [activeItemId]);

    console.log(coords)

    return (
        createPortal(
            <DragOverlay
                dropAnimation={dropAnimation}

            >
                {
                    activeItemId ?
                        <SubjectCard
                            id={activeItemId}
                            style={{
                                position: "absolute",
                                left: (coords.x),
                                top: (coords.y),
                                // transform: `scale(${scale})`,
                            }}
                            // {...activeSubject}
                            // style={{
                            //     position: "absolute",
                            //     transform: CSS.Translate.toString({
                            //         x: pos.x,
                            //         y: pos.y,
                            //         scaleY: 1,
                            //         scaleX: 1,
                            //     })
                            // }}
                        />
                        : null
                }
            </DragOverlay>,
            document.body,
        )
    );
};

// const measuring: MeasuringConfiguration = {
//     droppable: {
//         strategy: MeasuringStrategy.WhileDragging,
//     },
// };


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