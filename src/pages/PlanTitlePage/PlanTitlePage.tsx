import PlanPageLayout from "@/widgets/PlanPageLayout/PlanPageLayout.tsx";
import {getPlanMenuItems} from "@/shared/const/planMenuItems.ts";
import {useParams} from "react-router-dom";
import {useGetCurriculumQuery} from "@/api/axios-client/CurriculumQuery.ts";
import {Typography} from "antd";
import React from "react";

const PlanTitlePage = () => {

    const {id} = useParams<{id: string}>();

    const {data} = useGetCurriculumQuery({id: Number(id)});

    const headerExtra = () => {
        return (
            <>
                <div className={"flex flex-col"}>
                    <Typography className={"text-sm text-stone-400"}>{data?.name}</Typography>
                    <Typography className={"text-2xl"}>{"Титул"}</Typography>
                </div>
            </>
        )
    }

    return (
        <PlanPageLayout
            menuItems={getPlanMenuItems(id || "")}
            currentMenuItem={"title"}
            headerExtra={headerExtra}
        >
            <>
            </>
        </PlanPageLayout>
    )
}

export default PlanTitlePage;