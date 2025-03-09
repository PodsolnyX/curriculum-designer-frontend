import {AtomDto, RefModuleSemesterDto, SelectionDto, ValidationErrorType} from "@/api/axios-client.types.ts";
import React, {CSSProperties, useMemo, useState} from "react";
import {App, Tag, Typography} from "antd";
import {useUpdateModuleMutation} from "@/api/axios-client/ModuleQuery.ts";
import {
    concatIds,
    cutSemesterIdFromId,
    getIdFromPrefix,
    setPrefixToId
} from "@/pages/planPage/provider/prefixIdHelpers.ts";
import {useDroppable} from "@dnd-kit/core";
import {useCreateEntity} from "@/pages/planPage/hooks/useCreateEntity.ts";
import {CursorMode, ModuleSemestersPosition} from "@/pages/planPage/provider/types.ts";
import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import TrackSelectionField from "@/pages/planPage/ui/TrackSelectionField/TrackSelectionField.tsx";
import CreditsSelector from "@/pages/planPage/ui/CreditsSelector.tsx";
import {observer} from "mobx-react-lite";
import {optionsStore} from "@/pages/planPage/lib/stores/optionsStore.ts";
import {componentsStore, ModuleShortDto} from "@/pages/planPage/lib/stores/componentsStore.ts";
import {commonStore} from "@/pages/planPage/lib/stores/commonStore.ts";
import {positionsStore} from "@/pages/planPage/lib/stores/positionsStore.ts";
import {PositionContainer} from "@/pages/planPage/ui/PositionContainer/PositionContainer.tsx";

interface ModuleAreaProps extends ModuleShortDto {}

const ModuleArea = observer((props: ModuleAreaProps) => {

    const {
        id,
        name,
        semesters,
        selection,
        atoms,
        modules
    } = props;

    const atomsInfo = useMemo(() => componentsStore.getAtoms(atoms), [atoms])

    const gridColumnsCount = useMemo(() => {
        const averageAtomsCount = atomsInfo.reduce((sum, atom) => sum + atom.semesters.length, 0) / semesters.length;
        return ~~((averageAtomsCount + 1) / 2) || 1
    }, [atomsInfo, semesters])

    const x = positionsStore.getHorizontalCoordinate(
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
                top: `${positionsStore.getTopCoordinate(setPrefixToId(semesters[0]?.semester.id || "", "semesters"))}px`
            }}
        >
            {
                [...semesters]
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
                                : <SortableModuleField
                                    key={semester.semester.id}
                                    id={moduleId}
                                    gridColumnsCount={gridColumnsCount}
                                    name={name}
                                    semester={semester}
                                    selection={selection}
                                    semesterIndex={index}
                                    position={(index === 0 && semesters.length <= 1) ? "single" : index === 0 ? "first" : index === semesters.length - 1 ? "last" : "middle"}
                                    atomsIds={getModuleAtomsIds(atomsInfo, semester.semester.id, moduleId)}
                                />
                        )
                    })
            }
        </div>
    )
})

interface ModuleFieldProps {
    id: string;
    name: string;
    atomsIds: string[];
    selection?: SelectionDto | null;
    position: ModuleSemestersPosition;
    semester: RefModuleSemesterDto;
    gridColumnsCount?: number;
    semesterIndex: number;
}

const SortableModuleField = observer((props: ModuleFieldProps) => {

    const isOver = componentsStore.isOver(props.id);

    const { setNodeRef } = useDroppable({
        id: props.id
    });

    return (
        <div ref={setNodeRef}>
            <ModuleField {...props} isOver={isOver}/>
        </div>
    )
})

const ModuleField = observer((props: ModuleFieldProps) => {

    const {
        id,
        atomsIds,
        name,
        position,
        semester,
        selection,
        gridColumnsCount = 1,
        semesterIndex,
        isOver
    } = props;

    const rowId = setPrefixToId(semester.semester.id, "semesters");
    const containerId = cutSemesterIdFromId(id);

    const {message} = App.useApp();

    const [newName, setNewName] = useState(name);
    const errors = commonStore.getValidationErrors(id);

    const {mutate: editModule} = useUpdateModuleMutation(Number(getIdFromPrefix(String(id))), {
        onSuccess: () => {
            message.success("Модуль успешно обновлен")
        }
    });

    const {onCreate} = useCreateEntity();

    const getFieldClassName = () => {
        if (["first", "middle"].includes(position)) {
            return `relative after:content-[''] after:w-full after:h-[2px] after:absolute after:bottom-[-2px] after:left-0 ${selection ? "after:bg-blue-300" : "after:bg-stone-500"}`
        }
        return ""
    }

    const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (optionsStore.toolsOptions.cursorMode === CursorMode.Create) {
            event.stopPropagation()
            onCreate(semester.semester.id, Number(getIdFromPrefix(id)))
        }
    }

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
            rootClassName={`${getFieldClassName()} flex w-full flex-col relative border-dashed ${(optionsStore.toolsOptions.cursorMode === CursorMode.Create) ? "hover:bg-blue-300/[.3] cursor-pointer" : ""} ${isOver ? "bg-blue-300/[.3]" : ""}`}
            childrenClassName={"min-h-max"}
            onClick={onClick}
        >
            <div id={id} className={"flex flex-col gap-2 p-2"}>
                <div style={{width: `${gridColumnsCount * 200}px`}} className={`overflow-hidden text-nowrap text-ellipsis text-center ${selection ? "text-blue-400" : "text-black"}`}>
                    {
                        (position === "first" || position === "single") ?
                            <Typography.Text
                                title={newName}
                                editable={{icon: null, triggerType: ["text"]}}
                                className={`${selection ? "text-blue-400" : "text-black"} font-bold cursor-text`}
                            >
                                {newName}
                            </Typography.Text> : null
                    }
                </div>
                <div className={"flex items-center justify-between bg-white shadow-md rounded-md w-full p-1 px-2"} style={{width: `${gridColumnsCount * 200 + (gridColumnsCount - 1) * 5}px`}}>
                    <Typography.Text className={"text-blue-400 text-sm font-bold"}>Семестр {semesterIndex + 1}</Typography.Text>
                    {
                        selection
                            ? <CreditsSelector
                                error={errors ? errors.some(e => e.type === ValidationErrorType.CreditDistribution) : false}
                                credits={selection.semesters.find(sem => sem.semesterId === semester.semester.id)?.credit || 0}
                            />
                            : <Tag color={"default"} className={"m-0"} bordered={false}>{semester.nonElective.credit} ЗЕТ</Tag>
                    }
                </div>
                <div className={"grid gap-2"} style={{gridTemplateColumns: `repeat(${gridColumnsCount}, 1fr)`}}>
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