import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import React, {memo, useState} from "react";
import {Module} from "@/pages/planPage/types/Semester.ts";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {CursorMode, ModuleSemestersPosition} from "@/pages/planPage/provider/types.ts";
import {useCreateEntity} from "@/pages/planPage/hooks/useCreateEntity.ts";
import {useUpdateModuleMutation} from "@/api/axios-client/ModuleQuery.ts";
import {App, Typography} from "antd";
import {getIdFromPrefix} from "@/pages/planPage/provider/prefixIdHelpers.ts";

interface ModuleFieldProps extends Module {
    columnIndex: number;
}

const ModuleField = memo(({subjects, name, id, columnIndex, semesterId}: ModuleFieldProps) => {

    const { overItemId, getModuleSemesterPosition, toolsOptions } = usePlan();
    const {message} = App.useApp();
    const [onAdd, setOnAdd] = useState(false);

    const [newName, setNewName] = useState(name);

    const {mutate: editModule} = useUpdateModuleMutation(Number(getIdFromPrefix(id)), {
        onSuccess: () => {
            message.success("Модуль успешно обновлен")
        }
    });

    const { setNodeRef } = useDroppable({
        id
    });

    const {position} = getModuleSemesterPosition(id);

    const {onCreate} = useCreateEntity();

    const styles: Record<ModuleSemestersPosition, string> = {
        "single": `h-max my-auto border-2 rounded-lg`,
        "first": `h-max mt-auto relative pb-3 border-2 rounded-t-lg after:content-[''] after:w-full after:h-[2px] after:bg-stone-500 after:absolute after:bottom-[-2px] after:left-0`,
        "middle": `py-3 relative border-x-2 border-b-2 after:content-[''] after:w-full after:h-[2px] after:bg-stone-500 after:absolute after:bottom-[-2px] after:left-0`,
        "last": `h-max py-3 border-x-2 border-b-2 rounded-b-lg mb-5`
    }

    const onHover = () => {
        if (toolsOptions.cursorMode === CursorMode.Create)
            setOnAdd(true)
    }

    const onLeave = () => {
        setOnAdd(false)
    }

    const onAddSubject = (event: React.MouseEvent<HTMLDivElement>) => {
        if (onAdd) {
            event.stopPropagation()
            onCreate(semesterId, id)
        }
    }

    const onNameChange = (value: string) => {
        setNewName(value);
        if (name !== value) {
            editModule({name: value})
        }
    }

    return (
        <div
            onMouseEnter={onHover} onMouseLeave={onLeave} onClick={(event) => onAddSubject(event)}
            className={`${styles[position]} flex w-[230px] flex-col relative border-dashed px-3 ${(onAdd) ? "cursor-pointer" : ""} ${(overItemId === id || onAdd) ? "bg-blue-300" : ""}`}
            ref={setNodeRef}
            style={{gridColumn: columnIndex}}
        >
            {
                (position === "first" || position === "single") ?
                    <div className={"flex justify-center py-2"}>
                        <Typography.Text
                            editable={{icon: null, triggerType: ["text"], onChange: onNameChange}}
                            className={"text-black font-bold text-center overflow-hidden text-nowrap text-ellipsis cursor-text"}
                        >
                            {newName}
                        </Typography.Text>
                    </div> : null
            }
            <div className={"grid grid-cols-1 gap-3 items-center h-full"}>
                <SortableContext items={[...subjects]} id={id}>
                    {
                        subjects.length ?
                            subjects.map(subject => <SortableSubjectCard key={subject.id} {...subject}/>)
                            : <span className={"text-stone-700 max-w-[250px] text-center p-2"}>Перенесите дисциплину внутрь</span>
                    }
                </SortableContext>
            </div>
            {
                overItemId === id &&
                <div className={"w-16 h-16 bg-red-700"}>
                    Добавить в след семестр
                </div>
            }
        </div>
    )
})

export default ModuleField;