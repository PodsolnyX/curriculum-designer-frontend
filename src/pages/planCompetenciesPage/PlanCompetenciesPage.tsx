import PlanPageLayout from "@/widgets/PlanPageLayout/PlanPageLayout.tsx";
import {useParams} from "react-router-dom";
import {useGetCurriculumQuery} from "@/api/axios-client/CurriculumQuery.ts";
import {Checkbox, Input, Segmented, Tooltip, Typography} from "antd";
import {getPlanMenuItems} from "@/shared/const/planMenuItems.ts";
import React, {useState} from "react";
import {CompetenceTypeName} from "@/pages/planPage/const/constants.ts";
import {CompetenceDto, CompetenceType} from "@/api/axios-client.types.ts";
import {DownOutlined, InfoCircleOutlined} from "@ant-design/icons";

const PlanCompetenciesPage = () => {
    const {id} = useParams<{id: string}>();
    const {data} = useGetCurriculumQuery({id: Number(id)});

    const [selectedType, setSelectedType] = useState<string>(CompetenceTypeName[CompetenceType.Basic].name);

    const headerExtra = () => {
        return (
            <>
                <div className={"flex flex-col"}>
                    <Typography className={"text-sm text-stone-400"}>{data?.name}</Typography>
                    <Typography className={"text-2xl"}>{"Компетенции"}</Typography>
                </div>
            </>
        )
    }

    const CompetenceItem = ({description, index, indicators}: CompetenceDto) => {

        const [showIndicators, setShowIndicators] = useState(false);

        return (
            <div className={"shadow bg-white p-3 rounded"}>
                <div className={"flex justify-between items-center gap-1"}>
                    <div className={"flex flex-col"}>
                        <span className={"text-[12px] text-stone-400"}>{index}</span>
                        <span className={"text-black"}>{description}</span>
                    </div>
                    <div className={"flex gap-1 items-center"}>
                        <DownOutlined className={"text-stone-400"} rotate={showIndicators ? 180 : 0} onClick={() => setShowIndicators(!showIndicators)}/>
                    </div>
                </div>
                {
                    showIndicators ?
                        <div className={"flex flex-col gap-2 border-l border-stone-300 ml-2 mt-2"}>
                            {
                                indicators.map(indicator =>
                                    <div key={indicator.id} className={"ps-4 flex justify-between items-center gap-1"}>
                                        <div className={"flex flex-col"}>
                                            <span className={"text-[12px] text-stone-400"}>{indicator.index}</span>
                                            <span className={"text-black"}>{indicator.description}</span>
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

    return (
        <PlanPageLayout
            menuItems={getPlanMenuItems(id || "")}
            currentMenuItem={"competencies"}
            headerExtra={headerExtra}
        >
            <div className={"flex flex-col gap-5 p-5"}>
                <Segmented
                    options={Object.values(CompetenceType).map(type => CompetenceTypeName[type].name)}
                    value={selectedType}
                    onChange={setSelectedType}
                    block
                />
                <div className={"flex flex-col gap-3"}>
                    {
                        data?.competences
                            .filter(competence => CompetenceTypeName[competence.type].name === selectedType)
                            .map(competence =>
                                <CompetenceItem key={competence.id} {...competence}/>
                            )
                    }
                </div>
            </div>
        </PlanPageLayout>
    )
}

export default PlanCompetenciesPage;