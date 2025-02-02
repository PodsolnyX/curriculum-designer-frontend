import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import React from "react";
import {Track} from "@/pages/planPage/types/Semester.ts";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {ModuleSemestersPosition} from "@/pages/planPage/provider/types.ts";

interface TrackFieldProps extends Track {
    position?: ModuleSemestersPosition;
}

const TrackField = ({subjects, name, id, color, position = "single"}: TrackFieldProps) => {

    const { overItemId } = usePlan();

    const { setNodeRef } = useDroppable({
        id
    });

    const styles: Record<ModuleSemestersPosition, string> = {
        "single": `mt-16 border-2 rounded-lg`,
        "first": `h-max mt-auto border-2 rounded-t-lg`,
        "middle": `border-x-2 border-b-2`,
        "last": `h-max border-x-2 border-b-2 rounded-b-lg mb-5`
    }

    return (
        <div
            className={`${styles[position]} flex w-[230px] flex-col border-dotted pb-2 px-3 ${overItemId === id ? "border-blue-300" : ""}`}
            ref={setNodeRef}
            style={{backgroundColor: `${color}20`, borderColor: color}}
        >
            {
                (position === "first" || position === "single") ?
                    <div className={"flex justify-center py-2"}>
                        <span className={"font-bold text-center overflow-hidden text-nowrap text-ellipsis"} style={{color}}>
                            {name}
                        </span>
                    </div> : null
            }
            <div className={"grid grid-cols-1 gap-3 items-center h-full pt-14"}>
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
}

export default TrackField;