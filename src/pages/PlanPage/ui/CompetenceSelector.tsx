import {Badge, Popover, Tag, Tooltip} from "antd";
import {Competencies, SubjectTypeFullName} from "@/pages/PlanPage/types/Subject.ts";
import React, {useState} from "react";
import {InfoCircleOutlined} from "@ant-design/icons";

interface CompetenceSelectorProps {
    competencies: Competencies[];
    size?: "small" | "large";
}

interface CompetenciesType {
    id: string;
    name: string;
    competencies: Competencies[];
}

const CompetenciesTypes: CompetenciesType[] = [
    {
        id: "1112212",
        name: "УК",
        competencies: [
            {
                id: "222222",
                value: "УК-1",
                name: "Умение проводить аналитические расчеты",
                indicators: [
                    {id: "355553", value: "ИУК-1", name: "Умение проводить аналитические расчеты"},
                    {id: "2332323", value: "ИУК-2", name: "Умение проводить аналитические расчеты"}
                ]
            },
        ],
    },
    {
        id: "5252525",
        name: "БК",
        competencies: [
            {
                id: "3535253533",
                value: "БК-1",
                name: "Умение проводить аналитические расчеты",
                indicators: [
                    {id: "6262626", value: "ИБК-1", name: "Умение проводить аналитические расчеты"},
                    {id: "3663", value: "ИБК-2", name: "Умение проводить аналитические расчеты"}
                ]
            },
        ],
    },
    {
        id: "6446",
        name: "ОПК",
        competencies: [
            {
                id: "6346464346",
                value: "ОПК-1",
                name: "Умение проводить аналитические расчеты",
                indicators: [
                    {id: "5848548", value: "ИОПК-1", name: "Умение проводить аналитические расчеты"},
                    {id: "778", value: "ИОПК-2", name: "Умение проводить аналитические расчеты"}
                ]
            },
        ],
    },
    {
        id: "66666",
        name: "ПК",
        competencies: [
            {
                id: "236377",
                value: "ПК-1",
                name: "Умение проводить аналитические расчеты",
                indicators: [
                    {id: "463626", value: "ИПК-1", name: "Умение проводить аналитические расчеты"},
                    {id: "626646", value: "ИПК-2", name: "Умение проводить аналитические расчеты"}
                ]
            },
        ],
    }
]

const CompetenceSelector = ({competencies, size = "small"}: CompetenceSelectorProps) => {

    const AddCompetencePopover = () => {

        const [selectedType, setSelectedType] = useState<null | string>(null);

        return (
            <div className={"flex flex-col gap-1"}>
                <div className={"flex gap-1 items-center"}>
                    {
                        CompetenciesTypes.map(type =>
                            <Tag
                                key={type.id}
                                color={type.id === selectedType ? "blue" : "default"}
                                className={"m-0 cursor-pointer"}
                                onClick={() => setSelectedType(type.id)}
                            >
                                {type.name}
                            </Tag>
                        )
                    }
                </div>
                <div>
                    {
                        CompetenciesTypes
                            .find(type => type.id === selectedType)?.competencies
                            .map(competence =>
                                <div key={competence.id} className={"flex justify-between items-center gap-1"}>
                                    <span className={"text-[12px] text-black"}>
                                        {competence.value}
                                    </span>
                                    <Tooltip title={competence.indicators.map(indicator => indicator.name).join(", ")}>
                                        <InfoCircleOutlined className={"w-[12px]"} type={"secondary"}/>
                                    </Tooltip>
                                </div>
                        )
                    }
                </div>
            </div>
        )
    }

    return (
        <div className={`flex flex-wrap gap-1 group items-center ${!competencies.length ? "justify-between": ""}`} onClick={(event) => event.stopPropagation()}>
            {
                competencies.length ?
                    competencies.map(competence =>
                        <Tag
                            color={"default"}
                            className={`m-0 group/item flex gap-1`}
                            bordered={false}
                            key={competence.id}
                        >
                            {competence.name}
                            <Tooltip title={"Удалить"}>
                                <span className={"text-[12px] text-stone-300 hover:text-stone-500 hidden group-hover/item:flex"}>×</span>
                            </Tooltip>
                        </Tag>
                    ) : <span className={`${size === "small" ? "text-[10px]" : "text-[12px]"} text-stone-400`}>Нет компетенций</span>
            }
            <Popover content={AddCompetencePopover} trigger={"click"} placement={"bottom"}>
                <Tag color={"default"} className={"m-0 group-hover:opacity-100 opacity-0 cursor-pointer min-w-10 text-center text-stone-400 hover:text-black"} bordered={false}>+</Tag>
            </Popover>
        </div>
    )
}

export default CompetenceSelector;