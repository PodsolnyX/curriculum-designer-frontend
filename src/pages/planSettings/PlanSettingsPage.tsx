import PlanPageLayout from "@/widgets/PlanPageLayout/PlanPageLayout.tsx";
import {getPlanMenuItems} from "@/shared/const/planMenuItems.ts";
import {useParams} from "react-router-dom";
import {
    getCurriculumQueryKey,
    useGetCurriculumQuery,
    useSetCurriculumSettingsMutation
} from "@/api/axios-client/CurriculumQuery.ts";
import {App, Select, Typography} from "antd";
import React from "react";
import {CompetenceDistributionType} from "@/api/axios-client.types.ts";
import {useQueryClient} from "@tanstack/react-query";

const PlanSettingsPage = () => {

    const {id} = useParams<{id: string}>();
    const {data} = useGetCurriculumQuery({id: Number(id)});
    const queryClient = useQueryClient();
    const {message} = App.useApp();

    const {mutate: setSettings} = useSetCurriculumSettingsMutation(Number(id), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getCurriculumQueryKey(Number(id))});
            message.success("Настройки успешно изменены");
        }
    })

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
                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-5"}>
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
        </PlanPageLayout>
    )
}

const CompetenceDistributionTypeName: Record<CompetenceDistributionType, string> = {
    [CompetenceDistributionType.Competence]: "Компетенциям",
    [CompetenceDistributionType.CompetenceIndicator]: "Индикаторам"
}

export default PlanSettingsPage;