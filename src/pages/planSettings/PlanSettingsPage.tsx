import PlanPageLayout from "@/widgets/PlanPageLayout/PlanPageLayout.tsx";
import {getPlanMenuItems} from "@/shared/const/planMenuItems.ts";
import {useParams} from "react-router-dom";
import {
    getCurriculumQueryKey,
    useGetCurriculumQuery,
    useSetCurriculumSettingsMutation
} from "@/api/axios-client/CurriculumQuery.ts";
import {App, Popconfirm, Select, Tooltip, Typography} from "antd";
import React, {useState} from "react";
import {AcademicActivityDto, CompetenceDistributionType} from "@/api/axios-client.types.ts";
import {useQueryClient} from "@tanstack/react-query";
import {
    getAcademicActivitiesQueryKey, useDeleteAcademicActivityMutationWithParameters,
    useGetAcademicActivitiesQuery
} from "@/api/axios-client/AcademicActivityQuery.ts";
import {CloseOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined} from "@ant-design/icons";
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
                    <Typography.Text className={"text-2xl"}>{"Академические активности"}</Typography.Text>
                    <div className={"flex flex-wrap gap-2"}>
                        {
                            academicActivities?.map(activity =>
                                <div key={activity.id} className={"flex items-center border border-solid border-stone-200 rounded-md p-2 group gap-2"}>
                                    <Tooltip title={activity.name}>
                                        <InfoCircleOutlined className={"text-stone-400"}/>
                                    </Tooltip>
                                    <Typography.Text>
                                        {activity.shortName}
                                    </Typography.Text>
                                    <EditOutlined
                                        onClick={() => setEditActivity({...activity})}
                                        className={"text-stone-400 hover:text-stone-500 cursor-pointer hidden group-hover:block"}
                                    />
                                    <Popconfirm
                                        title={"Вы хотите удалить активность?"}
                                        onConfirm={() => removeActivity({academicActivityId: activity.id, curriculumId: id || ""})}
                                    >
                                        <CloseOutlined className={"text-stone-400 hover:text-red-500 cursor-pointer hidden group-hover:block"}/>
                                    </Popconfirm>
                                </div>
                            )
                        }
                        <button
                            className={"flex items-center bg-stone-50 hover:bg-stone-100 cursor-pointer rounded-md p-2 gap-2"}
                            onClick={() => setOpenAdd(true)}
                        >
                            <PlusOutlined className={"text-stone-400"}/>
                            <Typography.Text>Добавить</Typography.Text>
                        </button>
                        <AddActivityModal isOpen={openAdd} onClose={() => setOpenAdd(false)}/>
                        <EditActivityModal isOpen={!!editActivity} onClose={() => setEditActivity(undefined)} initialData={editActivity}/>
                    </div>
                </div>
            </div>
        </PlanPageLayout>
    )
}

const CompetenceDistributionTypeName: Record<CompetenceDistributionType, string> = {
    [CompetenceDistributionType.Competence]: "Компетенциям",
    [CompetenceDistributionType.CompetenceIndicator]: "Индикаторам"
}

export default PlanSettingsPage;