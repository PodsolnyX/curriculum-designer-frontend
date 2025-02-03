import {useDroppable} from "@dnd-kit/core";
import {SortableContext,} from '@dnd-kit/sortable';
import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import {Semester} from "@/pages/planPage/types/Semester.ts";
import {Tag} from "antd";
import React, {memo, useEffect, useRef, useState} from "react";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import SelectionField from "@/pages/planPage/ui/SelectionField/SelectionField.tsx";
import ModuleField from "@/pages/planPage/ui/ModuleField/ModuleField.tsx";
import NewItemCard from "@/pages/planPage/ui/NewItemCard/NewItemCard.tsx";
import TrackSelectionField from "@/pages/planPage/ui/TrackSelectionField/TrackSelectionField.tsx";
import {CursorMode} from "@/pages/planPage/provider/types.ts";
import {PanelGroup, PanelResizeHandle, Panel, ImperativePanelHandle} from "react-resizable-panels";
import {useCreateSubject} from "@/pages/planPage/hooks/useCreateSubject.ts";
import {getIdFromPrefix} from "@/pages/planPage/provider/parseCurriculum.ts";
import AcademicHoursPanel from "@/pages/planPage/ui/AcademicHoursPanel.tsx";

export interface SemesterFieldProps extends Semester {
    subjectsContainerWidth: number;
    setSubjectsContainerWidth(width: number): void;
}

export const SemesterField = memo(function (props: SemesterFieldProps) {

    const {
        number,
        subjects,
        modules,
        trackSelection,
        id,
        selections,
        subjectsContainerWidth,
        setSubjectsContainerWidth
    } = props;

    const {
        overItemId,
        toolsOptions,
        displaySettings,
        semestersInfo,
        modulesSemesters,
        tracksSelectionSemesters,
        selectionsSemesters
    } = usePlan();

    const [addSubjectCard, setAddSubjectCard] = useState(false);

    const subjectsPanelRef = useRef<ImperativePanelHandle | null>(null);

    const { setNodeRef } = useDroppable({
        id
    });

    const createSubject = useCreateSubject(id);

    useEffect(() => {
        if (subjectsPanelRef.current)
            subjectsPanelRef.current?.resize(subjectsContainerWidth)
    }, [subjectsContainerWidth])

    const info = semestersInfo?.find(semester => semester.semester.id === Number(getIdFromPrefix(id)));

    const onHoverSemester = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (toolsOptions.cursorMode === CursorMode.Create)
            setAddSubjectCard(true)
    }

    const onLeaveSemester = () => {
        setAddSubjectCard(false)
    }

    const onAddSubject = (event: React.MouseEvent<HTMLDivElement>) => {
        if (addSubjectCard) {
            event.stopPropagation()
            createSubject()
        }
    }

    const examsCount: number = info?.attestations.reduce((sum, attestation) => sum + (attestation.shortName === "Эк" ? 1 : 0), 0);

    return (
        <div ref={setNodeRef}
             onClick={(event) => onAddSubject(event)}
             className={`flex w-full flex-col gap-5 relative ${number & 1 ? "bg-stone-100" : "bg-stone-200"}  ${overItemId === id ? "brightness-95" : ""}`}>
            <div className={"absolute top-5 h-full w-full"}>
                <div className={`sticky top-7 bottom-4 left-4 z-10 w-max flex gap-2`}>
                    <div className={"flex gap-5 items-center rounded-lg px-3 py-2 bg-white shadow-md"}>
                        <span className={"text-[14px] text-blue-400 font-bold"}>Семестр: {number}</span>
                        <div className={"flex gap-1"}>
                            {
                                displaySettings.credits &&
                                <Tag
                                    color={info?.credit > 30 ? "red" : info?.credit < 30 ? "default" : "green"}
                                    className={"m-0"}
                                    bordered={false}
                                >{`${info?.credit} / 30 ЗЕТ`}</Tag>
                            }
                            {
                                displaySettings.attestation &&
                                <Tag
                                    color={examsCount >= 3 ? "green" : "default"}
                                    className={"m-0"}
                                    bordered={false}
                                >{`${examsCount} / 3 Эк`}</Tag>
                            }
                            {/*{*/}
                            {/*    (displaySettings.credits && sumElectiveCredits) ?*/}
                            {/*        <Tag color={"purple"} className={"m-0"} bordered={false}>{`${sumElectiveCredits} ЗЕТ`}</Tag>*/}
                            {/*        : null*/}
                            {/*}*/}
                        </div>
                    </div>
                    {
                        displaySettings.academicHours &&
                        <div className={"rounded-lg px-3 py-2 bg-white shadow-md"}>
                            <AcademicHoursPanel
                                credits={info?.credit || 0}
                                academicHours={info?.academicActivityHours || []}
                                layout={"horizontal"}
                                size={"large"}
                            />
                        </div>
                    }
                </div>
            </div>
            {
                (subjects.length || selections.length || modules.length || trackSelection.length) ?
                    <div className={`flex flex-1 items-start gap-3 px-5 relative`}
                         onMouseEnter={onHoverSemester} onMouseLeave={onLeaveSemester}
                    >
                        {
                            addSubjectCard ? <div className={"absolute w-full -ml-5 h-full border-sky-500 cursor-pointer border-dashed border-2"}></div>  : null
                        }
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
                    <div className={"w-screen h-full flex flex-1 items-center justify-center text-stone-400 py-16"}
                         onMouseEnter={onHoverSemester}
                         onMouseLeave={onLeaveSemester}
                    >
                        {
                            addSubjectCard ? <NewItemCard/> : <span>Семестр пуст</span>
                        }
                    </div>
            }
        </div>
    );
})






