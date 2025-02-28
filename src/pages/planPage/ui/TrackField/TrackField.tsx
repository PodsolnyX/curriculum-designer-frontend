import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import React, {forwardRef} from "react";
import {Track} from "@/pages/planPage/types/Semester.ts";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {ModuleSemestersPosition} from "@/pages/planPage/provider/types.ts";

interface TrackFieldProps extends Track {
    position?: ModuleSemestersPosition;
    height?: number;
}

const TrackField = forwardRef<HTMLDivElement, TrackFieldProps>((props, ref) => {

    const {id, name, color, position = "single", subjects, height} = props;

    const { overItemId } = usePlan();

    const { setNodeRef } = useDroppable({
        id
    });

    const styles: Record<ModuleSemestersPosition, string> = {
        "single": `border-2 rounded-lg`,
        "first": `border-2 rounded-t-lg`,
        "middle": `border-x-2 border-b-2`,
        "last": `border-x-2 border-b-2 rounded-b-lg`
    }

    return (
        <div
            className={`${styles[position]} border-dotted h-full pb-2 px-3 ${overItemId === id ? "border-blue-300" : ""}`}
            ref={setNodeRef}
            style={{
                backgroundColor: `${color}20`,
                borderColor: color
            }}
        >
            <div ref={ref} className={"flex flex-col"}>
                {
                    (position === "first" || position === "single") ?
                        <div className={"flex justify-center py-2 max-w-[200px]"}>
                        <span className={"font-bold text-center overflow-hidden text-nowrap text-ellipsis"} style={{color}}>
                            {name}
                        </span>
                        </div> : null
                }
                <div className={`grid grid-cols-1 gap-3 items-center pt-14`}>
                    <SortableContext items={subjects} id={id}>
                        {
                            subjects.length ?
                                subjects.map(subject => <SortableSubjectCard key={subject.id} {...subject}/>)
                                : null
                        }
                    </SortableContext>
                </div>
            </div>
        </div>
    )
})

export default TrackField;