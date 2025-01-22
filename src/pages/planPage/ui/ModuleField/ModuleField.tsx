import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import React, {memo, MouseEventHandler, useState} from "react";
import {Module} from "@/pages/planPage/types/Semester.ts";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {ModuleSemestersPosition} from "@/pages/planPage/provider/types.ts";

interface ModuleFieldProps extends Module {
    columnIndex: number;
}

const ModuleField = memo(({subjects, name, id, columnIndex}: ModuleFieldProps) => {

    const { overItemId, getModuleSemesterPosition, displaySettings, toolsOptions } = usePlan();

    const [onAdd, setOnAdd] = useState(false);

    const { setNodeRef } = useDroppable({
        id
    });

    const {position} = getModuleSemesterPosition(id);

    const styles: Record<ModuleSemestersPosition, string> = {
        "single": `mt-16 border-2 rounded-lg h-max`,
        "first": `h-max mt-auto relative pb-3 mt-20 border-2 rounded-t-lg after:content-[''] after:w-full after:h-[2px] after:bg-stone-500 after:absolute after:bottom-[-2px] after:left-0`,
        "middle": `${displaySettings.academicHours ? "pt-20" : "pt-3"} py-3 relative border-x-2 border-b-2 after:content-[''] after:w-full after:h-[2px] after:bg-stone-500 after:absolute after:bottom-[-2px] after:left-0`,
        "last": `${displaySettings.academicHours ? "pt-20" : "pt-3"} h-max py-3 pt-20 border-x-2 border-b-2 rounded-b-lg mb-5`
    }

    const onHover = () => {
        if (toolsOptions.editMode)
            setOnAdd(true)
    }

    const onLeave = () => {
        setOnAdd(false)
    }

    const onAddSubject = (event: React.MouseEvent<HTMLDivElement>) => {
        if (onAdd) {
            event.stopPropagation()
            console.log("Я добавил карточку в модуль")
        }
    }

    return (
        <div
            onMouseEnter={onHover} onMouseLeave={onLeave} onClick={(event) => onAddSubject(event)}
            className={`${styles[position]} flex w-[230px] flex-col relative border-dashed px-3 ${(onAdd) ? "cursor-pointer" : ""} ${(overItemId === id || onAdd) ? "border-blue-300" : "border-stone-500"}`} ref={setNodeRef} style={{gridColumn: columnIndex}}>
            {
                (position === "first" || position === "single") ?
                    <div className={"flex justify-center py-2"}>
                        <span className={"text-black font-bold text-center overflow-hidden text-nowrap text-ellipsis"}>
                            {name}
                        </span>
                    </div> : null
            }
            <div className={"grid grid-cols-1 gap-3 items-center h-full"}>
                {/*{*/}
                {/*    onAdd ? <div className={"absolute w-full z-10 -ml-3 h-full border-sky-500 cursor-pointer border-dashed border-2"}></div>  : null*/}
                {/*}*/}
                <SortableContext items={subjects} id={id}>
                    {
                        subjects.length ?
                            subjects.map(subject => <SortableSubjectCard key={subject.id} {...subject}/>)
                            : null
                            // <span className={"text-stone-700 max-w-[250px] text-center my-auto p-2"}>Перенесите дисциплину внутрь</span>
                    }
                </SortableContext>
            </div>
        </div>
    )
})

export default ModuleField;