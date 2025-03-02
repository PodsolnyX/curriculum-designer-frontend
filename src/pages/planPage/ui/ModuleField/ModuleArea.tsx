import {AtomDto, ModuleDto, RefModuleSemesterDto, SelectionDto} from "@/api/axios-client.types.ts";
import React, {CSSProperties, memo, useMemo, useState} from "react";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {App, Typography} from "antd";
import {useUpdateModuleMutation} from "@/api/axios-client/ModuleQuery.ts";
import {
    concatIds,
    getIdFromPrefix,
    parseTrackSelection,
    setPrefixToId
} from "@/pages/planPage/provider/parseCurriculum.ts";
import {useDroppable} from "@dnd-kit/core";
import {useCreateEntity} from "@/pages/planPage/hooks/useCreateEntity.ts";
import {CursorMode, ModuleSemestersPosition} from "@/pages/planPage/provider/types.ts";
import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import {Container, usePositions} from "@/pages/planPage/provider/PositionsProvider.tsx";
import TrackSelectionField from "@/pages/planPage/ui/TrackSelectionField/TrackSelectionField.tsx";

interface ModuleAreaProps extends ModuleDto {
}

const ModuleArea = (props: ModuleAreaProps) => {

    const {
        id,
        name,
        semesters,
        selection,
        atoms,
        modules
    } = props;

    const {getTopCoordinate, getHorizontalCoordinate} = usePositions();
    const {competences} = usePlan();

    const gridColumnsCount = useMemo(() => {
        const averageAtomsCount = atoms.reduce((sum, atom) => sum + atom.semesters.length, 0) / semesters.length;
        return ~~(averageAtomsCount / 2) || 1
    }, [atoms, semesters])

    const x = getHorizontalCoordinate(
        setPrefixToId(semesters?.[0]?.semester.id || "", "semesters"),
        setPrefixToId(id, "modules")
    ) || 0;

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
                    .map((semester, index) =>
                        modules.length ?
                            <TrackSelectionField
                                _id={setPrefixToId(id, "modules")}
                                key={semester.semester.id}
                                semesterNumber={semester.semester.number}
                                semesterId={setPrefixToId(semester.semester.id, "semesters")}
                                position={(index === 0 && semesters.length <= 1) ? "single" : index === 0 ? "first" : index === semesters.length - 1 ? "last" : "middle"}
                                {...parseTrackSelection(props, {semester: semester.semester, competences, parentId: ""})}
                            />
                        : <ModuleField
                            key={semester.semester.id}
                            id={id}
                            gridColumnsCount={gridColumnsCount}
                            name={name}
                            semester={semester}
                            selection={selection}
                            position={(index === 0 && semesters.length <= 1) ? "single" : index === 0 ? "first" : index === semesters.length - 1 ? "last" : "middle"}
                            atoms={atoms.filter(atom => atom.semesters.some(semester => semester.semester.id === semester.semester.id))}
                        />
                    )
            }
        </div>
    )
}

interface ModuleFieldProps {
    id: number;
    name: string;
    atoms: AtomDto[];
    selection?: SelectionDto | null;
    position: ModuleSemestersPosition;
    semester: RefModuleSemesterDto;
    gridColumnsCount?: number;
}

const ModuleField = memo((props: ModuleFieldProps) => {

    const {
        id,
        atoms,
        name,
        position,
        semester,
        selection,
        gridColumnsCount = 1
    } = props;

    const rowId = setPrefixToId(semester.semester.id, "semesters");
    const containerId = setPrefixToId(id, "modules");

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

    const styles: Record<ModuleSemestersPosition, string> = {
        "single": ``,
        "first": `relative after:content-[''] after:w-full after:h-[2px] after:bg-stone-500 after:absolute after:bottom-[-2px] after:left-0`,
        "middle": `relative after:content-[''] after:w-full after:h-[2px] after:bg-stone-500 after:absolute after:bottom-[-2px] after:left-0`,
        "last": ``
    }

    const selectionStyles: Record<ModuleSemestersPosition, string> = {
        "single": ``,
        "first": `relative after:content-[''] after:w-full after:h-[2px] after:bg-blue-300 after:absolute after:bottom-[-2px] after:left-0`,
        "middle": `relative after:content-[''] after:w-full after:h-[2px] after:bg-blue-300 after:absolute after:bottom-[-2px] after:left-0`,
        "last": ``
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
        <Container
            countHorizontalCoordinates={true}
            rowId={rowId}
            id={containerId}
            rootStyles={(height) => position === "single" ? {height: height - 8} : ["first", "last"].includes(position) ? {height: height - 6} : {height}}
            rootClassName={`${selection ? selectionStyles[position] : styles[position]} flex w-full flex-col relative border-dashed ${(onAdd) ? "cursor-pointer" : ""} ${(overItemId === id || onAdd) ? "" : (selection ? "" : "")}`}
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
                        atoms
                        .filter(atom => atom.semesters
                            .some(_semester => _semester.semester.id === semester.semester.id)
                        )
                        .map(atom =>
                            <SortableSubjectCard
                                key={String(atom.id)}
                                type={atom.type}
                                neighboringSemesters={{prev: null, next: null}}
                                id={concatIds(setPrefixToId(semester.semester.id, "semesters"), setPrefixToId(atom.id, "atoms"))}
                                name={atom.name}
                                isRequired={atom.isRequired}
                            />
                        )
                    }
                </div>
            </div>
        </Container>
    )
})

export const getModuleRootStyles = (height: number, position: ModuleSemestersPosition): CSSProperties => {

    const styles: CSSProperties = {height: "auto"};

    if (!height) return styles;

    if (position === "first" || position === "single" || position === "last") {
        styles["height"] = position === "single" ? height - 10 : height - 5;
    }
    if (position === "middle") {
        styles["height"] = height;
    }
    if (position === "first" || position === "single") {
        styles["marginTop"] = 5;
    }
    if (position === "last" || position === "single") {
        styles["marginBottom"] = 5;
    }

    return styles;
}

export default ModuleArea;