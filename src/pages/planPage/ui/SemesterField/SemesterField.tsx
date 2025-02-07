import {useDroppable} from "@dnd-kit/core";
import {SortableContext,} from '@dnd-kit/sortable';
import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import {Semester} from "@/pages/planPage/types/Semester.ts";
import {Tag} from "antd";
import React, {memo, useEffect, useRef, useState} from "react";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import SelectionField from "@/pages/planPage/ui/SelectionField/SelectionField.tsx";
import ModuleField from "@/pages/planPage/ui/ModuleField/ModuleField.tsx";
import TrackSelectionField from "@/pages/planPage/ui/TrackSelectionField/TrackSelectionField.tsx";
import {CursorMode} from "@/pages/planPage/provider/types.ts";
import {PanelGroup, PanelResizeHandle, Panel, ImperativePanelHandle} from "react-resizable-panels";
import {getIdFromPrefix} from "@/pages/planPage/provider/parseCurriculum.ts";
import AcademicHoursPanel from "@/pages/planPage/ui/AcademicHoursPanel.tsx";
import {useCreateEntity} from "@/pages/planPage/hooks/useCreateEntity.ts";

export interface SemesterFieldProps extends Semester {
    subjectsContainerWidth: number;
    setSubjectsContainerWidth(width: number): void;
}

export const SemesterField = memo(function (props: SemesterFieldProps) {

    const {
        id,
        number,
        subjects,
        modules,
        selections,
        trackSelection,
        subjectsContainerWidth,
        setSubjectsContainerWidth
    } = props;

    const {
        overItemId,
        toolsOptions,
        modulesSemesters,
        tracksSelectionSemesters,
        selectionsSemesters
    } = usePlan();

    const [addSubjectCard, setAddSubjectCard] = useState(false);

    const subjectsPanelRef = useRef<ImperativePanelHandle | null>(null);

    const { setNodeRef } = useDroppable({
        id
    });

    const {onCreate} = useCreateEntity()

    useEffect(() => {
        if (subjectsPanelRef.current)
            subjectsPanelRef.current?.resize(subjectsContainerWidth)
    }, [subjectsContainerWidth])

    const onHoverSemester = () => {
        if (toolsOptions.cursorMode === CursorMode.Create)
            setAddSubjectCard(true)
    }

    const onLeaveSemester = () => {
        setAddSubjectCard(false)
    }

    const onAddSubject = (event: React.MouseEvent<HTMLDivElement>) => {
        if (addSubjectCard) {
            event.stopPropagation()
            onCreate(id)
        }
    }

    return (
        <div ref={setNodeRef} onMouseEnter={onHoverSemester} onMouseLeave={onLeaveSemester} onClick={(event) => onAddSubject(event)}
             className={`flex w-full flex-col gap-5 relative ${number & 1 ? "bg-stone-100" : "bg-stone-200"} ${(overItemId === id || addSubjectCard) ? "brightness-95" : ""}`}>
            <SemesterHeader semesterId={id}/>
            {
                (subjects.length || selections.length || modules.length || trackSelection.length) ?
                    <div className={`flex flex-1 items-start gap-3 px-5 relative`}
                    >
                        <SortableContext items={[...subjects, ...selections, ...trackSelection, ...modules]} id={id}>
                            <PanelGroup direction="horizontal" autoSaveId="widthSubjects" className={"w-[200vw]"}>
                                <Panel
                                    ref={subjectsPanelRef}
                                    order={1}
                                    onResize={(width) => setSubjectsContainerWidth(width)}
                                    style={{overflow: "auto"}}
                                    className={"pr-5"}
                                >
                                    <div className={`flex flex-wrap gap-3 w-full pt-20 pb-5`}>
                                        {
                                            subjects.map(subject => (
                                                <SortableSubjectCard
                                                    id={subject.id}
                                                    key={subject.id}
                                                    {...subject}
                                                />
                                            ))
                                        }
                                    </div>
                                </Panel>
                                <PanelResizeHandle className={"w-[1px] bg-stone-300"}/>
                                <Panel order={2} style={{overflow: "auto"}} className={"flex pl-5"}>
                                    <div className={`grid pr-5 gap-x-2 h-full`} style={{gridTemplateColumns: `repeat(${modulesSemesters.reduce((max, item) => Math.max(max, item.columnIndex), 0) + 1}, 1fr)`}}>
                                        {
                                            modules.map(module =>
                                                <ModuleField
                                                    key={module.id}
                                                    {...module}
                                                    columnIndex={modulesSemesters.find(item =>item.semesters.includes(module.id))?.columnIndex + 1 || 1}
                                                />
                                            )
                                        }
                                    </div>
                                    <div className={`grid pr-5 gap-x-2 h-full`} style={{gridTemplateColumns: `repeat(${selectionsSemesters.reduce((max, item) => Math.max(max, item.columnIndex), 0) + 1}, 1fr)`}}>
                                        {
                                            selections.map(selection =>
                                                <SelectionField
                                                    key={selection.id}
                                                    {...selection}
                                                    columnIndex={selectionsSemesters.find(item =>item.semesters.includes(selection.id))?.columnIndex + 1 || 1}
                                                />
                                            )
                                        }
                                    </div>
                                    <div className={"grid gap-x-2"} style={{gridTemplateColumns: `repeat(${tracksSelectionSemesters.reduce((max, item) => Math.max(max, item.columnIndex), 0) + 1}, 1fr)`}}>
                                        {
                                            trackSelection.length ?
                                                trackSelection.map(selection =>
                                                    <TrackSelectionField
                                                        {...selection}
                                                        key={selection.id}
                                                        columnIndex={tracksSelectionSemesters.find(item =>item.semesters.includes(selection.id))?.columnIndex + 1 || 1}
                                                    />
                                                ) : null
                                        }
                                    </div>
                                </Panel>
                            </PanelGroup>
                        </SortableContext>
                    </div> :
                    <div className={"w-screen h-full flex flex-1 items-center justify-center text-stone-400 py-16"}>
                       <span>Семестр пуст</span>
                    </div>
            }
        </div>
    );
})

interface SemesterHeaderProps {
    semesterId: string;
}

const SemesterHeader = ({semesterId}: SemesterHeaderProps) => {

    const {
        displaySettings,
        semestersInfo,
    } = usePlan();

    const info = semestersInfo?.find(semester => semester.semester.id === Number(getIdFromPrefix(semesterId)));

    if (!info) return null;

    const {
        semester,
        nonElective,
        elective
    } = info;

    const examsCount: number = nonElective.attestations.reduce((sum, attestation) => sum + (attestation.shortName === "Эк" ? 1 : 0), 0);

    return (
        <div className={"absolute top-5 h-full w-full"}>
            <div className={`sticky top-7 bottom-4 left-4 z-10 w-max flex gap-2`}>
                <div className={"flex gap-5 items-center rounded-lg px-3 py-2 bg-white shadow-md"}>
                    <span className={"text-[14px] text-blue-400 font-bold"}>Семестр: {semester.number}</span>
                    <div className={"flex gap-1"}>
                        {
                            displaySettings.credits &&
                            <Tag color={nonElective.credit > 30 ? "red" : nonElective.credit < 30 ? "default" : "green"} className={"m-0"} bordered={false}>{`${nonElective.credit} / 30 ЗЕТ`}</Tag>
                        }
                        {
                            displaySettings.attestation &&
                            <Tag
                                color={examsCount >= 3 ? "green" : "default"}
                                className={"m-0"}
                                bordered={false}
                            >{`${examsCount} / 3 Эк`}</Tag>
                        }
                        {
                            (displaySettings.credits && elective.credit) ?
                                <Tag color={"purple"} className={"m-0"} bordered={false}>{`${elective.credit} ЗЕТ`}</Tag>
                                : null
                        }
                    </div>
                </div>
                {
                    displaySettings.academicHours &&
                    <div className={"rounded-lg px-3 py-2 bg-white shadow-md"}>
                        <AcademicHoursPanel
                            credits={nonElective.credit}
                            academicHours={nonElective.academicActivityHours}
                            layout={"horizontal"}
                            size={"large"}
                            showAllActivities={true}
                        />
                    </div>
                }
            </div>
        </div>
    )
}






