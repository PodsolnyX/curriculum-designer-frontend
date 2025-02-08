import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {Badge, Checkbox, InputNumber, Segmented, Select, Typography} from "antd";
import React, {useEffect, useState} from "react";
import CompetenceSelector from "@/pages/planPage/ui/CompetenceSelector.tsx";
import AcademicHoursPanel from "@/pages/planPage/ui/AcademicHoursPanel.tsx";
import {AtomType} from "@/api/axios-client.ts";
import {AtomTypeFullName} from "@/pages/planPage/const/constants.ts";
import AttestationTypeSelector from "@/pages/planPage/ui/AttestationTypeSelector.tsx";
import {setPrefixToId} from "@/pages/planPage/provider/parseCurriculum.ts";
import {useEditSubject} from "@/pages/planPage/hooks/useEditSubject.ts";

const Sidebar = () => {

    const {selectedSubject} = usePlan();

    const [selectedSemesterNumber, setSelectedSemesterNumber] = useState<number>(1);

    useEffect(() => {
        if (selectedSubject) {
            setSelectedSemesterNumber(1)
            setNewName(selectedSubject?.name || "")
        }
    }, [selectedSubject])

    const {editInfo} = useEditSubject(selectedSubject?.id || "");

    const [newName, setNewName] = useState(selectedSubject?.name || "");

    const onNameChange = (value: string) => {
        setNewName(value);
        if (name !== value) {
            editInfo({name: value})
        }
    }

    const atomSemester = selectedSubject?.semesters
        ? selectedSubject.semesters.find((atomSemester, index) => index === selectedSemesterNumber - 1)
        : null;

    if (!selectedSubject || !atomSemester) return null;

    const {
        id,
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
                description: competence.name
            }
        })
    }
    else if (competenceIndicators.length) {
        _competencies = competenceIndicators.map(competence => {
            return {
                id: competence.id,
                index: competence.index,
                description: competence.name
            }
        })
    }

    return (

            <div style={{height: "calc(100vh - 64px)"}} className={"overflow-y-auto bg-white/[0.8] w-[330px] backdrop-blur p-5 min-h-full border-l border-l-stone-200 border-solid flex flex-col gap-3"}>
                <div className={"flex flex-col"}>
                    <span className={"text-[12px] text-stone-400"}>{index}</span>
                    <Typography.Text
                        editable={{icon: null, triggerType: ["text"], onChange: onNameChange}}
                        className={"text-black text-[18px] cursor-text"}
                    >
                        {newName}
                    </Typography.Text>
                </div>
                <div className={"flex gap-3"}>
                    <Checkbox checked={isRequired} onClick={() => editInfo({isRequired: !isRequired})}/>
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
                        onChange={(value) => editInfo({type: value as AtomType})}
                    />
                </div>
                <div className={"flex-col flex gap-1"}>
                    <span className={"font-bold text-[14px]"}>Кафедра</span>
                    <InputNumber size={"small"} className={"w-full"} min={0} value={department}/>
                </div>
                <div className={"flex-col flex gap-1 border-b border-stone-300 border-solid pb-3"}>
                    <span className={"font-bold text-[14px]"}>Компетенции</span>
                    <CompetenceSelector competencies={_competencies} size={"large"} subjectId={id}/>
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
                    <AttestationTypeSelector
                        attestation={atomSemester.attestations}
                        subjectId={id}
                        semesterId={setPrefixToId(atomSemester.semester.id, "semesters")}
                        type={"selector"}
                    />
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