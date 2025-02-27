import {AtomDto, ModuleDto, RefModuleSemesterDto} from "@/api/axios-client.types.ts";
import React, {memo, useMemo, useState} from "react";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {App, Typography} from "antd";
import {useUpdateModuleMutation} from "@/api/axios-client/ModuleQuery.ts";
import {concatIds, getIdFromPrefix, setPrefixToId} from "@/pages/planPage/provider/parseCurriculum.ts";
import {useDroppable} from "@dnd-kit/core";
import {useCreateEntity} from "@/pages/planPage/hooks/useCreateEntity.ts";
import {CursorMode, ModuleSemestersPosition} from "@/pages/planPage/provider/types.ts";
import SortableSubjectCard from "@/pages/planPage/ui/SubjectCard/SortableSubjectCard.tsx";
import {Container, usePositions} from "@/pages/planPage/provider/PositionsProvider.tsx";

interface ModuleAreaProps extends ModuleDto {
    columnIndex: number;
}

const ModuleArea = (props: ModuleAreaProps) => {

    const {
        id,
        name,
        semesters,
        atoms,
        columnIndex
    } = props;

    const {getTopCoordinate, getHorizontalCoordinate} = usePositions();

    const gridColumnsCount = useMemo(() => {
        const averageAtomsCount = atoms.reduce((sum, atom) => sum + atom.semesters.length, 0) / semesters.length;
        if (averageAtomsCount < 3) return 1;
        if (averageAtomsCount < 5) return 2;
        if (averageAtomsCount < 7) return 3;
        if (averageAtomsCount < 9) return 4;
        return 5;
    }, [atoms, semesters])

    const x = getHorizontalCoordinate(
        setPrefixToId(semesters[0]?.semester.id || "", "semesters"),
       setPrefixToId(id, "modules")
    );

    return (
        <div className={`absolute`} style={{left: `${x}px`, top: `${getTopCoordinate(setPrefixToId(semesters[0]?.semester.id || "", "semesters"))}px`}}>
            {
                semesters
                    .sort((a, b) => a.semester.number - b.semester.number)
                    .map((semester, index) =>
                    <ModuleField
                        key={semester.semester.id}
                        id={id}
                        gridColumnsCount={gridColumnsCount}
                        name={name}
                        semester={semester}
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
    position: ModuleSemestersPosition;
    semester: RefModuleSemesterDto;
    gridColumnsCount?: number;
}

const ModuleField = memo((props: ModuleFieldProps) => {

    const {id, atoms, name, position, semester, gridColumnsCount = 1} = props;

    const rowId = setPrefixToId(semester.semester.id, "semesters");
    const containerId = setPrefixToId(id, "modules");

    const { overItemId, toolsOptions } = usePlan();
    const {message} = App.useApp();
    const [onAdd, setOnAdd] = useState(false);

    const [newName, setNewName] = useState(name);

    const {mutate: editModule} = useUpdateModuleMutation(Number(getIdFromPrefix(String(id))), {
        onSuccess: () => {
            message.success("Модуль успешно обновлен")
        }
    });

    const { setNodeRef } = useDroppable({
        id
    });

    const {onCreate} = useCreateEntity();

    const styles: Record<ModuleSemestersPosition, string> = {
        "single": `border-2 rounded-lg`,
        "first": `relative pb-3 border-2 rounded-t-lg after:content-[''] after:w-full after:h-[2px] after:bg-stone-500 after:absolute after:bottom-[-2px] after:left-0`,
        "middle": `py-3 relative border-x-2 border-b-2 after:content-[''] after:w-full after:h-[2px] after:bg-stone-500 after:absolute after:bottom-[-2px] after:left-0`,
        "last": ` py-3 border-x-2 border-b-2 rounded-b-lg`
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
            rootClassName={`${styles[position]} flex w-full flex-col relative border-dashed px-2 ${(onAdd) ? "cursor-pointer" : ""} ${(overItemId === id || onAdd) ? "border-blue-300" : "border-stone-500"}`}
        >
            <div
                onMouseEnter={onHover} onMouseLeave={onLeave}
                ref={setNodeRef}
            >
                {
                    (position === "first" || position === "single") ?
                        <div className={"flex justify-center py-2"}>
                            <Typography.Text
                                editable={{icon: null, triggerType: ["text"]}}
                                className={"text-black font-bold text-center overflow-hidden text-nowrap text-ellipsis cursor-text"}
                                style={{width: `${gridColumnsCount * 180}px`}}
                            >
                                {newName}
                            </Typography.Text>
                        </div> : null
                }
                <div className={"grid gap-2 pb-2"} style={{gridTemplateColumns: `repeat(${gridColumnsCount}, 1fr)`}}>
                    {
                        atoms.filter(atom => atom.semesters.some(_semester => _semester.semester.id === semester.semester.id)).map(atom => <SortableSubjectCard
                            key={String(atom.id)}
                            type={atom.type}
                            neighboringSemesters={{prev: null, next: null}}
                            id={concatIds(setPrefixToId(semester.semester.id, "semesters"),setPrefixToId(atom.id, "atoms"))}
                            name={atom.name}
                            isRequired={atom.isRequired}
                        />)
                    }
                </div>
            </div>
        </Container>
    )
})

export default ModuleArea;