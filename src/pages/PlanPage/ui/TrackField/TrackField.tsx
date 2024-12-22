import SortableSubjectCard from "@/pages/PlanPage/ui/SubjectCard/SortableSubjectCard.tsx";
import React from "react";
import {Track} from "@/pages/PlanPage/types/Semester.ts";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import {usePlan} from "@/pages/PlanPage/provider/PlanProvider.tsx";
import {ModuleSemestersPosition} from "@/pages/PlanPage/provider/types.ts";

interface TrackFieldProps extends Track {}

const TrackField = ({subjects, name, id}: TrackFieldProps) => {

    const { overItemId, getTrackSemesterPosition, displaySettings } = usePlan();

    const { setNodeRef } = useDroppable({
        id
    });

    const { position, color } = getTrackSemesterPosition(id);

    const styles: Record<ModuleSemestersPosition, string> = {
        "single": `mt-16 border-2 rounded-lg`,
        "first": `h-max mt-auto relative pb-3 mt-20 border-2 rounded-t-lg after:content-[''] after:w-full after:h-[2px] after:bg-[${color}] after:absolute after:bottom-[-2px] after:left-0`,
        "middle": `${displaySettings.academicHours ? "pt-20" : "pt-3"} py-3 relative border-x-2 border-b-2 after:content-[''] after:w-full after:h-[2px] after:bg-[${color}] after:absolute after:bottom-[-2px] after:left-0`,
        "last": `${displaySettings.academicHours ? "pt-20" : "pt-3"} h-max py-3 pt-20 border-x-2 border-b-2 rounded-b-lg mb-5`
    }

    return (
        <div
            className={`${styles[position]} flex w-[230px] flex-col border-dashed px-3 ${overItemId === id ? "border-blue-300" : ""}`}
            ref={setNodeRef}
            style={{backgroundColor: `${color}20`, borderColor: color}}
        >
            {
                position === "first" ?
                    <div className={"flex justify-center py-2"}>
                        <span className={"font-bold text-center overflow-hidden text-nowrap text-ellipsis"} style={{color}}>
                            {name}
                        </span>
                    </div> : null
            }
            <div className={"grid grid-cols-1 gap-3 items-center h-full"}>
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