import {useDroppable} from "@dnd-kit/core";
import {SortableContext,} from '@dnd-kit/sortable';
import SortableSubjectCard from "@/pages/PlanPage/ui/SubjectCard/SortableSubjectCard.tsx";
import {Semester} from "@/pages/PlanPage/types/Semester.ts";
import {Tag} from "antd";
import React from "react";
import {AcademicTypes} from "@/pages/PlanPage/mocks.ts";
import {usePlan} from "@/pages/PlanPage/provider/PlanProvider.tsx";
import {AttestationType, SubjectType} from "@/pages/PlanPage/types/Subject.ts";
import SelectionField from "@/pages/PlanPage/ui/SelectionField/SelectionField.tsx";
import ModuleField from "@/pages/PlanPage/ui/ModuleField/ModuleField.tsx";

export interface SemesterFieldProps extends Semester {}

export function SemesterField({number, subjects, modules, id, selections}: SemesterFieldProps) {

    const { overItemId } = usePlan();

    const { setNodeRef } = useDroppable({
        id
    });

    const {displaySettings} = usePlan();

    const getSumCredits = (): number => {
        return subjects.reduce((sum, sub) => sum + (sub.type !== SubjectType.Elective ? sub.credits : 0), 0)
    }

    const getSumElectiveCredits = (): number => {
        return subjects.reduce((sum, sub) => sum + (sub.type === SubjectType.Elective ? sub.credits : 0), 0)
    }

    const getSumExams = (): number => {
        return subjects.reduce((sum, sub) => sum + (sub.attestation === AttestationType.Exam ? 1 : 0), 0)
    }

    const getSumAcademicTypeHours = (key: string): number => {
        return subjects.reduce((sum, sub) => sum + (sub.academicHours ? sub.academicHours.find(type => type.key === key).value : 0), 0)
    }

    const getSumAcademicHours = (): number => {
        return subjects.reduce((sum, sub) => sum + (sub.academicHours ? sub.academicHours.reduce((_sum, type) => _sum + type.value, 0) : 0), 0)
    }

    return (
        <div ref={setNodeRef}
             className={`flex flex-col gap-5 relative ${number & 1 ? "bg-stone-100" : "bg-stone-200"}  ${overItemId === id ? "border-blue-400" : "border-transparent"} border-2 border-dashed`}>
            <div className={"absolute top-5 h-full left-5"}>
                <div className={`sticky top-4 bottom-4 left-4 z-10 w-max flex gap-2`}>
                    <div className={"flex gap-5 items-center rounded-lg px-3 py-2 bg-white shadow-md"}>
                        <span className={"text-[14px] text-blue-400 font-bold"}>Семестр: {number}</span>
                        <div className={"flex gap-1"}>
                            {
                                displaySettings.credits &&
                                <Tag color={"default"} className={"m-0"} bordered={false}>{`${getSumCredits()} / 30 ЗЕТ`}</Tag>
                            }
                            {
                                displaySettings.attestation &&
                                <Tag color={"default"} className={"m-0"} bordered={false}>{`${getSumExams()} / 3 Эк`}</Tag>
                            }
                            {
                                (displaySettings.credits && getSumElectiveCredits()) ?
                                    <Tag color={"purple"} className={"m-0"} bordered={false}>{`${getSumElectiveCredits()} ЗЕТ`}</Tag>
                                    : null
                            }
                        </div>
                    </div>
                    {
                        displaySettings.academicHours &&
                        <div className={"flex gap-2 items-center rounded-lg px-3 py-2 bg-white shadow-md"}>
                            <div className={"flex justify-between border-2 border-solid border-stone-100 rounded-md"}>
                                <div className={"bg-stone-100 pr-1 text-stone-600 text-[12px]"}>{"Всего"}</div>
                                <div className={"text-[12px] px-1 min-w-[30px] text-end"}>{`${getSumAcademicHours()}/${36*30}`}</div>
                            </div>
                            {
                                AcademicTypes.map(type =>
                                    <div key={type.key} className={"flex justify-between border-2 border-solid border-stone-100 rounded-md"}>
                                        <div className={"bg-stone-100 pr-1 text-stone-600 text-[12px]"}>{type.name}</div>
                                        <div className={"text-[12px] px-1 min-w-[30px] text-end"}>{`${getSumAcademicTypeHours(type.key)}`}</div>
                                    </div>
                                )
                            }
                        </div>
                    }
                </div>
            </div>
            {
                (subjects.length || selections.length || modules.length) ?
                    <div className={`flex flex-1 items-start gap-3`}>
                        <SortableContext items={[...subjects, ...selections]} id={id}>
                            <div className={"flex flex-wrap gap-3 max-w-[40vw] h-full w-full p-5 pt-20"}>
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
                                    selections.map(selection =>
                                        <SelectionField key={selection.id} {...selection}/>
                                    )
                                }
                            </div>
                            <div className={"flex gap-3 px-5 h-full"}>
                                {
                                    modules.map(module =>
                                        <ModuleField key={module.id} {...module}/>
                                    )
                                }
                            </div>
                        </SortableContext>
                    </div> :
                    <div className={"w-full h-full flex flex-1 items-center justify-center text-stone-400 py-16"}>
                        <span>Семестр пуст</span>
                    </div>
            }
        </div>
    );
}






