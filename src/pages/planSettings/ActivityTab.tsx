import {App, Button, Popconfirm, Typography} from "antd";
import {AddActivityModal} from "@/pages/planSettings/AddActivityModal.tsx";
import {EditActivityModal} from "@/pages/planSettings/EditActivityModal.tsx";
import React, {useState} from "react";
import {AcademicActivityDto} from "@/api/axios-client.types.ts";
import {
    getAcademicActivitiesQueryKey,
    useDeleteAcademicActivityMutationWithParameters,
    useGetAcademicActivitiesQuery
} from "@/api/axios-client/AcademicActivityQuery.ts";
import {CloseOutlined, EditOutlined} from "@ant-design/icons";
import {useQueryClient} from "@tanstack/react-query";
import {useParams} from "react-router-dom";


const ActivityTab = () => {

    const {id} = useParams<{id: string}>();

    const queryClient = useQueryClient();
    const {message} = App.useApp();

    const [openAdd, setOpenAdd] = useState(false);
    const [editActivity, setEditActivity] = useState<AcademicActivityDto | undefined>(undefined);

    const {data: academicActivities} = useGetAcademicActivitiesQuery({curriculumId: Number(id)});

    const {mutate: removeActivity} = useDeleteAcademicActivityMutationWithParameters({
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getAcademicActivitiesQueryKey(Number(id))});
            message.success("Активность удалена");
        }
    });

    return (
        <div className={"flex flex-col gap-5"}>
            <div className={"flex items-center justify-between flex-wrap gap-2"}>
                <Typography.Text className={"text-2xl"}>{"Академические активности"}</Typography.Text>
                <Button
                    shape={"round"}
                    onClick={() => setOpenAdd(true)}
                >+ Добавить</Button>
            </div>
            <div className={"flex flex-col"}>
                {
                    academicActivities?.map(activity =>
                        <AcademicActivityItem
                            activity={activity}
                            key={activity.id}
                            onEdit={() => setEditActivity({...activity})}
                            onRemove={() => removeActivity({academicActivityId: activity.id, curriculumId: id || ""})}
                        />
                    )
                }
                <AddActivityModal isOpen={openAdd} onClose={() => setOpenAdd(false)}/>
                <EditActivityModal isOpen={!!editActivity} onClose={() => setEditActivity(undefined)} initialData={editActivity}/>
            </div>
        </div>
    )
}

interface AcademicActivityItemProps {
    activity: AcademicActivityDto,
    onEdit(): void,
    onRemove(): void
}

const AcademicActivityItem = ({activity, onEdit, onRemove}: AcademicActivityItemProps) => {

    return (
        <div key={activity.id} className={"flex items-center rounded-md p-2 group gap-2 w-full hover:bg-stone-50"}>
            <div className={"flex flex-col flex-1"}>
                <Typography.Text type={"secondary"} className={"text-sm"}>
                    {`${activity.shortName} • ${activity.formulaName}`}
                </Typography.Text>
                <Typography.Text>
                    {activity.name}
                </Typography.Text>
            </div>
            {
                activity?.formula &&
                <Typography.Text className={"bg-stone-50 tracking-wider p-1 px-2 rounded-md border border-solid border-stone-200 text-stone-800"}>
                    {activity.formula}
                </Typography.Text>
            }
            <EditOutlined
                onClick={() => onEdit()}
                className={"text-stone-400 hover:text-stone-500 cursor-pointer hidden group-hover:block"}
            />
            <Popconfirm
                title={"Вы хотите удалить активность?"}
                onConfirm={() => onRemove()}
            >
                <CloseOutlined className={"text-stone-400 hover:text-red-500 cursor-pointer hidden group-hover:block"}/>
            </Popconfirm>
        </div>
    )
}

export default ActivityTab