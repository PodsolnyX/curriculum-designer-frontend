import {Checkbox, Input, Popover, Segmented, Tag, Tooltip} from "antd";
import {Competencies} from "@/pages/PlanPage/types/Subject.ts";
import React, {useState} from "react";
import {DownOutlined, InfoCircleOutlined} from "@ant-design/icons";

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
                id: "УК-1",
                value: "УК-1",
                name: "Умение проводить аналитические расчеты",
                indicators: [
                    {id: "355553", value: "ИУК-1.1", name: "Умение проводить аналитические расчеты"},
                    {id: "2332323", value: "ИУК-1.2", name: "Умение проводить аналитические расчеты"}
                ]
            },
            {
                id: "УК-2",
                value: "УК-2",
                name: "Умение проводить аналитические расчеты",
                indicators: [
                    {id: "3444444434", value: "ИУК-2.1", name: "Умение проводить аналитические расчеты"},
                    {id: "4334355355", value: "ИУК-2.2", name: "Умение проводить аналитические расчеты"}
                ]
            },
        ],
    },
    {
        id: "5252525",
        name: "БК",
        competencies: [
            {
                id: "БК-1",
                value: "БК-1",
                name: "Способен применять общие и специализированные компьютерные программы при решении задач профессиональной деятельности",
                indicators: [
                    {id: "6262626", value: "РОБК-1.1", name: "Знает правила и принципы применения общих и специализированных компьютерных программ для решения задач профессиональной деятельности"},
                    {id: "3663", value: "РОБК-1.2", name: "Умеет применять современные IT-технологии для сбора, анализа и представления информации; использовать в профессиональной деятельности общие и специализированные компьютерные программы"}
                ]
            },
        ],
    },
    {
        id: "6446",
        name: "ОПК",
        competencies: [
            {
                id: "ОПК-1",
                value: "ОПК-1",
                name: "Способен к моделированию бизнес-процессов организации в формах до/после внедрения предлагаемой программной системы с целью выявления и фиксации требований к предполагаемой системе, используя специализированные языки моделирования для проектов малого/среднего уровня сложности и(или) масштаба",
                indicators: [
                    {id: "5848548", value: "РООПК-1.1", name: "Знает правила и нотации как минимум одного языка моделирования бизнес-процессов и описания технической проектной документации. Основные концепции и правила работы с требованиями. Основу трансляции требований в аспекты программного продукта. Основные виды классификации требований"},
                    {id: "778", value: "РООПК-1.2", name: "Умеет использовать специализированные языки моделирования, для описания бизнес-процессов, моделей предметных областей, фиксации функциональных требований; анализировать артефакты этапа анализа требований на предмет непротиворечивости, и\n" +
                            " возможности разработки программного обеспечения по указанным спецификациям; извлекать требований к информационным\n" +
                            " системам из разных источников; структурировать требования к данным и информации, используя специализированные нотации и\n" +
                            " языки; следовать процедурам управления процессами и продуктами, которые были определены для проекта; представлять лицам,\n" +
                            " принимающим решения, архитектурно значимые требования из документа спецификации требований к программному обеспечению"}
                ]
            },
        ],
    },
    {
        id: "66666",
        name: "ПК",
        competencies: [
            {
                id: "ПК-1.1",
                value: "ПК-1.1",
                name: "Способен следовать логике прямого проектирования программного обеспечения в рамках выбранной профессиональной роли и используемых технологий на проектах среднего уровня сложности и масштаб",
                indicators: [
                    {id: "463626", value: "РОПК-1.1.1", name: "Знает этапы жизненного цикла программного обеспечения. Правила трансляции артефактов в логике прямого проектирования"},
                    {id: "626646", value: "РОПК-1.1.2", name: "Умеет выполнять трансляцию артефактов между разными этапами. Определять архитектурно значимые, критические, жизненно важные элементы системы, требующие детального проектирования и имплементации"}
                ]
            },
        ],
    }
]

const CompetenceSelector = ({competencies, size = "small"}: CompetenceSelectorProps) => {

    const AddCompetencePopover = () => {

        const [selectedType, setSelectedType] = useState<string>("УК");

        return (
            <div className={"flex flex-col gap-1"}>
                <Segmented
                    options={CompetenciesTypes.map(type => type.name)}
                    value={selectedType}
                    onChange={setSelectedType}
                    block
                    size={"small"}
                />
                <Input.Search size={"small"} placeholder={"Введите начало описания"}/>
                <div>
                    {
                        CompetenciesTypes
                            .find(type => type.name === selectedType)?.competencies
                            .map(competence =>
                                <CompetenceItem key={competence.id} {...competence}/>
                        )
                    }
                </div>
            </div>
        )
    }

    const CompetenceItem = ({value, name, indicators, id}: Competencies) => {

        const [showIndicators, setShowIndicators] = useState(false);

        return (
            <div>
                <div className={"flex justify-between items-center gap-1"}>
                    <div className={"flex gap-1 items-center"}>
                        <Checkbox checked={!!competencies.find(competence => competence.id === id)}/>
                        <span className={"text-[12px] text-black"}>
                            {value}
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
                                            <span className={"text-[12px] text-black"}>
                                                {indicator.value}
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
                            {competence.value}
                            <Tooltip title={"Удалить"}>
                                <span className={"text-[12px] cursor-pointer text-stone-300 hover:text-stone-500 hidden group-hover/item:flex"}>×</span>
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