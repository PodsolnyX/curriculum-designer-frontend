import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import {Tag} from "antd";
import React, {memo} from "react";
import {Selection} from "@/pages/planPage/types/Semester.ts";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";

interface SelectionFieldProps extends Selection {}

const SelectionField = memo(({subjects, name, credits, id}: SelectionFieldProps) => {

    const { overItemId } = usePlan();
    const { setNodeRef } = useDroppable({
        id
    });

    return (
        <div className={`flex flex-col border-2 border-dashed h-max px-2 rounded-lg ${overItemId === id ? "border-blue-300 bg-blue-400/[0.1]" : "border-blue-200 bg-blue-400/[0.05]"}`} ref={setNodeRef}>
            <div className={"flex justify-between py-2 gap-1"}>
                <span className={"text-blue-400 font-bold overflow-hidden text-nowrap text-ellipsis"}>
                    {name}
                </span>
                <Tag color={"blue"} className={"m-0"} bordered={false}>{`${credits} ЗЕТ`}</Tag>
            </div>
            <div className={"flex gap-3"}>
                <SortableContext items={subjects} id={id}>
                    {
                        subjects.length ?
                            subjects.map(subject => <SortableSubjectCard key={subject.id} {...subject}/>)
                            : <span className={"text-blue-400 max-w-[250px] text-center my-auto pb-4 pt-2 px-2"}>Перенесите дисциплину внутрь для добавления в выбор </span>
                    }
                </SortableContext>
            </div>
        </div>
    )
})

export default SelectionField;