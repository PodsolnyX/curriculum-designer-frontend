import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import {App, Tag, Typography} from "antd";
import React, {memo, useState} from "react";
import {Selection} from "@/pages/planPage/types/Semester.ts";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {getIdFromPrefix} from "@/pages/planPage/provider/parseCurriculum.ts";
import {ModuleSemestersPosition} from "@/pages/planPage/provider/types.ts";
import {useCreateUpdateSelectionMutation} from "@/api/axios-client/SelectionQuery.ts";

interface SelectionFieldProps extends Selection {
    columnIndex: number;
}

const SelectionField = memo(({subjects, name, credits, id, columnIndex}: SelectionFieldProps) => {

    const { overItemId, getSelectionPosition } = usePlan();
    const { setNodeRef } = useDroppable({
        id
    });
    const {message} = App.useApp();

    const [newName, setNewName] = useState(name);

    const {mutate: editSelection} = useCreateUpdateSelectionMutation(Number(getIdFromPrefix(id)), {
        onSuccess: () => {
            message.success("Выбор успешно обновлен")
        }
    });

    const onNameChange = (value: string) => {
        setNewName(value);
        if (name !== value) {
            editSelection({name: value})
        }
    }

    const {position} = getSelectionPosition(id);

    const styles: Record<ModuleSemestersPosition, string> = {
        "single": `h-max my-auto border-2 rounded-lg`,
        "first": `h-max mt-auto relative pb-3 border-2 rounded-t-lg after:content-[''] after:w-full after:h-[2px] after:bg-blue-300 after:absolute after:bottom-[-2px] after:left-0`,
        "middle": `py-3 relative border-x-2 border-b-2 after:content-[''] after:w-full after:h-[2px] after:bg-blue-300 after:absolute after:bottom-[-2px] after:left-0`,
        "last": `h-max py-3 border-x-2 border-b-2 rounded-b-lg mb-5`
    }

    return (
        <div
            className={`${styles[position]} flex flex-col w-max border-dashed h-max px-2 ${overItemId === id ? "border-blue-300 bg-blue-400/[0.1]" : "border-blue-200 bg-blue-400/[0.05]"}`}
            ref={setNodeRef}
            style={{gridColumn: columnIndex}}
        >
            {
                (position === "first" || position === "single") ?
                    <div className={"flex justify-between py-2 gap-1"}>
                        <Typography.Text
                            editable={{icon: null, triggerType: ["text"], onChange: onNameChange}}
                            rootClassName={`text-blue-400 font-bold overflow-hidden text-nowrap text-ellipsis cursor-text`}
                            style={{maxWidth: 160 * subjects.length}}
                        >
                            {newName}
                        </Typography.Text>
                        <Tag color={"blue"} className={"m-0 h-max"} bordered={false}>{`${credits} ЗЕТ`}</Tag>
                    </div> : null
            }
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