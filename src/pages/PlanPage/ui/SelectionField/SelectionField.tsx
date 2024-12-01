import SortableSubjectCard from "@/pages/PlanPage/ui/SubjectCard/SortableSubjectCard.tsx";
import {Tag} from "antd";
import React from "react";
import {Selection} from "@/pages/PlanPage/types/Semester.ts";

interface SelectionFieldProps extends Selection {

}

const SelectionField = ({subjects, name, credits, id}: SelectionFieldProps) => {
    return (
        <div className={"flex flex-col bg-blue-400/[0.05] border-2 border-dashed border-blue-200 px-2 rounded-lg"}>
            <div className={"flex justify-between py-2"}>
                <span className={"text-blue-400 font-bold"}>
                    {name}
                </span>
                <Tag color={"blue"} className={"m-0"} bordered={false}>{`${credits} ЗЕТ`}</Tag>
            </div>
            <div className={"flex gap-3 flex-1 items-center justify-center"}>
                {
                    subjects.length ?
                    subjects.map(subject => <SortableSubjectCard key={subject.id} {...subject}/>)
                        : <span className={"text-blue-400 max-w-[250px] text-center my-auto px-2"}>Перенесите дисциплину внутрь для добавления в выбор </span>
                }
            </div>
        </div>
    )
}

export default SelectionField;