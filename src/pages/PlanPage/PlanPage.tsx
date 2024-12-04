import {SemestersMocks} from "@/pages/PlanPage/mocks.ts";
import type {DragEndEvent, DragOverEvent, DragStartEvent,} from '@dnd-kit/core';
import {
    defaultDropAnimationSideEffects,
    DndContext,
    DragOverlay, DropAnimation,
    KeyboardSensor, MeasuringConfiguration, MeasuringStrategy,
    PointerSensor, UniqueIdentifier,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {arrayMove, sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import React, {useState} from "react";
import {SemesterField} from "@/pages/PlanPage/ui/SemesterField/SemesterField.tsx";
import {CSS} from "@dnd-kit/utilities";
import pageStyles from "@/pages/PlanPage/ui/SubjectCard/SubjectCard.module.scss";
import {SubjectCard} from "@/pages/PlanPage/ui/SubjectCard/SubjectCard.tsx";
import {Semester} from "@/pages/PlanPage/types/Semester.ts";
import {PlanProvider} from "@/pages/PlanPage/provider/PlanProvider.tsx";
import {Popover} from "antd";
import DisplaySettingsPopover from "@/pages/PlanPage/ui/DisplaySettingsPopover.tsx";

const keys = ["subjects", "selections", "semesters"];

const PlanPageWrapped = () => {

    const [semesters, setSemesters] = useState<Semester[]>(SemestersMocks);
    const [activeOverId, setActiveOverId] = useState<UniqueIdentifier | null>(null)

    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    function resetAllActiveIds() {
        setActiveId(null);
        setActiveOverId(null);
    }

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const { id } = active;

        setActiveId(id);
    }

    function handleDragOver(event: DragOverEvent) {

        if (!event.over) return;
        const { id: overId } = event.over;

        setActiveOverId(overId);
    }

    const getParentsIdsByChildId = (id: UniqueIdentifier): UniqueIdentifier[] => {

        let parentIds: (UniqueIdentifier)[] = [];

        const checkKeys = (obj: any) => {
            return keys.some(key => Object.keys(obj).includes(key));
        }
        const findParentIdActiveItem = (item: any): boolean => {
            for (let key of keys) {
                if (Array.isArray(item[key])) {
                    if (item[key].find(item => item.id === id)) {
                        parentIds.unshift(id);
                        item.id && parentIds.unshift(item.id);
                        return true;
                    }
                    else {
                        for (let subItem of item[key]) {
                            if (checkKeys(subItem) && findParentIdActiveItem(subItem)) {
                                item.id && parentIds.unshift(item.id);
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        };

        findParentIdActiveItem({semesters})

        return parentIds;
    }

    const getItemTypeById = (id: UniqueIdentifier): string => {
        const type = String(id).split("-")[0];
        return keys.includes(type) ? type : "";
    }

    const onDragEndNextGen = (event: DragEndEvent) => {
        if (!event.active?.id || !event?.over?.id) return;

        const parentsIdsActive = getParentsIdsByChildId(event.active.id);
        const parentsIdsOver = getParentsIdsByChildId(event.over.id);

        const updateSemesters = JSON.parse(JSON.stringify(semesters));

        let activeSubject;

        const removeSubjectFromParents = (item: any, currentDeep: number) => {
            const type = getItemTypeById(parentsIdsActive[currentDeep]);
            if (!type)
                item.subjects = item.subjects.filter(item => {
                    if (item.id !== parentsIdsActive[currentDeep]) return true
                    else {
                        activeSubject = item;
                        return false;
                    }
                })
            else {
                const subItem = item[type].find(_item => _item.id === parentsIdsActive[currentDeep])
                removeSubjectFromParents(subItem, currentDeep + 1);
            }
        }

        const addSubjectToNewParents = (item: any, currentDeep: number) => {
            const type = getItemTypeById(parentsIdsOver[currentDeep]);
            if (!type)
                item.subjects.splice(item.subjects.findIndex(_item => _item.id === parentsIdsOver[currentDeep]), 0, activeSubject)
            else if (currentDeep === parentsIdsOver.length) {
                item.subjects = [...item.subjects, activeSubject]
            }
            else {
                const subItem = item[type].find(_item => _item.id === parentsIdsOver[currentDeep])
                addSubjectToNewParents(subItem, currentDeep + 1);
            }
        }

        // arrayMove(semester.subjects, activeSubjectIndex, overSubjectIndex)

        removeSubjectFromParents({semesters: updateSemesters}, 0)
        addSubjectToNewParents({semesters: updateSemesters}, 0)

        setSemesters(JSON.parse(JSON.stringify(updateSemesters)))
        resetAllActiveIds()
    }

    return (
        <div className={"flex flex-col bg-stone-100 relative pt-12 h-screen overflow-auto"}>
            <header className={"fixed left-0 top-0 p-3 bg-white/[0.7] backdrop-blur z-50 shadow-md flex justify-end max-w-screen w-full"}>
                <Popover content={DisplaySettingsPopover} title="Настройки отображения" trigger="click" placement={"bottomLeft"}>
                    <span className={"cursor-pointer"}>
                        Отображение
                    </span>
                </Popover>
            </header>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                // onDragEnd={handleDragEnd}
                onDragEnd={onDragEndNextGen}
                measuring={measuring}
            >
                {
                    semesters.map(semester =>
                        <SemesterField
                            {...semester}
                            activeId={activeId}
                            activeOverId={activeOverId}
                            key={semester.id}
                        />
                    )
                }

                <DragOverlay dropAnimation={dropAnimation}>
                    {
                        activeId !== null
                            ? <SubjectCard
                                id={activeId}
                            />
                            : null
                    }
                </DragOverlay>
            </DndContext>
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

const PlanPage = () => {
    return (
        <PlanProvider>
            <PlanPageWrapped/>
        </PlanProvider>
    )
};

export default PlanPage;