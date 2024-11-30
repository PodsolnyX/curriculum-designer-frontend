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
import {SemesterField} from "@/pages/PlanPage/SemesterField/SemesterField.tsx";
import {CSS} from "@dnd-kit/utilities";
import pageStyles from "@/pages/PlanPage/SubjectCard/SubjectCard.module.scss";
import {SubjectCard} from "@/pages/PlanPage/SubjectCard/SubjectCard.tsx";
import {Semester} from "@/pages/PlanPage/types/Semester.ts";
import {PlanProvider} from "@/pages/PlanPage/provider/PlanProvider.tsx";

const PlanPageWrapped = () => {

    const [semesters, setSemesters] = useState<Semester[]>(SemestersMocks);
    const [activeSemester, setActiveSemester] = useState<UniqueIdentifier | null>(null)

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

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const { id } = active;

        setActiveId(id);
    }

    function handleDragOver({over}: DragOverEvent) {
        if (!over) return;
        const { id: overId } = over;

        if (isSemesterId(String(overId))) setActiveSemester(overId);
        else setActiveSemester(null);
    }

    function handleDragEnd({active, over}: DragEndEvent) {

        if (!active && !over) return;

        const { id: activeId } = active;
        const { id: overId } = over;

        const activeSemesterIndex = getSemesterIndex(activeId);

        if (isSemesterId(overId)) {

            if (semesters.find(semester => semester.id === overId).subjects.find(subject => subject.id === activeId)) {
                setActiveId(null);
                setActiveSemester(null)
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

                setActiveId(null);
                setActiveSemester(null)
                return;
            }
        }

        const overSemesterIndex = getSemesterIndex(overId);

        if (activeSemesterIndex === undefined || overSemesterIndex === undefined) {
            setActiveId(null);
            setActiveSemester(null)
            return;
        }

        if (activeSemesterIndex === overSemesterIndex) {
            const subjects = semesters[activeSemesterIndex].subjects;

            const activeSubjectIndex = subjects.findIndex(subject => subject.id === activeId);
            const overSubjectIndex = subjects.findIndex(subject => subject.id === overId);

            if (activeSubjectIndex !== overSubjectIndex) {
                setSemesters(semesters.map((semester, index) => index !== overSemesterIndex ? semester : {
                    ...semester,
                    subjects: arrayMove(semester.subjects, activeSubjectIndex, overSubjectIndex)
                }))
            }
        }
        else {
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

        setActiveId(null);
        setActiveSemester(null)
    }

    return (
        <div className={"flex flex-col min-h-screen bg-stone-100"}>
            <div className={"flex flex-col shadow-lg overflow-x-auto"}>
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
                                number={semester.number}
                                subjects={semester.subjects}
                                activeId={activeId}
                                id={semester.id}
                                key={semester.id}
                                isActive={activeSemester === semester.id}
                            />
                        )
                    }

                    <DragOverlay dropAnimation={dropAnimation}>
                        {
                            activeId !== null
                                ? <SubjectCard
                                    id={activeId}
                                    {
                                        ...semesters[getSemesterIndex(activeId)].subjects
                                            .find(sub => sub.id === activeId)
                                    }
                                />
                                : null
                        }
                    </DragOverlay>
                </DndContext>
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

const PlanPage = () => {
    return (
        <PlanProvider>
            <PlanPageWrapped/>
        </PlanProvider>
    )
};

export default PlanPage;