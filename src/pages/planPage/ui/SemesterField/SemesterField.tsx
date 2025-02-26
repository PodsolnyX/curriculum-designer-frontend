import {useDroppable} from "@dnd-kit/core";
import {SortableContext,} from '@dnd-kit/sortable';
import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import {Semester} from "@/pages/planPage/types/Semester.ts";
import React, {memo, useEffect, useRef, useState} from "react";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import SelectionField from "@/pages/planPage/ui/SelectionField/SelectionField.tsx";
import ModuleField from "@/pages/planPage/ui/ModuleField/ModuleField.tsx";
import TrackSelectionField from "@/pages/planPage/ui/TrackSelectionField/TrackSelectionField.tsx";
import {CursorMode} from "@/pages/planPage/provider/types.ts";
import {PanelGroup, PanelResizeHandle, Panel, ImperativePanelHandle} from "react-resizable-panels";
import {useCreateEntity} from "@/pages/planPage/hooks/useCreateEntity.ts";
import SemesterHeader from "@/pages/planPage/ui/SemesterField/SemesterHeader.tsx";
import {Container} from "@/pages/planPage/provider/PositionsProvider.tsx";

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
        selectionsSemesters,
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
        <Container id={id} rowId={id} rootClassName={`flex w-full flex-col gap-5 relative ${number & 1 ? "bg-stone-100" : "bg-stone-200"} 
                 ${(overItemId === id || addSubjectCard) ? "after:content-[''] after:w-full after:h-full after:border-2 after:border-dashed after:pointer-events-none after:border-sky-500 after:absolute after:top-0 after:left-0"
            : ""}`}>
            <div ref={setNodeRef} onMouseEnter={onHoverSemester} onMouseLeave={onLeaveSemester} onClick={(event) => onAddSubject(event)}
                 className={`flex w-full flex-col gap-5 relative ${number & 1 ? "bg-stone-100" : "bg-stone-200"} 
                 ${(overItemId === id || addSubjectCard) ? "after:content-[''] after:w-full after:h-full after:border-2 after:border-dashed after:pointer-events-none after:border-sky-500 after:absolute after:top-0 after:left-0" 
                     : ""}`}>
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
                                        <div className={`flex flex-wrap gap-3 w-full pt-20 pb-5 pl-4 `}>
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
                                    <PanelResizeHandle className={"w-[1px] bg-stone-300 z-10"}/>
                                    <Panel order={2} className={"flex pl-5"} style={{width: "200vw"}}>
                                        {/*<div className={`grid pr-5 gap-x-2 h-full`} style={{gridTemplateColumns: `repeat(${modulesSemesters.reduce((max, item) => Math.max(max, item.columnIndex), 0) + 1}, 1fr)`}}>*/}
                                        {/*    {*/}
                                        {/*        modules.map(module =>*/}
                                        {/*            <ModuleField*/}
                                        {/*                key={module.id}*/}
                                        {/*                {...module}*/}
                                        {/*                columnIndex={modulesSemesters.find(item =>item.semesters.includes(module.id))?.columnIndex + 1 || 1}*/}
                                        {/*            />*/}
                                        {/*        )*/}
                                        {/*    }*/}
                                        {/*</div>*/}
                                        {/*<div className={`grid pr-5 gap-x-2 h-full`} style={{gridTemplateColumns: `repeat(${selectionsSemesters.reduce((max, item) => Math.max(max, item.columnIndex), 0) + 1}, 1fr)`}}>*/}
                                        {/*    {*/}
                                        {/*        selections.map(selection =>*/}
                                        {/*            <SelectionField*/}
                                        {/*                key={selection.id}*/}
                                        {/*                {...selection}*/}
                                        {/*                columnIndex={selectionsSemesters.find(item => item.semesters.includes(selection.id))?.columnIndex + 1 || 1}*/}
                                        {/*            />*/}
                                        {/*        )*/}
                                        {/*    }*/}
                                        {/*</div>*/}
                                        {/*<div className={"grid gap-x-2"} style={{gridTemplateColumns: `repeat(${tracksSelectionSemesters.reduce((max, item) => Math.max(max, item.columnIndex), 0) + 1}, 1fr)`}}>*/}
                                        {/*    {*/}
                                        {/*        trackSelection.length ?*/}
                                        {/*            trackSelection.map(selection =>*/}
                                        {/*                <TrackSelectionField*/}
                                        {/*                    {...selection}*/}
                                        {/*                    key={selection.id}*/}
                                        {/*                    columnIndex={tracksSelectionSemesters.find(item =>item.semesters.includes(selection.id))?.columnIndex + 1 || 1}*/}
                                        {/*                />*/}
                                        {/*            ) : null*/}
                                        {/*    }*/}
                                        {/*</div>*/}
                                    </Panel>
                                </PanelGroup>
                            </SortableContext>
                        </div> :
                        <div className={"w-screen h-full flex flex-1 items-center justify-center text-stone-400 py-16"}>
                           <span>Семестр пуст</span>
                        </div>
                }
            </div>
        </Container>
    );
})






