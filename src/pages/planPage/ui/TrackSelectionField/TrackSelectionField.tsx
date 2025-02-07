import {TrackSelection} from "@/pages/planPage/types/Semester.ts";
import TrackField from "@/pages/planPage/ui/TrackField/TrackField.tsx";
import React from "react";
import {ModuleSemestersPosition} from "@/pages/planPage/provider/types.ts";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import CreditsSelector from "@/pages/planPage/ui/CreditsSelector.tsx";

interface TrackSelectionProps extends TrackSelection {
    columnIndex: number;
}

const TrackSelectionField = (props: TrackSelectionProps) => {

    const { id, name, tracks, columnIndex, credits } = props;
    const { getTrackSemesterPosition } = usePlan();

    const {position, semesterNumber} = getTrackSemesterPosition(id);

    const styles: Record<ModuleSemestersPosition, string> = {
        "single": `mt-16 border-2 rounded-lg h-max`,
        "first": `h-max mt-auto relative mt-20 border-x-2 border-t-2 rounded-t-lg`,
        "middle": `relative border-x-2`,
        "last": `h-max border-x-2 border-b-2 rounded-b-lg mb-5`
    }

    return (
        <div className={`${styles[position]} w-max flex flex-col relative border-dashed px-3 border-stone-500`} style={{gridColumn: columnIndex}}>
            {
                (position === "first" || position === "single") ?
                    <div className={"flex justify-center py-2"}>
                        <span className={"text-black font-bold text-center overflow-hidden text-nowrap text-ellipsis"}>
                            {name}
                        </span>
                    </div> : null
            }
            <div className={"flex relative gap-3 h-full"}>
                <div className={`w-full absolute left-0 z-10 py-2 px-3 ${position === "first" ? "top-9" : "top-0"}`}>
                    <div className={"p-2 px-3 bg-white rounded-lg shadow-md text-blue-500 items-center flex justify-between"}>
                        {`Семестр ${semesterNumber}`}
                        <CreditsSelector credits={credits}/>
                    </div>
                </div>
                {
                    tracks.map(track =>
                        <TrackField key={track.id} {...track} position={position}/>
                    )
                }
            </div>
        </div>
    )
}

export default TrackSelectionField;