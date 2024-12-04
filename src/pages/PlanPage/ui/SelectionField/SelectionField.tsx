import SortableSubjectCard from "@/pages/PlanPage/ui/SubjectCard/SortableSubjectCard.tsx";
import {Tag} from "antd";
import React from "react";
import {Selection} from "@/pages/PlanPage/types/Semester.ts";
import {UniqueIdentifier, useDroppable} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";

interface SelectionFieldProps extends Selection {
    activeOverId?: UniqueIdentifier | null;
}

const SelectionField = ({subjects, name, credits, id, activeOverId}: SelectionFieldProps) => {

    const { setNodeRef } = useDroppable({
        id
    });

    return (
        <div className={`flex flex-col border-2 border-dashed border-blue-200 px-2 rounded-lg ${activeOverId === id ? "bg-blue-400/[0.1]" : "bg-blue-400/[0.05]"}`} ref={setNodeRef}>
            <div className={"flex justify-between py-2"}>
                <span className={"text-blue-400 font-bold"}>
                    {name}
                </span>
                <Tag color={"blue"} className={"m-0"} bordered={false}>{`${credits} ЗЕТ`}</Tag>
            </div>
            <div className={"flex gap-3"}>
                <SortableContext items={subjects} id={id}>
                    {
                        subjects.length ?
                            subjects.map(subject => <SortableSubjectCard key={subject.id} {...subject}/>)
                            : <span className={"text-blue-400 max-w-[250px] text-center my-auto p-2"}>Перенесите дисциплину внутрь для добавления в выбор </span>
                    }
                </SortableContext>
            </div>
        </div>
    )
}

export default SelectionField;