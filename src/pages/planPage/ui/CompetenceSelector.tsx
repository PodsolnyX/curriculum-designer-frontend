import {Checkbox, Input, Popover, Segmented, Tag, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {DownOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {CompetenceDto, CompetenceType} from "@/api/axios-client.ts";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {CompetenceTypeName} from "@/pages/planPage/const/constants.ts";
import {useParams} from "react-router-dom";
import {useGetCompetencesQuery} from "@/api/axios-client/CompetenceQuery.ts";

interface CompetenceSelectorProps {
    competencies: {id: number, index: string, description: string}[];
    size?: "small" | "large";
}

const CompetenceSelector = ({competencies, size = "small"}: CompetenceSelectorProps) => {

    const { selectedCompetenceId, onSelectCompetence } = usePlan();

    const {id} = useParams<{ id: string }>();
    const {data} = useGetCompetencesQuery({curriculumId: Number(id)});

    const AddCompetencePopover = () => {

        const [selectedType, setSelectedType] = useState<string>(CompetenceTypeName[CompetenceType.Basic].shortName);
        const [search, setSearch] = useState<string>("");
        const [selectedCompetence, setSelectedCompetence] = useState<CompetenceDto[]>([]);

        useEffect(() => {
            if (data) {
                setSelectedCompetence(data
                        .filter(competence => CompetenceTypeName[competence.type].shortName === selectedType)
                        .filter(competence => competence.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
                )
            }
        }, [selectedType, data, search]);

        return (
            <div className={"flex flex-col gap-1"}>
                <Segmented
                    options={Object.values(CompetenceType).map(type => CompetenceTypeName[type].shortName)}
                    value={selectedType}
                    onChange={setSelectedType}
                    block
                    size={"small"}
                />
                <Input.Search
                    size={"small"}
                    placeholder={"Введите часть названия"}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className={"flex flex-col max-h-[300px] overflow-y-auto scrollbar"}>
                    {
                        selectedCompetence.length ? selectedCompetence.map(competence =>
                                <CompetenceItem key={competence.id} {...competence}/>
                        ) : <span className={"text-stone-400 text-sm pt-2"}>Компетенций не найдено</span>
                    }
                </div>
            </div>
        )
    }

    const CompetenceItem = ({id, name, index, indicators}: CompetenceDto) => {

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
                        <Tooltip title={name} placement={"right"}>
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
                                        <Tooltip title={indicator.name} placement={"right"}>
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
                            color={selectedCompetenceId === competence.id ? "purple" : "default"}
                            className={`m-0 group/item flex gap-1 cursor-pointer`}
                            bordered={size !== "small"}
                            key={competence.id}
                            onClick={() => onSelectCompetence(competence.id)}
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