import React, {useState} from "react";
import {CursorMode, ModuleSemestersPosition} from "@/pages/planPage/provider/types.ts";
import CreditsSelector from "@/pages/planPage/ui/CreditsSelector.tsx";
import {PositionContainer} from "@/pages/planPage/provider/PositionsProvider.tsx";
import {
    concatIds,
    cutSemesterIdFromId,
    getIdFromPrefix,
    setPrefixToId
} from "@/pages/planPage/provider/prefixIdHelpers.ts";
import {getModuleAtomsIds, getModuleRootStyles} from "@/pages/planPage/ui/ModuleField/ModuleArea.tsx";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import {useCreateEntity} from "@/pages/planPage/hooks/useCreateEntity.ts";

interface TrackSelectionProps {
    id: string;
    tracks: number[];
    name?: string;
    credits: number;
    semesterNumber?: number;
    semesterId: number;
    position?: ModuleSemestersPosition;
}

const TrackSelectionField = (props: TrackSelectionProps) => {

    const {
        id,
        name,
        tracks,
        credits,
        semesterNumber = 0,
        semesterId,
        position = "single" as ModuleSemestersPosition,
    } = props;

    return (
        <PositionContainer
            id={cutSemesterIdFromId(id)}
            rowId={setPrefixToId(semesterId, "semesters")}
            countHeights={true}
            countHorizontalCoordinates={true}
            rootStyles={(height) => getModuleRootStyles(height, position)}
            rootClassName={`relative px-2 flex`}
            childrenClassName={"flex flex-1 flex-col min-h-max"}
        >
            {
                (position === "first" || position === "single") ?
                    <div className={"flex justify-center py-2 min-w-[200px]"}>
                        <span
                            className={"text-black font-bold text-center overflow-hidden text-nowrap text-ellipsis"}>
                            {name}
                        </span>
                    </div> : null
            }
            <div className={"flex flex-1 relative gap-3"} id={id}>
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
                        tracks.map((track, index) => {

                            const colors = ["#25b600", "#8019f1", "#e80319", "#f56b0a"];

                            return (
                                <TrackField
                                    key={track}
                                    id={concatIds(id, setPrefixToId(track, "modules"))}
                                    semesterId={semesterId}
                                    color={colors[index]}
                                    position={position}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </PositionContainer>
    )
}

interface TrackFieldProps {
    id: string;
    color: string;
    semesterId: number;
    position?: ModuleSemestersPosition;
}

const TrackField = (props: TrackFieldProps) => {

    const {
        id,
        color,
        position = "single",
        semesterId
    } = props;

    const { overItemId, getModule, getAtoms, toolsOptions } = usePlan();

    const { setNodeRef } = useDroppable({
        id
    });

    const [isHover, setIsHover] = useState(false);

    const {onCreate} = useCreateEntity();

    const styles: Record<ModuleSemestersPosition, string> = {
        "single": `border-2 rounded-lg`,
        "first": `border-2 rounded-t-lg`,
        "middle": `border-x-2 border-b-2`,
        "last": `border-x-2 border-b-2 rounded-b-lg`
    }

    const module = getModule(Number(getIdFromPrefix(id)));

    if (!module) return null;

    const {name, atoms} = module;

    const atomsIds = getModuleAtomsIds(getAtoms(atoms), semesterId, id);

    const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (toolsOptions.cursorMode === CursorMode.Create) {
            event.stopPropagation()
            onCreate(semesterId, Number(getIdFromPrefix(id)))
        }
    }

    return (
        <div
            className={`${styles[position]} border-dotted h-full pb-2 px-3 min-w-[200px]`}
            ref={setNodeRef}
            style={{
                backgroundColor: (overItemId === id || isHover) ? `${color}35` : `${color}20`,
                borderColor: color
            }}
            onClick={onClick}
            onMouseLeave={() => toolsOptions.cursorMode === CursorMode.Create && setIsHover(false)}
            onMouseEnter={() => toolsOptions.cursorMode === CursorMode.Create && setIsHover(true)}
            id={id}
        >
            <div className={"flex flex-col"}>
                {
                    (position === "first" || position === "single") ?
                        <div className={"flex justify-center py-2 max-w-[200px]"}>
                            <span className={"font-bold text-center overflow-hidden text-nowrap text-ellipsis"} style={{color}}>
                                {name}
                            </span>
                        </div> : null
                }
                <div className={`grid grid-cols-1 gap-3 items-center pt-14`}>
                    <SortableContext items={atomsIds} id={id}>
                        { atomsIds.map(atom => <SortableSubjectCard key={atom} id={atom}/>) }
                    </SortableContext>
                </div>
            </div>
        </div>
    )
}

export default TrackSelectionField;