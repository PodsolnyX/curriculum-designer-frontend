import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import {App, Tag, Typography} from "antd";
import React, {memo, useState} from "react";
import {Selection} from "@/pages/planPage/types/Semester.ts";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {getIdFromPrefix} from "@/pages/planPage/provider/parseCurriculum.ts";
import {useUpdateAtomMutation} from "@/api/axios-client/AtomQuery.ts";

interface SelectionFieldProps extends Selection {}

const SelectionField = memo(({subjects, name, credits, id}: SelectionFieldProps) => {

    const { overItemId } = usePlan();
    const { setNodeRef } = useDroppable({
        id
    });
    const {message} = App.useApp();

    const [newName, setNewName] = useState(name);

    const {mutate: editModule} = useUpdateAtomMutation(Number(getIdFromPrefix(id)), {
        onSuccess: () => {
            message.success("Выбор успешно обновлен")
        }
    });

    const onNameChange = (value: string) => {
        setNewName(value);
        if (name !== value) {
            editModule({name: value})
        }
    }

    return (
        <div className={`my-3 flex flex-col w-max border-2 border-dashed h-max px-2 rounded-lg ${overItemId === id ? "border-blue-300 bg-blue-400/[0.1]" : "border-blue-200 bg-blue-400/[0.05]"}`} ref={setNodeRef}>
            <div className={"flex justify-between py-2 gap-1"}>
                <Typography.Text
                    editable={{icon: null, triggerType: ["text"], onChange: onNameChange}}
                    сlassName={`text-blue-400 font-bold overflow-hidden text-nowrap text-ellipsis cursor-text`} style={{maxWidth: 160 * subjects.length}}
                >
                    {newName}
                </Typography.Text>
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