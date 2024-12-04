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

    function getSemesterIndex(subjectId: UniqueIdentifier): number {
        return semesters.findIndex(semester =>
            semester.subjects.find(subject => subject.id === subjectId)
        );
    }

    function getSemesterBySubjectId(subjectId: UniqueIdentifier): Semester | undefined {
        return semesters.find(semester =>
            semester.subjects.find(subject => subject.id === subjectId)
        );
    }

    const isSemesterId = (id: string) => {
        return id.split("-")[0] === "semesters";
    }

    const isSelectionId = (id: string) => {
        return id.split("-")[0] === "selections";
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

        if (!event.over) return;
        const { id: overId } = event.over;

        setActiveOverId(overId);
    }

    //// Handle drag end ////

    //Предмет к предмету в одном семестре
    //Предмет к предмету в разных семестрах
    //Предмет из семестра в семестр
    //Предмет из семестра в выбор
    //Предмет к предмету в одном выборе
    //Предмет к предмету в разных выборах
    //Предмет из выбора в семестр

    const removeSubjectFromSemester = (semesters: Semester[], semesterIndex: number, subjectId: UniqueIdentifier): Semester[] => {
        return semesters.map((semester, index) =>
            index !== semesterIndex ? semester :
                {
                    ...semester,
                    subjects: semester.subjects.filter(subject => subject.id !== subjectId)
                }
        );
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

        console.log("ACTIVE", getParentsIdsByChildId(event.active.id), "PASSIVE", getParentsIdsByChildId(event.over.id))

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
            if (!type || currentDeep === parentsIdsOver.length)
                item.subjects = [...item.subjects, activeSubject]
            else {
                const subItem = item[type].find(_item => _item.id === parentsIdsOver[currentDeep])
                addSubjectToNewParents(subItem, currentDeep + 1);
            }
        }

        removeSubjectFromParents({semesters: updateSemesters}, 0)
        addSubjectToNewParents({semesters: updateSemesters}, 0)

        setSemesters(JSON.parse(JSON.stringify(updateSemesters)))
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

        const subjectSemester = getSemesterBySubjectId(activeId)

        if (!subjectSemester) return;

        const subjectSemesterIndex = getSemesterIndex(activeId);
        const selectionSemesterIndex = semesters.findIndex(semesters => semesters.selections.find(selection => selection.id === overId).id);
        const activeSubjectIndex = semesters[subjectSemesterIndex].subjects.findIndex(subject => subject.id === activeId);

        if (subjectSemesterIndex === -1 || selectionSemesterIndex === -1) return;

        let updateSemesters = [...semesters];
        updateSemesters = removeSubjectFromSemester(updateSemesters, subjectSemesterIndex, activeId);

        const key: keyof Semester = "selections";

        updateSemesters = updateSemesters.map((semester, index) => {
            if (index !== selectionSemesterIndex) return semester;
            return {
                ...semester,
                [key]: (semester[key] && Array.isArray(semester[key])) ? semester[key]?.map(
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

        if (activeSemesterIndex === -1 || overSemesterIndex === -1) {
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

    //// ////

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