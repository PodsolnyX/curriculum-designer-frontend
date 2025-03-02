import {Checkbox, Input, Popover, Segmented, Tag, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {DownOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {CompetenceDistributionType, CompetenceDto, CompetenceType} from "@/api/axios-client.ts";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {CompetenceTypeName} from "@/pages/planPage/const/constants.ts";
import {useParams} from "react-router-dom";
import {useGetCompetencesQuery} from "@/api/axios-client/CompetenceQuery.ts";

interface CompetenceSelectorProps {
    subjectId?: string | number;
    competencies: number[];
    onChange?: (competenceIds: number[]) => void;
    size?: "small" | "large";
}

const CompetenceSelector = ({competencies = [], size = "small", subjectId, onChange}: CompetenceSelectorProps) => {

    const { selectedCompetenceId, onSelectCompetence, settings, competences } = usePlan();

    const {competenceDistributionType} = settings;

    const onRemoveCompetence = (id: number) => {
        onChange?.(competencies.filter(competence => competence !== id))
    }

    return (
        <div className={`flex flex-wrap gap-1 max-h-[150px] overflow-y-auto scrollbar group items-center ${!competencies.length ? "justify-between": ""}`} onClick={(event) => event.stopPropagation()}>
            {
                competencies.length ?
                    competencies.map(competence => {

                        const competenceInfo = competences[competence]

                        return (
                            <Tag
                                color={selectedCompetenceId === competence ? "purple" : "default"}
                                className={`m-0 group/item flex gap-1 cursor-pointer hover:text-purple-800`}
                                bordered={size !== "small"}
                                key={competence}
                                onClick={() => onSelectCompetence(competence !== selectedCompetenceId ? competence : null)}
                            >
                                <Tooltip title={competenceInfo.description}>
                                <span className={`${size === "small" ? "text-[12px]" : "text-[14px]"}`}>
                                    {competenceInfo.index}
                                </span>
                                </Tooltip>
                                <Tooltip title={"Удалить"}>
                                <span
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onRemoveCompetence(competence)
                                    }}
                                    className={"text-[12px] cursor-pointer text-stone-300 hover:text-stone-500 hidden group-hover/item:flex"}
                                >×</span>
                                </Tooltip>
                            </Tag>
                        )
                    }
                    ) : <span className={`${size === "small" ? "text-[10px]" : "text-[12px]"} text-stone-400`}>Нет компетенций</span>
            }
            <Popover content={AddCompetencePopover({subjectId, competencies, competenceDistributionType, onChange})} trigger={"click"} placement={"bottom"}>
                <Tag color={"default"} className={"m-0 group-hover:opacity-100 opacity-0 cursor-pointer px-5 text-center text-stone-400 hover:text-black"} bordered={size !== "small"}>+</Tag>
            </Popover>
        </div>
    )
}

interface AddCompetencePopoverProps {
    subjectId?: string | number;
    competencies: number[];
    competenceDistributionType: CompetenceDistributionType;
    onChange?: (competenceIds: number[]) => void;
}

const AddCompetencePopover = ({subjectId, competencies, competenceDistributionType, onChange}: AddCompetencePopoverProps) => {

    const {id} = useParams<{ id: string }>();
    const {data} = useGetCompetencesQuery({curriculumId: Number(id)});

    const [selectedType, setSelectedType] = useState<string>(CompetenceTypeName[CompetenceType.Basic].shortName);
    const [search, setSearch] = useState<string>("");
    const [selectedCompetence, setSelectedCompetence] = useState<CompetenceDto[]>([]);

    useEffect(() => {
        if (data) {
            setSelectedCompetence(Object.values(data)
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
                        <CompetenceItem
                            competenceDistributionType={competenceDistributionType}
                            key={competence.id}
                            {...competence}
                            subjectId={subjectId}
                            competencies={competencies}
                            onChange={onChange}
                        />
                    ) : <span className={"text-stone-400 text-sm pt-2"}>Компетенций не найдено</span>
                }
            </div>
        </div>
    )
}

interface CompetenceItemProps extends CompetenceDto {
    subjectId?: string | number;
    competencies: number[];
    competenceDistributionType: CompetenceDistributionType;
    onChange?: (competenceIds: number[]) => void;
}

const CompetenceItem = ({id, name, index, indicators, subjectId, competencies, competenceDistributionType, onChange}: CompetenceItemProps) => {

    const [showIndicators, setShowIndicators] = useState(false);

    const onSelectCompetence = (id: number, remove?: boolean) => {
        onChange?.(remove
            ? competencies.filter(competence => competence !== id)
            : [...competencies.map(competence => competence), id])
    }

    const countSelectedIndicators = indicators
        .reduce((prev, indicator) =>
            prev + Number(!!competencies.find(competence => competence.id === indicator.id)), 0)

    return (
        <div>
            <div className={"flex justify-between items-center gap-1"}>
                <div className={"flex gap-1 items-center"}>
                    <Checkbox
                        indeterminate={countSelectedIndicators > 0 && countSelectedIndicators < indicators.length}
                        checked={(countSelectedIndicators === indicators.length && indicators.length > 0) || !!competencies.find(competence => competence === id)}
                        disabled={competenceDistributionType === CompetenceDistributionType.CompetenceIndicator}
                        onChange={() => onSelectCompetence(id, !!competencies.find(competence => competence === id))}
                    />
                    <span className={"text-[12px] text-black"}>
                        {index}
                    </span>
                </div>
                <div className={"flex gap-1 items-center"}>
                    <Tooltip title={name} placement={"right"}>
                        <InfoCircleOutlined className={"w-[12px] text-stone-400"} />
                    </Tooltip>
                    {
                        indicators.length ?
                            <DownOutlined className={"w-[10px] text-stone-400"} rotate={showIndicators ? 180 : 0} onClick={() => setShowIndicators(!showIndicators)}/>
                            : null
                    }
                </div>
            </div>
            {
                showIndicators ?
                    <div className={"flex flex-col gap-1 border-l border-stone-300 ml-2"}>
                        {
                            indicators.map(indicator =>
                                <div key={indicator.id} className={"ps-2 flex justify-between items-center gap-1"}>
                                    <div className={"flex gap-1 items-center"}>
                                        <Checkbox
                                            disabled={competenceDistributionType === CompetenceDistributionType.Competence}
                                            checked={!!competencies.find(competence => competence === indicator.id)}
                                            onChange={() => onSelectCompetence(indicator.id, !!competencies.find(competence => competence === indicator.id))}
                                        />
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

export default CompetenceSelector;