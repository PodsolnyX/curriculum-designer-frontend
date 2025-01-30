import {TrackSelection} from "@/pages/planPage/types/Semester.ts";
import TrackField from "@/pages/planPage/ui/TrackField/TrackField.tsx";
import React from "react";
import {ModuleSemestersPosition} from "@/pages/planPage/provider/types.ts";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";

interface TrackSelectionProps extends TrackSelection {

}

const TrackSelectionField = (props: TrackSelectionProps) => {

    const { id, name, tracks } = props;
    const { displaySettings, getTrackSemesterPosition } = usePlan();

    const {position} = getTrackSemesterPosition(id);

    const styles: Record<ModuleSemestersPosition, string> = {
        "single": `mt-16 border-2 rounded-lg h-max`,
        "first": `h-max mt-auto relative mt-20 border-x-2 border-t-2 rounded-t-lg`,
        "middle": `relative border-x-2`,
        "last": `h-max border-x-2 border-b-2 rounded-b-lg mb-5`
    }

    return (
        <div className={`${styles[position]} flex flex-col relative border-dashed px-3 border-stone-500`}>
            {
                (position === "first" || position === "single") ?
                    <div className={"flex justify-center py-2"}>
                        <span className={"text-black font-bold text-center overflow-hidden text-nowrap text-ellipsis"}>
                            {name}
                        </span>
                    </div> : null
            }
            <div className={"flex gap-3 h-full"}>
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