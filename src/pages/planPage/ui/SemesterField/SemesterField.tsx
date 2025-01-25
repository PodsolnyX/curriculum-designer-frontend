import {useDroppable} from "@dnd-kit/core";
import {SortableContext,} from '@dnd-kit/sortable';
import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import {Semester} from "@/pages/planPage/types/Semester.ts";
import {Tag} from "antd";
import React, {memo, useMemo, useState} from "react";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import SelectionField from "@/pages/planPage/ui/SelectionField/SelectionField.tsx";
import ModuleField from "@/pages/planPage/ui/ModuleField/ModuleField.tsx";
import NewItemCard from "@/pages/planPage/ui/NewItemCard/NewItemCard.tsx";
import {AtomType} from "@/api/axios-client.ts";
import {Subject} from "@/pages/planPage/types/Subject.ts";
import {SubjectCard} from "@/pages/planPage/ui/SubjectCard/SubjectCard.tsx";
import TrackSelectionField from "@/pages/planPage/ui/TrackSelectionField/TrackSelectionField.tsx";
import {CursorMode} from "@/pages/planPage/provider/types.ts";

export interface SemesterFieldProps extends Semester {}

export const SemesterField = memo(function ({number, subjects, modules, trackSelection, id, selections}: SemesterFieldProps) {

    const { overItemId, toolsOptions, modulesSemesters } = usePlan();

    const [addSubjectCard, setAddSubjectCard] = useState(false);
    const [newSubject, setNewSubject] = useState<Subject | null>(null);

    const { setNodeRef } = useDroppable({
        id
    });

    const {displaySettings} = usePlan();

    const sumCredits: number = useMemo(() => {
        return subjects.reduce((sum, sub) => sum + (sub.type !== AtomType.Elective ? sub.credits : 0), 0)
    }, [subjects])

    const sumElectiveCredits: number = useMemo(() => {
        return subjects.reduce((sum, sub) => sum + (sub.type === AtomType.Elective ? sub.credits : 0), 0)
    }, [subjects])

    const sumExams: number = useMemo(() => {
        return subjects.reduce((sum, sub) => sum + (!(sub.attestation) || sub.attestation[0]?.shortName === "Эк" ? 1 : 0), 0)
    }, [subjects])

    const getSumAcademicTypeHours = (key: number): number => {
        return subjects.reduce((sum, sub) => sum + (sub.academicHours ? (sub.academicHours.find(type => type.academicActivity.id === key)?.value || 0) : 0), 0)
    }

    const sumAcademicHours: number = useMemo(() => {
        return subjects.reduce((sum, sub) => sum + (sub.academicHours ? sub.academicHours.reduce((_sum, type) => _sum + type.value, 0) : 0), 0)
    }, [subjects])

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
            console.log("Я добавил карточку в семестр")
            setNewSubject({
                id: 1,
                name: "Новый предмет",
                credits: 0,
                isRequired: false,
                type: AtomType.Subject,
            })
        }
    }

    return (
        <div ref={setNodeRef}
             onClick={(event) => onAddSubject(event)}
             className={`flex w-full flex-col gap-5 relative ${number & 1 ? "bg-stone-100" : "bg-stone-200"}  ${overItemId === id ? "border-blue-400" : "border-transparent"} border-2 border-dashed`}>
            <div className={"absolute top-5 h-full w-full"}>
                <div className={`sticky top-7 bottom-4 left-4 z-10 w-max flex gap-2`}>
                    <div className={"flex gap-5 items-center rounded-lg px-3 py-2 bg-white shadow-md"}>
                        <span className={"text-[14px] text-blue-400 font-bold"}>Семестр: {number}</span>
                        <div className={"flex gap-1"}>
                            {
                                displaySettings.credits &&
                                <Tag color={"default"} className={"m-0"} bordered={false}>{`${sumCredits} / 30 ЗЕТ`}</Tag>
                            }
                            {
                                displaySettings.attestation &&
                                <Tag color={"default"} className={"m-0"} bordered={false}>{`${sumExams} / 3 Эк`}</Tag>
                            }
                            {
                                (displaySettings.credits && sumElectiveCredits) ?
                                    <Tag color={"purple"} className={"m-0"} bordered={false}>{`${sumElectiveCredits} ЗЕТ`}</Tag>
                                    : null
                            }
                        </div>
                    </div>
                    {
                        displaySettings.academicHours &&
                        <div className={"flex gap-2 items-center rounded-lg px-3 py-2 bg-white shadow-md"}>
                            <div className={"flex justify-between border-2 border-solid border-stone-100 rounded-md"}>
                                <div className={"bg-stone-100 pr-1 text-stone-600 text-[12px]"}>{"Всего"}</div>
                                <div className={"text-[12px] px-1 min-w-[30px] text-end"}>{`${sumAcademicHours}/${36*30}`}</div>
                            </div>
                            {/*{*/}
                            {/*    attestationTypes.map(type =>*/}
                            {/*        <div key={type.id} className={"flex justify-between border-2 border-solid border-stone-100 rounded-md"}>*/}
                            {/*            <div className={"bg-stone-100 pr-1 text-stone-600 text-[12px]"}>{type.shortName}</div>*/}
                            {/*            <div className={"text-[12px] px-1 min-w-[30px] text-end"}>{`${getSumAcademicTypeHours(type.id)}`}</div>*/}
                            {/*        </div>*/}
                            {/*    )*/}
                            {/*}*/}
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
                            <div className={`flex flex-wrap gap-3 w-full pt-20 pb-5`}
                                 style={{
                                     maxWidth: modules.length ? `calc(100vw - ${modulesSemesters.reduce((previousValue, currentValue) => Math.max(previousValue, currentValue.columnIndex),0) * 230}px)` : "100vw"
                                 }}
                            >
                                {
                                    subjects.map(subject => (
                                        <SortableSubjectCard
                                            id={subject.id}
                                            key={subject.id}
                                            {...subject}
                                        />
                                    ))
                                }
                                {
                                    newSubject && <SubjectCard {...newSubject}/>
                                }
                                {
                                    selections.map(selection =>
                                        <SelectionField key={selection.id} {...selection}/>
                                    )
                                }
                            </div>
                            <div className={`grid pr-5 gap-x-2 h-full ${modules.length ? "w-auto" : "w-0"}`} style={{gridTemplateColumns: `repeat(${modulesSemesters.reduce((max, item) => Math.max(max, item.columnIndex), 0) + 1}, minmax(240px, 1fr))`}}>
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
                            {
                                trackSelection.length ?
                                    trackSelection.map(selection =>
                                        <TrackSelectionField {...selection} key={selection.id}/>
                                    ) : null
                            }
                        </SortableContext>
                    </div> :
                    <div className={"w-full h-full flex flex-1 items-center justify-center text-stone-400 py-16"}
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






