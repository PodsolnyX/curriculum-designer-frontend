import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {Badge, Checkbox, InputNumber, Segmented, Select, Typography} from "antd";
import React, {useEffect, useState} from "react";
import CompetenceSelector from "@/pages/planPage/ui/CompetenceSelector.tsx";
import AcademicHoursPanel from "@/pages/planPage/ui/AcademicHoursPanel.tsx";
import {AtomType} from "@/api/axios-client.ts";
import {AtomTypeFullName} from "@/pages/planPage/const/constants.ts";
import AttestationTypeSelector from "@/pages/planPage/ui/AttestationTypeSelector.tsx";
import {
    concatIds,
    cutSemesterIdFromId,
    parseAtomCompetences,
    setPrefixToId
} from "@/pages/planPage/provider/parseCurriculum.ts";
import {CloseOutlined} from "@ant-design/icons";
import CreditsSelector from "@/pages/planPage/ui/CreditsSelector.tsx";

const Sidebar = () => {

    const {selectedSubject, competences, updateSubject, onSelectSubject} = usePlan();

    const [selectedSemesterNumber, setSelectedSemesterNumber] = useState<number>(1);

    useEffect(() => {
        if (selectedSubject) {
            setSelectedSemesterNumber(selectedSubject?.semesterOrder || 1)
            setNewName(selectedSubject?.atom.name || "")
        }
    }, [selectedSubject])

    const [newName, setNewName] = useState(selectedSubject?.atom.name || "");

    const targetSubjectSemesterId = selectedSubject?.atom ? concatIds(
        setPrefixToId(String(selectedSubject.atom.semesters.find((atomSemester, index) => index === selectedSemesterNumber - 1).semester.id), "semesters"),
        cutSemesterIdFromId(selectedSubject.id)
    ) : "";

    const onNameChange = (value: string) => {
        setNewName(value);
        if (name !== value) {
            updateSubject(targetSubjectSemesterId, "name", value)
        }
    }

    const atomSemester = selectedSubject?.atom.semesters
        ? selectedSubject.atom.semesters.find((atomSemester, index) => index === selectedSemesterNumber - 1)
        : null;


    if (!selectedSubject || !atomSemester) return null;

    const {
        id,
        name = "",
        isRequired = false,
        index = "Без индекса",
        department,
        type = AtomType.Subject,
        notes = []
    } = selectedSubject.atom;

    let _competencies = parseAtomCompetences(selectedSubject.atom, competences);

    return (

            <div style={{height: "calc(100vh - 64px)"}} className={"overflow-y-auto bg-white/[0.8] max-w-[330px] w-full backdrop-blur p-5 min-h-full border-l border-l-stone-200 border-solid flex flex-col gap-3"}>
                <CloseOutlined
                    className={"absolute top-3 right-3 text-stone-400 hover:text-black transition hover:bg-stone-100 p-1 rounded-full"}
                    onClick={() => onSelectSubject(null)}
                />
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
                    <Checkbox checked={isRequired} onClick={() => updateSubject(targetSubjectSemesterId, "isRequired", !isRequired)}/>
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
                        onChange={(value) => updateSubject(targetSubjectSemesterId, "type", value as AtomType)}
                    />
                </div>
                <div className={"flex-col flex gap-1"}>
                    <span className={"font-bold text-[14px]"}>Кафедра</span>
                    <InputNumber size={"small"} className={"w-full"} min={0} value={department?.id}/>
                </div>
                <div className={"flex-col flex gap-1 border-b border-stone-300 border-solid pb-3"}>
                    <span className={"font-bold text-[14px]"}>Компетенции</span>
                    <CompetenceSelector competencies={_competencies} size={"large"} subjectId={id}/>
                </div>
                <div>
                    <span className={"font-bold text-[14px]"}>Семестры предмета</span>
                    {
                        selectedSubject.atom.semesters.length > 1 ?
                            <Segmented
                                options={selectedSubject.atom.semesters.map((_, index) => index + 1)}
                                block
                                value={selectedSemesterNumber}
                                onChange={setSelectedSemesterNumber}
                            /> : null
                    }
                </div>
                <div className={"flex-col flex gap-1"}>
                    <span className={"font-bold text-[14px]"}>Зачётных единиц</span>
                    <CreditsSelector credits={atomSemester.credit} type={"input"}
                                     onChange={(value) => updateSubject(targetSubjectSemesterId, "credits", value)}
                    />
                </div>
                <div className={"flex-col flex gap-1"}>
                    <span className={"font-bold text-[14px]"}>Промежуточная аттестация</span>
                    <AttestationTypeSelector
                        attestation={atomSemester.attestations}
                        subjectId={id}
                        semesterId={setPrefixToId(atomSemester.semester.id, "semesters")}
                        type={"selector"}
                        onChange={(value) => updateSubject(targetSubjectSemesterId, "attestation", value)}
                    />
                </div>
                <div className={"flex-col flex gap-1"}>
                    <span className={"font-bold text-[14px]"}>Академические часы</span>
                    <AcademicHoursPanel
                        credits={atomSemester.credit}
                        academicHours={atomSemester.academicActivityHours}
                        size={"large"}
                        isEditMode={true}
                        onChange={(activityId, value) => updateSubject(targetSubjectSemesterId, "academicHours", {id: activityId, value})}
                        onAdd={(activityId) => updateSubject(targetSubjectSemesterId, "academicHours", activityId)}
                        onRemove={(activityId) => updateSubject(targetSubjectSemesterId, "academicHours", {id: activityId, value: -1})}
                    />
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