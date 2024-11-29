import type {UniqueIdentifier,} from '@dnd-kit/core';
import {SortableContext,} from '@dnd-kit/sortable';
import SortableSubjectCard from "@/pages/PlanPage/SubjectCard/SortableSubjectCard.tsx";
import {useDroppable} from "@dnd-kit/core";
import {Semester} from "@/pages/PlanPage/types/Semester.ts";

export interface SemesterFieldProps extends Semester {
    isActive?: boolean;
    activeId: UniqueIdentifier | null;
}

export function SemesterField({number, subjects, activeId, id, isActive}: SemesterFieldProps) {

    const { setNodeRef } = useDroppable({
        id
    });

    return (
        <div className={`flex min-h-[120px] relative ${number & 1 ? "bg-stone-200" : "bg-stone-100"}`}>
            <div
                className={`sticky left-0 min-h-full z-10 flex flex-col items-center justify-center p-3 min-w-[50px] backdrop-blur-md bg-white/[0.5]`}>
                <span className={"text-[24px] text-blue-400 font-bold"}>{number}</span>
            </div>
            <div className={`flex flex-1 items-start gap-3 p-5 ${isActive ? "border-blue-400" : "border-transparent"} transition border-2 border-solid`}>
                <SortableContext items={subjects} id={id}>
                    <div className={"flex flex-wrap gap-3 max-w-[120vw] h-full w-full"} ref={setNodeRef}>
                        {
                            subjects.map(subject => (
                                <SortableSubjectCard
                                    id={subject.id}
                                    key={subject.id}
                                    activeId={activeId}
                                    {...subject}
                                />
                            ))
                        }
                    </div>
                </SortableContext>
            </div>
        </div>
    );
}






