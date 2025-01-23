import {TrackSelection} from "@/pages/planPage/types/Semester.ts";
import TrackField from "@/pages/planPage/ui/TrackField/TrackField.tsx";
import React from "react";
import {ModuleSemestersPosition} from "@/pages/planPage/provider/types.ts";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";

interface TrackSelectionProps extends TrackSelection {

}

const TrackSelectionField = (props: TrackSelectionProps) => {

    const { name, tracks } = props;
    const { displaySettings } = usePlan();

    const position = "first";

    const styles: Record<ModuleSemestersPosition, string> = {
        "single": `mt-16 border-2 rounded-lg h-max`,
        "first": `h-max mt-auto relative pb-3 mt-20 border-2 rounded-t-lg after:content-[''] after:w-full after:h-[2px] after:bg-stone-500 after:absolute after:bottom-[-2px] after:left-0`,
        "middle": `${displaySettings.academicHours ? "pt-20" : "pt-3"} py-3 relative border-x-2 border-b-2 after:content-[''] after:w-full after:h-[2px] after:bg-stone-500 after:absolute after:bottom-[-2px] after:left-0`,
        "last": `${displaySettings.academicHours ? "pt-20" : "pt-3"} h-max py-3 pt-20 border-x-2 border-b-2 rounded-b-lg mb-5`
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