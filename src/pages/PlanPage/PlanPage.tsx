import {
    defaultDropAnimationSideEffects,
    DndContext,
    DragOverlay, DropAnimation,
    KeyboardSensor, MeasuringConfiguration, MeasuringStrategy,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {SemesterField} from "@/pages/PlanPage/ui/SemesterField/SemesterField.tsx";
import {CSS} from "@dnd-kit/utilities";
import pageStyles from "@/pages/PlanPage/ui/SubjectCard/SubjectCard.module.scss";
import {SubjectCard} from "@/pages/PlanPage/ui/SubjectCard/SubjectCard.tsx";
import {PlanProvider, usePlan} from "@/pages/PlanPage/provider/PlanProvider.tsx";
import {Button, Popover} from "antd";
import DisplaySettingsPopover from "@/pages/PlanPage/ui/DisplaySettingsPopover.tsx";
import ToolsPanel from "@/pages/PlanPage/ui/ToolsPanel/ToolsPanel.tsx";
import Sidebar from "@/pages/PlanPage/ui/Sidebar/Sidebar.tsx";
import {getRouteMain, getRoutePlanTitle} from "@/shared/const/router.ts";
import {Link, useParams} from "react-router-dom";

const PlanPageWrapped = () => {

    const {
        semesters,
        activeItemId,
        activeSubject,
        handleDragStart,
        handleDragOver,
        handleDragEnd
    } = usePlan();

    const {id} = useParams<{id: string | number}>();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    return (
        <div className={"flex flex-col bg-stone-100 relative pt-12 h-screen overflow-auto"}>
            <header className={"fixed left-0 top-0 p-3 py-1 bg-white/[0.7] backdrop-blur z-50 shadow-md flex items-center gap-5 max-w-screen w-full"}>
                <Link to={getRoutePlanTitle(id || "")}>Титул</Link>
                <Popover
                    content={DisplaySettingsPopover}
                    title={"Настройки отображения"}
                    trigger={"click"}
                    placement={"bottomLeft"}
                >
                    <span className={"cursor-pointer"}>
                        Отображение
                    </span>
                </Popover>
                <ToolsPanel/>
            </header>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                measuring={measuring}
            >
                <div className={"flex flex-col min-w-[1500px]"}>
                    {
                        semesters.map(semester =>
                            <SemesterField {...semester} key={semester.id}/>
                        )
                    }
                </div>
                <DragOverlay dropAnimation={dropAnimation}>
                    { activeItemId ? <SubjectCard id={activeItemId} {...activeSubject}/> : null }
                </DragOverlay>
            </DndContext>
            <Sidebar/>
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