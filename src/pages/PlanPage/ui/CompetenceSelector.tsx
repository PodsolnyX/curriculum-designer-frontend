import {Checkbox, Input, Popover, Segmented, Tag, Tooltip} from "antd";
import React, {useState} from "react";
import {DownOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {CompetenceType, ICompetenceDto} from "@/api/axios-client.ts";
import {usePlan} from "@/pages/PlanPage/provider/PlanProvider.tsx";
import {CompetenceTypeName} from "@/pages/PlanPage/const/constants.ts";

interface CompetenceSelectorProps {
    competencies: {id: number, index: string, description: string}[];
    size?: "small" | "large";
}

const CompetenceSelector = ({competencies, size = "small"}: CompetenceSelectorProps) => {

    const { competences } = usePlan();

    const AddCompetencePopover = () => {

        const [selectedType, setSelectedType] = useState<string>(CompetenceTypeName[CompetenceType.Basic]);

        return (
            <div className={"flex flex-col gap-1"}>
                <Segmented
                    options={Object.values(CompetenceType).map(type => CompetenceTypeName[type])}
                    value={selectedType}
                    onChange={setSelectedType}
                    block
                    size={"small"}
                />
                <Input.Search size={"small"} placeholder={"Введите начало описания"}/>
                <div className={"flex flex-col max-h-[300px] overflow-y-auto scrollbar"}>
                    {
                        competences
                            .filter(competence => CompetenceTypeName[competence.type] === selectedType)
                            .map(competence =>
                                <CompetenceItem key={competence.id} {...competence}/>
                        )
                    }
                </div>
            </div>
        )
    }

    const CompetenceItem = ({id, description, index, indicators}: ICompetenceDto) => {

        const [showIndicators, setShowIndicators] = useState(false);

        const countSelectedIndicators = indicators
            .reduce((prev, indicator) =>
                prev + Number(!!competencies.find(competence => competence.id === indicator.id)), 0)

        return (
            <div>
                <div className={"flex justify-between items-center gap-1"}>
                    <div className={"flex gap-1 items-center"}>
                        <Checkbox
                            indeterminate={countSelectedIndicators > 0 && countSelectedIndicators < indicators.length}
                            checked={countSelectedIndicators === indicators.length}
                        />
                        <span className={"text-[12px] text-black"}>
                            {index}
                        </span>
                    </div>
                    <div className={"flex gap-1 items-center"}>
                        <Tooltip title={description} placement={"right"}>
                            <InfoCircleOutlined className={"w-[12px] text-stone-400"} />
                        </Tooltip>
                        <DownOutlined className={"w-[10px] text-stone-400"} rotate={showIndicators ? 180 : 0} onClick={() => setShowIndicators(!showIndicators)}/>
                    </div>
                </div>
                {
                    showIndicators ?
                        <div className={"flex flex-col gap-1 border-l border-stone-300 ml-2"}>
                            {
                                indicators.map(indicator =>
                                    <div key={indicator.id} className={"ps-2 flex justify-between items-center gap-1"}>
                                        <div className={"flex gap-1 items-center"}>
                                            <Checkbox checked={!!competencies.find(competence => competence.id === indicator.id)}/>
                                            <span className={"text-[12px] text-black"}>
                                                {indicator.index}
                                            </span>
                                        </div>
                                        <Tooltip title={indicator.description} placement={"right"}>
                                            <InfoCircleOutlined className={"w-[12px] text-stone-400"} type={"secondary"}/>
                                        </Tooltip>
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
        <div className={`flex flex-wrap gap-1 max-h-[150px] overflow-y-auto scrollbar group items-center ${!competencies.length ? "justify-between": ""}`} onClick={(event) => event.stopPropagation()}>
            {
                competencies.length ?
                    competencies.map(competence =>
                        <Tag
                            color={"default"}
                            className={`m-0 group/item flex gap-1 cursor-pointer`}
                            bordered={size !== "small"}
                            key={competence.id}
                        >
                            <Tooltip title={competence.description}>
                                <span className={`${size === "small" ? "text-[12px]" : "text-[14px]"}`}>
                                    {competence.index}
                                </span>
                            </Tooltip>
                            <Tooltip title={"Удалить"}>
                                <span className={"text-[12px] cursor-pointer text-stone-300 hover:text-stone-500 hidden group-hover/item:flex"}>×</span>
                            </Tooltip>
                        </Tag>
                    ) : <span className={`${size === "small" ? "text-[10px]" : "text-[12px]"} text-stone-400`}>Нет компетенций</span>
            }
            <Popover content={AddCompetencePopover} trigger={"click"} placement={"bottom"}>
                <Tag color={"default"} className={"m-0 group-hover:opacity-100 opacity-0 cursor-pointer px-5 text-center text-stone-400 hover:text-black"} bordered={size !== "small"}>+</Tag>
            </Popover>
        </div>
    )
}

export default CompetenceSelector;