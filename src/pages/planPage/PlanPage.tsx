import {
    defaultDropAnimationSideEffects,
    DndContext,
    DragOverlay, DropAnimation,
    KeyboardSensor, MeasuringConfiguration, MeasuringStrategy,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { Scrollbars } from 'react-custom-scrollbars';
import {sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {SemesterField} from "@/pages/planPage/ui/SemesterField/SemesterField.tsx";
import {CSS} from "@dnd-kit/utilities";
import pageStyles from "@/pages/planPage/ui/SubjectCard/SubjectCard.module.scss";
import {SubjectCard} from "@/pages/planPage/ui/SubjectCard/SubjectCard.tsx";
import {PlanProvider, usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import Sidebar from "@/pages/planPage/ui/Sidebar/Sidebar.tsx";
import PageLoader from "@/shared/ui/PageLoader/PageLoader.tsx";
import PlanHeader from "@/pages/planPage/ui/Header/PlanHeader.tsx";

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

    return (
        <div className={"flex flex-col bg-stone-100 relative"}>
            <PageLoader loading={loadingPlan}/>
            <PlanHeader/>
            <div className={"flex"}>
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                    measuring={measuring}
                >
                    <Scrollbars
                        style={{height: "calc(100vh - 62px)", width: "calc(100vw)"}}
                    >
                        <div className={"flex flex-col w-max h-full"}>
                            {
                                semesters.map(semester =>
                                    <SemesterField {...semester} key={semester.id}/>
                                )
                            }
                        </div>
                    </Scrollbars>
                    <DragOverlay dropAnimation={dropAnimation}>
                        { activeItemId ? <SubjectCard id={activeItemId} {...activeSubject}/> : null }
                    </DragOverlay>
                </DndContext>
                <Sidebar/>
            </div>
        </div>
    )
}

const measuring: MeasuringConfiguration = {
    droppable: {
        strategy: MeasuringStrategy.Always,
    },
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