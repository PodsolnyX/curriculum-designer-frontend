import {TrackSelection} from "@/pages/planPage/types/Semester.ts";
import TrackField from "@/pages/planPage/ui/TrackField/TrackField.tsx";
import React from "react";
import {ModuleSemestersPosition} from "@/pages/planPage/provider/types.ts";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import CreditsSelector from "@/pages/planPage/ui/CreditsSelector.tsx";
import {Container, usePositionContainer, usePositions} from "@/pages/planPage/provider/PositionsProvider.tsx";
import {getModuleRootStyles} from "@/pages/planPage/ui/ModuleField/ModuleArea.tsx";

interface TrackSelectionProps extends TrackSelection {
    position?: ModuleSemestersPosition;
    semesterNumber?: number;
    semesterId: string;
    _id: string;
}

const TrackSelectionField = (props: TrackSelectionProps) => {

    const {
        _id,
        name,
        tracks,
        credits,
        semesterNumber = 0,
        semesterId,
        position = "single" as ModuleSemestersPosition,
    } = props;

    // const {contentRef, maxHeight} = usePositionContainer({
    //     rowId: semesterId,
    //     containerId: _id,
    //     countHeights: true,
    //     countHorizontalCoordinates: true
    // })

    const {getMaxHeight} = usePositions()

    const getStyle = (height: number): React.CSSProperties => {
        return position === "single" ? {height: height - 8} : ["first", "last"].includes(position) ? {height: height - 6} : {height}
    }

    const maxHeight = getMaxHeight(semesterId);

    console.log(maxHeight)

    return (
        <Container
            id={_id}
            rowId={semesterId}
            countHeights={true}
            countHorizontalCoordinates={true}
            rootStyles={(height) => getStyle(height)}
            rootClassName={`relative px-2 flex`}
            childrenClassName={"flex flex-1 flex-col min-h-max"}
        >
            {
                (position === "first" || position === "single") ?
                    <div className={"flex justify-center py-2"}>
                        <span
                            className={"text-black font-bold text-center overflow-hidden text-nowrap text-ellipsis"}>
                            {name}
                        </span>
                    </div> : null
            }
            <div className={"flex flex-1 relative gap-3"}>
                <div
                    className={`w-full absolute left-0 z-10 py-2 px-3 ${position === "first" ? "top-9" : "top-0"}`}>
                    <div
                        className={"p-2 px-3 bg-white rounded-lg shadow-md text-blue-500 items-center flex justify-between"}>
                        {`Семестр ${semesterNumber}`}
                        <CreditsSelector credits={credits}/>
                    </div>
                </div>
                <div className={`grid gap-3 ${position === "last" ? "pb-2" : ""}`}
                     style={{
                         gridTemplateColumns: `repeat(${tracks.length}, 1fr)`,
                        }}>
                    {
                        tracks.map(track =>
                            <TrackField key={track.id} height={maxHeight} {...track} position={position}/>
                        )
                    }
                </div>

            </div>


        </Container>
    )
}

export default TrackSelectionField;