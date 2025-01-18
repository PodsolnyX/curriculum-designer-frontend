import PlanPageLayout from "@/widgets/PlanPageLayout/PlanPageLayout.tsx";
import {useParams} from "react-router-dom";
import {Button, List, Popover, Segmented, Typography, Input, Skeleton} from "antd";
import {getPlanMenuItems} from "@/shared/const/planMenuItems.ts";
import React, {CSSProperties, PropsWithChildren, useEffect, useMemo, useState} from "react";
import {CompetenceTypeName} from "@/pages/planPage/const/constants.ts";
import {CompetenceDto, CompetenceType} from "@/api/axios-client.types.ts";
import {
    CloseOutlined,
    DeleteOutlined,
    DownOutlined,
    HolderOutlined,
    MoreOutlined,
    PlusOutlined
} from "@ant-design/icons";
import {
    getCompetencesQueryKey,
    useCreateCompetenceMutation, useDeleteCompetenceMutation,
    useGetCompetencesQuery
} from "@/api/axios-client/CompetenceQuery.ts";
import {
    Active,
    defaultDropAnimationSideEffects,
    DndContext,
    DragOverlay, DropAnimation,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Arguments} from "@dnd-kit/sortable/dist/hooks/useSortable";
import {restrictToVerticalAxis} from '@dnd-kit/modifiers';
import {useQueryClient} from "@tanstack/react-query";

const PlanCompetenciesPage = () => {

    const {id} = useParams<{ id: string }>();
    const {data} = useGetCompetencesQuery({curriculumId: Number(id)});

    const [selectedType, setSelectedType] = useState<string>(CompetenceTypeName[CompetenceType.Universal].name);
    const [items, setItems] = useState<CompetenceDto[]>([]);

    const [active, setActive] = useState<Active | null>(null);

    useEffect(() => {
        if (data) {
            setItems(data.filter(competence => CompetenceTypeName[competence.type].name === selectedType));
        } else {
            setItems([]);
        }
    }, [selectedType, data]);

    const activeItem = useMemo(
        () => items.find((item) => item.id === active?.id),
        [active, items]
    );

    const headerExtra = () => {
        return (
            <>
                <div className={"flex flex-col"}>
                    <Typography className={"text-sm text-stone-400"}>{""}</Typography>
                    <Typography className={"text-2xl"}>{"Компетенции"}</Typography>
                </div>
            </>
        )
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    return (
        <PlanPageLayout
            menuItems={getPlanMenuItems(id || "")}
            currentMenuItem={"competencies"}
            headerExtra={headerExtra}
        >
            <div className={"flex flex-col"}>
                <div className={"sticky top-0 z-10"}>
                    <Segmented
                        options={Object.values(CompetenceType).map(type => CompetenceTypeName[type].name)}
                        value={selectedType}
                        onChange={setSelectedType}
                        block
                        className={"px-5"}
                    />
                </div>
                <DndContext
                    modifiers={[restrictToVerticalAxis]}
                    sensors={sensors}
                    onDragStart={({active}) => {
                        setActive(active);
                    }}
                    onDragEnd={({active, over}) => {
                        if (over && active.id !== over?.id) {
                            const activeIndex = items.findIndex(({id}) => id === active.id);
                            const overIndex = items.findIndex(({id}) => id === over.id);
                            setItems(arrayMove(items, activeIndex, overIndex));
                        }
                        setActive(null)
                    }}
                    onDragCancel={() => {
                        setActive(null);
                    }}
                >
                    <SortableContext
                        items={items.map((i) => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className={"flex flex-col"}>
                            {
                                !items.length ? "" :
                                    items.map(competence =>
                                        <CompetenceItem key={competence.id} {...competence}/>
                                    )
                            }
                            <AddCompetenceButton
                                curriculumId={Number(id) || 0}
                                type={Object.values(CompetenceType).find(type => CompetenceTypeName[type].name === selectedType) as CompetenceType || CompetenceType.Basic}
                            />
                        </div>
                    </SortableContext>
                    <SortableOverlay>
                        {activeItem ? <CompetenceItem {...activeItem} /> : null}
                    </SortableOverlay>
                </DndContext>
            </div>
        </PlanPageLayout>
    )
}

interface AddCompetenceButtonProps {
    curriculumId: number;
    type: CompetenceType;
}

const AddCompetenceButton = ({curriculumId, type}: AddCompetenceButtonProps) => {

    const [isEdit, setIsEdit] = useState(false);
    const [newCompetence, setNewCompetence] = useState<string>("");
    const queryClient = useQueryClient();

    const {mutate, isPending} = useCreateCompetenceMutation(curriculumId, {
        onSuccess: () => {
            setIsEdit(false);
            setNewCompetence("");
            queryClient.invalidateQueries({queryKey: getCompetencesQueryKey(curriculumId)});
        }
    });

    return (
        <div className={"sticky bottom-0 bg-white/[.5] backdrop-blur"}>
            {
                isPending ? <div className={"p-5 flex gap-2 items-center"}>
                    <Skeleton.Input block size={"large"}/>
                    <Skeleton.Button shape={"circle"} size={"large"}/>
                    <Skeleton.Button shape={"circle"} size={"large"}/>
                </div> : isEdit ?
                    <div className={"p-5 flex gap-2 items-center"}>
                        <Input.TextArea
                            placeholder={"Название компетенции"}
                            autoSize={{minRows: 2, maxRows: 5}}
                            value={newCompetence}
                            onChange={e => setNewCompetence(e.target.value)}
                        />
                        <Button
                            type={"primary"}
                            icon={<PlusOutlined/>}
                            shape={"circle"}
                            size={"large"}
                            disabled={!newCompetence.length}
                            onClick={() => mutate({name: newCompetence, type})}
                        />
                        <Button
                            icon={<CloseOutlined className={"text-stone-400"}/>}
                            shape={"circle"}
                            size={"large"}
                            onClick={() => setIsEdit(false)}
                        />
                    </div> :
                    <div
                        className={"flex justify-center items-center flex-col gap-2 p-5 cursor-pointer hover:bg-stone-50 transition"}
                        onClick={() => setIsEdit(true)}>
                        <Typography className={"text-stone-600"}>Добавить компетенцию</Typography>
                        <PlusOutlined className={"text-stone-400"}/>
                    </div>
            }
        </div>
    )
}


const CompetenceItem = ({name, index, indicators, id}: CompetenceDto) => {

    const {
        listeners,
        attributes,
        isDragging,
        transform,
        transition,
        setNodeRef,
        setActivatorNodeRef
    } = useSortable({id, animateLayoutChanges: () => true} as Arguments);

    const {id: curriculumId} = useParams<{ id: string }>();

    const [showIndicators, setShowIndicators] = useState(false);
    const queryClient = useQueryClient();
    const {mutate: deleteCompetence} = useDeleteCompetenceMutation(id, {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getCompetencesQueryKey(Number(curriculumId) || 0)});
        }
    });

    const style: CSSProperties = {
        opacity: isDragging ? 0.2 : 1,
        zIndex: isDragging ? 5 : 0,
        transform: CSS.Translate.toString(transform),
        transition
    };

    return (
        <div className={`border-b bg-white border-stone-100 hover:border-blue-400 border-solid py-3 pl-2 pr-5`}
             ref={setNodeRef} {...attributes} style={style}>
            <div className={"flex justify-between items-center gap-1"}>
                <div className={"flex gap-1 flex-1"}>
                    <Button
                        type="text"
                        size="small"
                        icon={<HolderOutlined/>}
                        ref={setActivatorNodeRef}
                        {...listeners}
                        className={"cursor-move text-stone-400"}
                    />
                    <div className={"flex flex-col flex-1"}>
                        <span className={"text-[12px] text-stone-400"}>{index}</span>
                        <Typography.Text editable={{triggerType: ["text"], icon: null, maxLength: 500}}
                                         className={"cursor-text"}>{name}</Typography.Text>
                    </div>
                </div>
                <div className={"flex gap-1 items-center justify-end"} onClick={(event) => event.stopPropagation()}>
                    <Popover trigger={"click"} placement={"bottom"}
                             content={
                                 <List
                                     size="small"
                                     dataSource={[{
                                         key: 'delete', label: 'Удалить', danger: true, onClick: () => deleteCompetence()
                                     }]}
                                     renderItem={(item) => <Button type={"text"} onClick={item.onClick}
                                                                   icon={<DeleteOutlined/>}
                                                                   danger={item.danger}>{item.label}</Button>}
                                 />
                             }
                    >
                        <Button className={"text-stone-400"} shape={"circle"} icon={<MoreOutlined/>}/>
                    </Popover>
                    <Button
                        shape={"circle"}
                        icon={<DownOutlined className={"text-stone-400"} rotate={showIndicators ? 180 : 0}/>}
                        onClick={() => setShowIndicators(!showIndicators)}
                    />
                </div>
            </div>
            {
                (showIndicators && !isDragging) ?
                    <div className={"flex flex-col gap-2 border-l border-stone-100 ml-2 mt-2"}>
                        {
                            indicators.map(indicator =>
                                <div key={indicator.id} className={"ps-4 flex justify-between items-center gap-1"}>
                                    <div className={"flex flex-col"}>
                                        <span className={"text-[12px] text-stone-400"}>{indicator.index}</span>
                                        <span className={"text-black"}>{indicator.name}</span>
                                    </div>
                                    <div className={"pr-10"}>
                                        <Popover trigger={"click"} placement={"bottom"}
                                                 content={
                                                     <List
                                                         size="small"
                                                         dataSource={[{
                                                             key: 'delete', label: 'Удалить', onClick: () => {
                                                             }
                                                         }]}
                                                         renderItem={(item) => <Button type={"text"}
                                                                                       onClick={item.onClick}
                                                                                       icon={<DeleteOutlined/>}
                                                                                       danger>{item.label}</Button>}
                                                     />
                                                 }
                                        >
                                            <Button shape={"circle"} icon={<MoreOutlined/>}/>
                                        </Popover>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    : null
            }
        </div>

    )
}

const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.2"
            }
        }
    })
};

export function SortableOverlay({children}: PropsWithChildren<{}>) {
    return (
        <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>
    );
}

export default PlanCompetenciesPage;