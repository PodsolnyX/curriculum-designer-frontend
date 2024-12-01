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

    function getSemesterIndex(subjectId: UniqueIdentifier): number | undefined {
        return semesters.findIndex(semester =>
            semester.subjects.find(subject => subject.id === subjectId)
        );
    }

    const isSemesterId = (id: string) => {
        return id.split("-")[0] === "semester";
    }

    const isSelectionId = (id: string) => {
        return id.split("-")[0] === "selection";
    }

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const { id } = active;

        setActiveId(id);
    }

    function resetAllActiveIds() {
        setActiveId(null);
        setActiveOverId(null);
    }

    function handleDragOver(event: DragOverEvent) {

        console.log(event)

        if (!event.over) return;
        const { id: overId } = event.over;

        setActiveOverId(overId);
    }

    function handleDragEndSubjectToSemester({active, over}: DragEndEvent) {

        const { id: activeId } = active;
        const { id: overId } = over;

        const activeSemesterIndex = getSemesterIndex(activeId);

        if (semesters.find(semester => semester.id === overId).subjects.find(subject => subject.id === activeId)) {
            resetAllActiveIds()
            return;
        }
        else {
            const activeSubjectIndex = semesters[activeSemesterIndex].subjects.findIndex(subject => subject.id === activeId);
            const overSemesterIndex = semesters.findIndex(semester => semester.id === overId);
            let updateSemesters = [...semesters];

            updateSemesters = updateSemesters.map((semester, index) =>
                index !== activeSemesterIndex ? semester :
                    {
                        ...semester,
                        subjects: semester.subjects.filter((subject, _index) =>
                            _index !== activeSubjectIndex
                        )
                    }
            );

            updateSemesters = updateSemesters.map((semester, index) => {
                if (index !== overSemesterIndex) return semester;
                const subjects = [...semester.subjects];
                return {
                    ...semester,
                    subjects: [...subjects, semesters[activeSemesterIndex].subjects[activeSubjectIndex]]
                }
            });

            setSemesters(updateSemesters)

            resetAllActiveIds()
            return;
        }
    }

    function handleDragEndSubjectToSelection({active, over}: DragEndEvent) {

        const { id: activeId } = active;
        const { id: overId } = over;

        const subjectSemesterIndex = getSemesterIndex(activeId);
        const selectionSemesterIndex = semesters.findIndex(semesters => semesters.selections ? semesters.selections?.find(selection => selection.id === overId).id : undefined);
        const activeSubjectIndex = semesters[subjectSemesterIndex].subjects.findIndex(subject => subject.id === activeId);

        if (subjectSemesterIndex === -1 || selectionSemesterIndex === -1) return;

        let updateSemesters = [...semesters];

        updateSemesters = updateSemesters.map((semester, index) =>
            index !== subjectSemesterIndex ? semester :
                {
                    ...semester,
                    subjects: semester.subjects.filter(subject => subject.id !== activeId)
                }
        );

        updateSemesters = updateSemesters.map((semester, index) => {
            if (index !== selectionSemesterIndex) return semester;
            return {
                ...semester,
                selections: semester.selections ? semester.selections.map(
                    selection => selection.id !== overId ? selection : {
                        ...selection,
                        subjects: [
                            ...selection.subjects,
                            {...semesters[subjectSemesterIndex].subjects[activeSubjectIndex]}
                        ]
                    }
                ) : undefined
            }
        });

        setSemesters(updateSemesters)

        resetAllActiveIds()
        return;
    }

    function handleDragEndSubjectToSubjectSameSemester(event: DragEndEvent, semesterIndex: number) {

        const {active, over} = event;

        const { id: activeId } = active;
        const { id: overId } = over;

        const subjects = semesters[semesterIndex].subjects;

        const activeSubjectIndex = subjects.findIndex(subject => subject.id === activeId);
        const overSubjectIndex = subjects.findIndex(subject => subject.id === overId);

        if (activeSubjectIndex !== overSubjectIndex) {
            setSemesters(semesters.map((semester, index) => index !== semesterIndex ? semester : {
                ...semester,
                subjects: arrayMove(semester.subjects, activeSubjectIndex, overSubjectIndex)
            }))
        }
    }

    function handleDragEndSubjectToSubjectAnotherSemester(event: DragEndEvent, activeSemesterIndex: number, overSemesterIndex: number) {

        const {active, over} = event;

        const { id: activeId } = active;
        const { id: overId } = over;

        const activeSubjects = semesters[activeSemesterIndex].subjects;
        const overSubjects = semesters[overSemesterIndex].subjects;

        const activeSubjectIndex = activeSubjects.findIndex(subject => subject.id === activeId);
        const overSubjectIndex = overSubjects.findIndex(subject => subject.id === overId);

        let updateSemesters = [...semesters];

        updateSemesters = updateSemesters.map((semester, index) =>
            index !== activeSemesterIndex ? semester :
                {
                    ...semester,
                    subjects: semester.subjects.filter((subject, _index) =>
                        _index !== activeSubjectIndex
                    )
                }
        );

        updateSemesters = updateSemesters.map((semester, index) => {
            if (index !== overSemesterIndex) return semester;
            const subjects = [...semester.subjects];
            subjects.splice(overSubjectIndex, 0, semesters[activeSemesterIndex].subjects[activeSubjectIndex]);
            return {
                ...semester,
                subjects: [...subjects]
            }
        });

        setSemesters(updateSemesters)
    }

    function handleDragEnd(event: DragEndEvent) {

        const {active, over} = event;

        if (!active && !over) return;

        const { id: activeId } = active;
        const { id: overId } = over;

        if (isSemesterId(overId)) {
            handleDragEndSubjectToSemester(event)
            return;
        }

        if (isSelectionId(overId)) {
            handleDragEndSubjectToSelection(event)
            return;
        }

        const activeSemesterIndex = getSemesterIndex(activeId);
        const overSemesterIndex = getSemesterIndex(overId);

        if (activeSemesterIndex === undefined || overSemesterIndex === undefined) {
            resetAllActiveIds()
            return;
        }

        if (activeSemesterIndex === overSemesterIndex) {
            handleDragEndSubjectToSubjectSameSemester(event, activeSemesterIndex)
        }
        else {
            handleDragEndSubjectToSubjectAnotherSemester(event, activeSemesterIndex, overSemesterIndex)
        }

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
                onDragEnd={handleDragEnd}
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
                                {
                                    ...semesters[getSemesterIndex(activeId)]?.subjects
                                        .find(sub => sub.id === activeId)
                                }
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