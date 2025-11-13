import {CompetenceIndicatorDto} from "@/api/axios-client.types.ts";
import {useQueryClient} from "@tanstack/react-query";
import {useSortable} from "@dnd-kit/sortable";
import {Arguments} from "@dnd-kit/sortable/dist/hooks/useSortable";
import {
    getCompetencesQueryKey,
    useDeleteIndicatorMutationWithParameters,
    useUpdateIndicatorMutation
} from "@/api/axios-client/CompetenceQuery.ts";
import React, {CSSProperties, useState} from "react";
import {CSS} from "@dnd-kit/utilities";
import {Button, List, Popover, Typography} from "antd";
import {DeleteOutlined, HolderOutlined, MoreOutlined} from "@ant-design/icons";

interface IndicatorItemProps extends CompetenceIndicatorDto {
    competenceId: string;
    curriculumId: number;
}

const IndicatorItem = ({name, id, index, competenceId, curriculumId}: IndicatorItemProps) => {

    const queryClient = useQueryClient();

    const {
        listeners,
        attributes,
        isDragging,
        transform,
        transition,
        setNodeRef,
        setActivatorNodeRef
    } = useSortable({id, animateLayoutChanges: () => true} as Arguments);

    const {mutate: deleteIndicator} = useDeleteIndicatorMutationWithParameters({
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getCompetencesQueryKey(Number(curriculumId) || 0)});
        }
    });

    const {mutate: editIndicator} = useUpdateIndicatorMutation(id, competenceId, {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getCompetencesQueryKey(Number(curriculumId) || 0)});
        }
    });

    const [newName, setNewName] = useState(name);

    const onNameChange = (value: string) => {
        setNewName(value);
        if (name !== value) {
            editIndicator({name: value})
        }
    }

    const style: CSSProperties = {
        opacity: isDragging ? 0.2 : 1,
        zIndex: isDragging ? 5 : 0,
        transform: CSS.Translate.toString(transform),
        transition
    };

    return (
        <div className={"bg-white ps-4 flex justify-between items-center gap-1"} ref={setNodeRef} {...attributes} style={style}>
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
                    <Typography.Text
                        editable={{
                            triggerType: ["text"],
                            onChange: onNameChange,
                            icon: null
                        }}
                        className={"cursor-text"}
                    >{newName}</Typography.Text>
                </div>
            </div>
            <div className={"pr-10"}>
                <Popover trigger={"click"} placement={"bottom"} overlayInnerStyle={{padding: 0}}
                         content={
                             <List
                                 size="small"
                                 dataSource={[{
                                     key: 'delete',
                                     label: 'Удалить',
                                     onClick: () => deleteIndicator({indicatorId: id, competenceId: competenceId})
                                 }]}
                                 renderItem={(item) => <Button type={"text"}
                                                               onClick={item.onClick}
                                                               icon={<DeleteOutlined/>}
                                                               danger>{item.label}</Button>}
                             />
                         }
                >
                    <Button shape={"circle"} className={"text-stone-400"} icon={<MoreOutlined/>}/>
                </Popover>
            </div>
        </div>
    )
}

export default IndicatorItem;