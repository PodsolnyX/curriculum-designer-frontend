import {useDroppable} from "@dnd-kit/core";
import {SortableContext,} from '@dnd-kit/sortable';
import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import React, {memo, useEffect, useRef, useState} from "react";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {CursorMode} from "@/pages/planPage/provider/types.ts";
import {PanelGroup, PanelResizeHandle, Panel, ImperativePanelHandle} from "react-resizable-panels";
import {useCreateEntity} from "@/pages/planPage/hooks/useCreateEntity.ts";
import SemesterHeader from "@/pages/planPage/ui/SemesterField/SemesterHeader.tsx";
import {PositionContainer} from "@/pages/planPage/provider/PositionsProvider.tsx";
import {SemesterDto} from "@/api/axios-client.types.ts";
import {setPrefixToId} from "@/pages/planPage/provider/prefixIdHelpers.ts";

export interface SemesterFieldProps extends SemesterDto {
    atomsIds: string[];
    subjectsContainerWidth: number;
    setSubjectsContainerWidth(width: number): void;
}

export const SemesterField = memo(function (props: SemesterFieldProps) {

    const {
        id,
        number,
        atomsIds,
        subjectsContainerWidth,
        setSubjectsContainerWidth
    } = props;

    const {
        overItemId,
        toolsOptions,
    } = usePlan();

    const containerId = setPrefixToId(id, "semesters");

    const [addSubjectCard, setAddSubjectCard] = useState(false);

    const subjectsPanelRef = useRef<ImperativePanelHandle | null>(null);

    const { setNodeRef } = useDroppable({
        id: containerId
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
        // if (addSubjectCard) {
        //     event.stopPropagation()
        //     onCreate(id)
        // }
    }

    return (
        <PositionContainer id={containerId} rowId={containerId} rootClassName={`flex w-full flex-col gap-5 relative ${number & 1 ? "bg-stone-100" : "bg-stone-200"} 
                 ${(overItemId === containerId || addSubjectCard) ? "after:content-[''] after:w-full after:h-full after:border-2 after:border-dashed after:pointer-events-none after:border-sky-500 after:absolute after:top-0 after:left-0"
            : ""}`}>
            <div ref={setNodeRef} onMouseEnter={onHoverSemester} onMouseLeave={onLeaveSemester} onClick={(event) => onAddSubject(event)}
                 className={`flex w-full flex-col gap-5 relative ${number & 1 ? "bg-stone-100" : "bg-stone-200"}`}
                 // ${(overItemId === containerId || addSubjectCard) ? "after:content-[''] after:w-full after:h-full after:border-2 after:border-dashed after:pointer-events-none after:border-sky-500 after:absolute after:top-0 after:left-0"
                 //     : ""}

            >
                <SemesterHeader semesterId={containerId}/>
                {
                    (atomsIds.length) ?
                        <div className={`flex flex-1 items-start gap-3 px-5 relative`}
                        >
                            <SortableContext items={[...atomsIds]} id={containerId}>
                                <PanelGroup direction="horizontal" autoSaveId="widthSubjects" className={"w-[200vw]"}>
                                    <Panel
                                        ref={subjectsPanelRef}
                                        order={1}
                                        onResize={(width) => setSubjectsContainerWidth(width)}
                                        className={"pr-5"}
                                    >
                                        <div className={`flex flex-wrap gap-3 w-full pt-20 pb-5 pl-4 `}>
                                            {
                                                atomsIds.map(atom => (
                                                    <SortableSubjectCard id={atom} key={atom}/>
                                                ))
                                            }
                                        </div>
                                    </Panel>
                                    <PanelResizeHandle className={"w-[1px] bg-stone-300 z-10"}/>
                                    <Panel order={2} className={"flex pl-5"} style={{width: "100vw"}}/>
                                </PanelGroup>
                            </SortableContext>
                        </div> :
                        <div className={"w-screen h-full flex flex-1 items-center justify-center text-stone-400 py-16"}>
                           <span>Семестр пуст</span>
                        </div>
                }
            </div>
        </PositionContainer>
    );
})






