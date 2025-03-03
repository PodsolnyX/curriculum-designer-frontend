import {AtomDto, RefModuleSemesterDto, SelectionDto} from "@/api/axios-client.types.ts";
import React, {CSSProperties, memo, useMemo, useState} from "react";
import {ModuleShortDto, usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {App, Typography} from "antd";
import {useUpdateModuleMutation} from "@/api/axios-client/ModuleQuery.ts";
import {
    concatIds, cutSemesterIdFromId,
    getIdFromPrefix,
    setPrefixToId
} from "@/pages/planPage/provider/prefixIdHelpers.ts";
import {useDroppable} from "@dnd-kit/core";
import {useCreateEntity} from "@/pages/planPage/hooks/useCreateEntity.ts";
import {CursorMode, ModuleSemestersPosition} from "@/pages/planPage/provider/types.ts";
import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import {PositionContainer, usePositions} from "@/pages/planPage/provider/PositionsProvider.tsx";
import TrackSelectionField from "@/pages/planPage/ui/TrackSelectionField/TrackSelectionField.tsx";

interface ModuleAreaProps extends ModuleShortDto {}

const ModuleArea = (props: ModuleAreaProps) => {

    const {
        id,
        name,
        semesters,
        selection,
        atoms,
        modules
    } = props;

    const {getAtoms} = usePlan()
    const {getTopCoordinate, getHorizontalCoordinate} = usePositions();

    const atomsInfo = useMemo(() => getAtoms(atoms), [getAtoms, atoms])

    const gridColumnsCount = useMemo(() => {
        const averageAtomsCount = atomsInfo.reduce((sum, atom) => sum + atom.semesters.length, 0) / semesters.length;
        return ~~((averageAtomsCount + 1) / 2) || 1
    }, [atomsInfo, semesters])

    const x = getHorizontalCoordinate(
        setPrefixToId(semesters?.[0]?.semester.id || "", "semesters"),
        setPrefixToId(id, "modules")
    ) || 0;

    const getModuleId = (id: number, semesterId: number) => concatIds(setPrefixToId(semesterId, "semesters"), setPrefixToId(id, "modules"));

    return (
        <div
            className={`absolute border-2 border-dashed rounded-md ${(selection && !modules.length) ? "bg-blue-700/[.05] border-blue-400" : "bg-stone-700/[.05] border-stone-500"}`}
            style={{
                marginTop: 4,
                marginBottom: 4,
                left: `${x}px`,
                top: `${getTopCoordinate(setPrefixToId(semesters[0]?.semester.id || "", "semesters"))}px`
            }}
        >
            {
                semesters
                    .sort((a, b) => a.semester.number - b.semester.number)
                    .map((semester, index) => {

                        const moduleId = getModuleId(id, semester.semester.id);

                        return (
                            (selection && modules.length) ?
                                <TrackSelectionField
                                    id={moduleId}
                                    key={semester.semester.id}
                                    semesterNumber={index + 1}
                                    credits={selection.semesters[index]?.credit || 0}
                                    semesterId={semester.semester.id}
                                    tracks={modules}
                                    name={name}
                                    position={(index === 0 && semesters.length <= 1) ? "single" : index === 0 ? "first" : index === semesters.length - 1 ? "last" : "middle"}
                                />
                                : <ModuleField
                                    key={semester.semester.id}
                                    id={moduleId}
                                    gridColumnsCount={gridColumnsCount}
                                    name={name}
                                    semester={semester}
                                    selection={selection}
                                    position={(index === 0 && semesters.length <= 1) ? "single" : index === 0 ? "first" : index === semesters.length - 1 ? "last" : "middle"}
                                    atomsIds={getModuleAtomsIds(atomsInfo, semester.semester.id, moduleId)}
                                />
                        )
                    })
            }
        </div>
    )
}

interface ModuleFieldProps {
    id: string;
    name: string;
    atomsIds: string[];
    selection?: SelectionDto | null;
    position: ModuleSemestersPosition;
    semester: RefModuleSemesterDto;
    gridColumnsCount?: number;
}

const ModuleField = memo((props: ModuleFieldProps) => {

    const {
        id,
        atomsIds,
        name,
        position,
        semester,
        selection,
        gridColumnsCount = 1
    } = props;

    const rowId = setPrefixToId(semester.semester.id, "semesters");
    const containerId = cutSemesterIdFromId(id);

    const {overItemId, toolsOptions} = usePlan();
    const {message} = App.useApp();
    const [onAdd, setOnAdd] = useState(false);

    const [newName, setNewName] = useState(name);

    const {mutate: editModule} = useUpdateModuleMutation(Number(getIdFromPrefix(String(id))), {
        onSuccess: () => {
            message.success("Модуль успешно обновлен")
        }
    });

    const {setNodeRef} = useDroppable({
        id
    });

    const {onCreate} = useCreateEntity();

    const getFieldClassName = () => {
        if (["first", "middle"].includes(position)) {
            return `relative after:content-[''] after:w-full after:h-[2px] after:absolute after:bottom-[-2px] after:left-0 ${selection ? "after:bg-blue-300" : "after:bg-stone-500"}`
        }
        return ""
    }

    const onHover = () => {
        if (toolsOptions.cursorMode === CursorMode.Create)
            setOnAdd(true)
    }

    const onLeave = () => {
        setOnAdd(false)
    }

    // const onAddSubject = (event: React.MouseEvent<HTMLDivElement>) => {
    //     if (onAdd) {
    //         event.stopPropagation()
    //         onCreate(semesterId, id)
    //     }
    // }
    //
    // const onNameChange = (value: string) => {
    //     setNewName(value);
    //     if (name !== value) {
    //         editModule({name: value})
    //     }
    // }

    return (
        <PositionContainer
            countHorizontalCoordinates={true}
            rowId={rowId}
            id={containerId}
            rootStyles={(height) => getModuleRootStyles(height, position)}
            rootClassName={`${getFieldClassName()} flex w-full flex-col relative border-dashed ${(onAdd) ? "cursor-pointer" : ""} ${(overItemId === id || onAdd) ? "bg-blue-300/[.3]" : ""}`}
            childrenClassName={"min-h-max"}
            ref={setNodeRef}
        >
            <div
                onMouseEnter={onHover} onMouseLeave={onLeave}
                ref={setNodeRef}
            >
                {
                    (position === "first" || position === "single") ?
                        <div className={"flex justify-center p-2 pb-0"}>
                            <Typography.Text
                                editable={{icon: null, triggerType: ["text"]}}
                                className={`${selection ? "text-blue-400" : "text-black"} font-bold text-center overflow-hidden text-nowrap text-ellipsis cursor-text`}
                                style={{width: `${gridColumnsCount * 200}px`}}
                            >
                                {newName}
                            </Typography.Text>
                        </div> : null
                }
                <div className={"grid gap-2 p-2"} style={{gridTemplateColumns: `repeat(${gridColumnsCount}, 1fr)`}}>
                    {
                        atomsIds.map(atom =>
                            <SortableSubjectCard key={atom} id={atom}/>
                        )
                    }
                </div>
            </div>
        </PositionContainer>
    )
})

export const getModuleAtomsIds = (atoms: AtomDto[], semesterId: number, moduleId: string) => {

    const getAtomId = (id: number, moduleId: string) => concatIds(moduleId, setPrefixToId(id, "subjects"));

    return atoms
        .filter(atom => atom.semesters.some(semester => semester.semester.id === semesterId))
        .map(atom => getAtomId(atom.id, moduleId))
}

export const getModuleRootStyles = (height: number, position: ModuleSemestersPosition): CSSProperties => {
    return position === "single"
        ? {height: height - 8}
        : ["first", "last"].includes(position)
            ? {height: height - 6}
            : {height}
}

export default ModuleArea;