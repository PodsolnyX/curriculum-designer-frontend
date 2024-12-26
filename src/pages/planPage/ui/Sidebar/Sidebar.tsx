import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {Badge, Checkbox, InputNumber, Segmented, Select, Tag} from "antd";
import React, {useEffect, useState} from "react";
import CompetenceSelector from "@/pages/planPage/ui/CompetenceSelector.tsx";
import AcademicHoursPanel from "@/pages/planPage/ui/AcademicHoursPanel.tsx";
import {AtomType} from "@/api/axios-client.ts";
import {AtomTypeFullName} from "@/pages/planPage/const/constants.ts";

const Sidebar = () => {

    const {selectedSubject, attestationTypes} = usePlan();

    const [selectedSemesterNumber, setSelectedSemesterNumber] = useState<number>(1);

    useEffect(() => {
        if (selectedSubject) {
            setSelectedSemesterNumber(1)
        }
    }, [selectedSubject])

    const atomSemester = selectedSubject?.semesters ? selectedSubject.semesters.find((atomSemester, index) => index === selectedSemesterNumber - 1) : null;

    if (!selectedSubject || !atomSemester) return null;

    const {
        name = "",
        isRequired = false,
        index = "Без индекса",
        department = "-",
        type = AtomType.Subject,
        competences,
        competenceIndicators,
        notes = []
    } = selectedSubject;

    let _competencies: {id: number, index: string, description: string}[] = [];

    if (competences.length) {
        _competencies = competences.map(competence => {
            return {
                id: competence.id || 0,
                index: competence.index || "",
                description: competence.description
            }
        })
    }
    else if (competenceIndicators.length) {
        _competencies = competenceIndicators.map(competence => {
            return {
                id: competence.id,
                index: competence.index,
                description: competence.description
            }
        })
    }

    return (
        <div className={"fixed z-10 right-0 top-0 bg-white/[0.8] backdrop-blur a p-5 w-[300px] h-screen shadow-md pt-16 flex flex-col gap-3 overflow-y-auto"}>
            <div className={"flex flex-col"}>
                <span className={"text-[12px] text-stone-400"}>{index}</span>
                <div className={"text-black text-[18px]"}>
                    {name}
                </div>
            </div>
            <div className={"flex gap-3"}>
                <Checkbox checked={isRequired}/>
                <span className={"font-bold text-[14px]"}>Обязательность</span>
            </div>
            <div className={"flex-col flex gap-1"}>
                <span className={"font-bold text-[14px]"}>Тип</span>
                <Select
                    options={Object.values(AtomType).map(type => {return {
                        value: type,
                        label: <span className={"flex gap-2"}><Badge color={AtomTypeFullName[type].color}/>{AtomTypeFullName[type].name}</span>
                    }})}
                    size={"small"}
                    value={type}
                />
            </div>
            <div className={"flex-col flex gap-1"}>
                <span className={"font-bold text-[14px]"}>Кафедра</span>
                <InputNumber size={"small"} className={"w-full"} min={0} value={department}/>
            </div>
            <div className={"flex-col flex gap-1 border-b border-stone-300 border-solid pb-3"}>
                <span className={"font-bold text-[14px]"}>Компетенции</span>
                <CompetenceSelector competencies={_competencies} size={"large"}/>
            </div>
            {
                selectedSubject.semesters.length > 1 ?
                    <Segmented
                        options={selectedSubject.semesters.map((_, index) => index + 1)}
                        block
                        value={selectedSemesterNumber}
                        onChange={setSelectedSemesterNumber}
                    /> : null
            }
            <div className={"flex-col flex gap-1"}>
                <span className={"font-bold text-[14px]"}>Зачётных единиц</span>
                <InputNumber size={"small"} className={"w-full"} min={0} max={30} value={atomSemester.credit}/>
            </div>
            <div className={"flex-col flex gap-1"}>
                <span className={"font-bold text-[14px]"}>Промежуточная аттестация</span>
                <Select options={attestationTypes.map(type => {return{value: type.id, label: type.name}})} mode={"multiple"} size={"small"} value={atomSemester.attestations.map(att => att.id)}/>
                {/*<div className={"gap-1 flex flex-wrap"}>*/}
                {/*    {*/}
                {/*        attestationTypes.map(type =>*/}
                {/*            <Tag*/}
                {/*                color={type.id === atomSemester.attestations[0].id ? "blue" : "default"}*/}
                {/*                className={"m-0 bg-transparent cursor-pointer"}*/}
                {/*                key={type.id}*/}
                {/*            >*/}
                {/*                {type.name}*/}
                {/*            </Tag>*/}
                {/*        )*/}
                {/*    }*/}
                {/*</div>*/}
            </div>
            <div className={"flex-col flex gap-1"}>
                <span className={"font-bold text-[14px]"}>Академические часы</span>
                <AcademicHoursPanel credits={atomSemester.credit} academicHours={atomSemester.academicActivityHours} size={"large"}/>
            </div>
            <div className={"flex-col flex gap-1"}>
                <span className={"font-bold text-[14px]"}>Комментарии</span>
                {
                    (notes && notes.length) ?
                        <div className={"flex flex-col gap-3"}>
                            {
                                notes.map(note =>
                                    <div className={"flex flex-col"} key={note.id}>
                                        <div className={"flex gap-1 justify-between"}>
                                            <span className={"text-[12px] text-stone-400"}>{note.author}</span>
                                            <span className={"text-[12px] text-stone-400"}>{note.date}</span>
                                        </div>
                                        <p className={"text-black"}>{note.text}</p>
                                    </div>
                                )
                            }
                        </div>
                        : <span className={"text-[12px] text-stone-400"}>Нет комментариев</span>
                }
            </div>
        </div>
    )
}

export default Sidebar;