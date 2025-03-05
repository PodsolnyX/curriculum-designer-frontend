import PlanPageLayout from "@/widgets/PlanPageLayout/PlanPageLayout.tsx";
import {getPlanMenuItems} from "@/shared/const/planMenuItems.ts";
import {useParams} from "react-router-dom";
import {
    getCurriculumQueryKey,
    useGetCurriculumQuery,
    useSetCurriculumSettingsMutation
} from "@/api/axios-client/CurriculumQuery.ts";
import {App, Button, Popconfirm, Select, Typography} from "antd";
import React, {useState} from "react";
import {AcademicActivityDto, CompetenceDistributionType} from "@/api/axios-client.types.ts";
import {useQueryClient} from "@tanstack/react-query";
import {
    getAcademicActivitiesQueryKey, useDeleteAcademicActivityMutationWithParameters,
    useGetAcademicActivitiesQuery
} from "@/api/axios-client/AcademicActivityQuery.ts";
import {CloseOutlined, EditOutlined} from "@ant-design/icons";
import {AddActivityModal} from "@/pages/planSettings/AddActivityModal.tsx";
import {EditActivityModal} from "@/pages/planSettings/EditActivityModal.tsx";

const PlanSettingsPage = () => {

    const {id} = useParams<{id: string}>();
    const {data} = useGetCurriculumQuery({id: Number(id)});
    const queryClient = useQueryClient();
    const {message} = App.useApp();
    const [openAdd, setOpenAdd] = useState(false);
    const [editActivity, setEditActivity] = useState<AcademicActivityDto | undefined>(undefined);

    const {data: academicActivities} = useGetAcademicActivitiesQuery({curriculumId: Number(id)});

    const {mutate: setSettings} = useSetCurriculumSettingsMutation(Number(id), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getCurriculumQueryKey(Number(id))});
            message.success("Настройки успешно изменены");
        }
    })

    const {mutate: removeActivity} = useDeleteAcademicActivityMutationWithParameters({
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getAcademicActivitiesQueryKey(Number(id))});
            message.success("Активность удалена");
        }
    });

    const headerExtra = () => {
        return (
            <>
                <div className={"flex flex-col"}>
                    <Typography className={"text-sm text-stone-400"}>{data?.name}</Typography>
                    <Typography className={"text-2xl"}>{"Настройки"}</Typography>
                </div>
            </>
        )
    }

    return (
        <PlanPageLayout
            menuItems={getPlanMenuItems(id || "")}
            currentMenuItem={"settings"}
            headerExtra={headerExtra}
        >
            <div className={"p-5"}>
                <div className={"flex flex-col gap-5"}>
                    <Typography.Text className={"text-2xl"}>{"Компетенции"}</Typography.Text>
                    <div className={"grid grid-cols-1 lg:grid-cols-2 gap-5 border-b border-b-stone-100 border-solid pb-5 mb-5"}>
                        <div className={"flex gap-2 items-center"}>
                            <Typography className={"text-stone-400"}>{"Распределение компетенций по:"}</Typography>
                            <Select
                                className={"flex-1 flex"}
                                options={Object
                                    .keys(CompetenceDistributionType)
                                    .map(key => ({value: CompetenceDistributionType[key], label: CompetenceDistributionTypeName[key]}))
                                }
                                value={data?.settings.competenceDistributionType}
                                onChange={(value) => setSettings({competenceDistributionType: value as CompetenceDistributionType})}
                            />
                        </div>
                    </div>
                </div>
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
            </div>
        </PlanPageLayout>
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

const CompetenceDistributionTypeName: Record<CompetenceDistributionType, string> = {
    [CompetenceDistributionType.Competence]: "Компетенциям",
    [CompetenceDistributionType.CompetenceIndicator]: "Индикаторам"
}

export default PlanSettingsPage;