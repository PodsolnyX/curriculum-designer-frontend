import React, {useEffect, useState} from "react";
import {
    concatIds, getIdFromPrefix,
    getSemesterIdFromPrefix,
    setPrefixToId
} from "@/pages/planPage/provider/prefixIdHelpers.ts";
import {Badge, Segmented, Select, Switch, Typography} from "antd";
import {AtomType} from "@/api/axios-client.types.ts";
import {AtomTypeFullName} from "@/pages/planPage/const/constants.ts";
import CompetenceSelector from "@/pages/planPage/ui/CompetenceSelector.tsx";
import CreditsSelector from "@/pages/planPage/ui/CreditsSelector.tsx";
import AttestationTypeSelector from "@/pages/planPage/ui/AttestationTypeSelector.tsx";
import AcademicHoursPanel from "@/pages/planPage/ui/AcademicHoursPanel.tsx";
import DepartmentsSelector from "@/pages/planPage/ui/DepartmentsSelector.tsx";
import {componentsStore} from "@/pages/planPage/lib/stores/componentsStore.ts";
import {commonStore} from "@/pages/planPage/lib/stores/commonStore.ts";
import {observer} from "mobx-react-lite";


const AtomContent = observer(() => {

    const selectedAtom = commonStore.selectedComponent;
    const atomId = Number(getIdFromPrefix(selectedAtom || ""));

    const [selectedSemesterNumber, setSelectedSemesterNumber] = useState<number>(1);
    const [newName, setNewName] = useState("");

    const atomInfo = componentsStore.getAtom(atomId);

    useEffect(() => {
        if (selectedAtom && atomInfo) {
            setSelectedSemesterNumber(atomInfo.semesters.findIndex(semester => semester.semester.id === Number(getSemesterIdFromPrefix(selectedAtom))) + 1 || 1)
            setNewName(atomInfo.name || "")
        }
    }, [selectedAtom, atomInfo])

    if (!selectedAtom || !atomInfo) return (
        <div className={"flex flex-col items-center justify-center mt-16"}>
            <Typography.Text className={"text-center text-stone-400"}>
                Предмет не найден или удалён
            </Typography.Text>
        </div>

    );

    const targetSubjectSemesterId = concatIds(
        setPrefixToId(String(atomInfo.semesters.find((atomSemester, index) => index === selectedSemesterNumber - 1)?.semester.id || ""), "semesters"),
        setPrefixToId(atomId, "subjects")
    );

    const onNameChange = (value: string) => {
        setNewName(value);
        if (name !== value) {
            componentsStore.updateAtom(targetSubjectSemesterId, "name", value)
        }
    }

    const atomSemester = atomInfo.semesters[selectedSemesterNumber - 1];

    if (!atomSemester) return null;

    const {
        id,
        name,
        isRequired,
        index = "Без индекса",
        department,
        type,
        competenceIds,
        competenceIndicatorIds,
    } = atomInfo;

    const notes = [];

    return (
        <div className={"flex flex-col gap-3"}>
            <div className={"flex flex-col"}>
                <span className={"text-[12px] text-stone-400"}>{index}</span>
                <Typography.Text
                    editable={{icon: null, triggerType: ["text"], onChange: onNameChange}}
                    className={"text-black text-[18px] cursor-text"}
                >
                    {newName}
                </Typography.Text>
            </div>
            <div className={"grid-cols-2 grid gap-2"}>
                <div className={"flex flex-col"}>
                    <span className={"font-bold text-[14px]"}>Обязательность</span>
                    <Switch
                        className={"w-max"}
                        checked={isRequired}
                        onClick={() => componentsStore.updateAtom(targetSubjectSemesterId, "isRequired", !isRequired)}
                    />
                </div>
                <div className={"flex-col flex gap-1"}>
                    <span className={"font-bold text-[14px]"}>Тип</span>
                    <Select
                        options={Object.values(AtomType).map(type => {
                            return {
                                value: type,
                                label: <span className={"flex gap-2"}><Badge
                                    color={AtomTypeFullName[type].color}/>{AtomTypeFullName[type].name}</span>
                            }
                        })}
                        size={"small"}
                        value={type}
                        onChange={(value) => componentsStore.updateAtom(targetSubjectSemesterId, "type", value as AtomType)}
                    />
                </div>
            </div>
            <div className={"flex-col flex gap-1"}>
                <span className={"font-bold text-[14px]"}>Кафедра</span>
                <DepartmentsSelector
                    onChange={(department) => componentsStore.updateAtom(targetSubjectSemesterId, "department", department)}
                    department={department}
                    type={"input"}
                />
            </div>
            <div className={"flex-col flex gap-1 border-b border-stone-300 border-solid pb-3"}>
                <span className={"font-bold text-[14px]"}>Компетенции</span>
                <CompetenceSelector
                    competencies={competenceIds.length ? competenceIds : competenceIndicatorIds}
                    size={"large"}
                    subjectId={id}
                    onChange={(competenceIds) => componentsStore.updateAtom(targetSubjectSemesterId, "competenceIds", competenceIds)}
                />
            </div>
            {
                atomInfo.semesters.length > 1 ?
                    <>
                        <div>
                            <span className={"font-bold text-[14px]"}>Семестры предмета</span>
                            <Segmented
                                options={atomInfo.semesters.map((_, index) => index + 1)}
                                block
                                value={selectedSemesterNumber}
                                onChange={setSelectedSemesterNumber}
                            />
                        </div>
                    </> : null
            }
            <div className={"flex-col flex gap-1"}>
                <span className={"font-bold text-[14px]"}>Зачётных единиц</span>
                <CreditsSelector credits={atomSemester.credit} type={"input"}
                                 onChange={(value) => componentsStore.updateAtom(targetSubjectSemesterId, "credit", value)}
                />
            </div>
            <div className={"flex-col flex gap-1"}>
                <span className={"font-bold text-[14px]"}>Промежуточная аттестация</span>
                <AttestationTypeSelector
                    attestation={atomSemester.attestations}
                    subjectId={id}
                    semesterId={setPrefixToId(atomSemester.semester.id, "semesters")}
                    type={"selector"}
                    onChange={(value) => componentsStore.updateAtom(targetSubjectSemesterId, "attestations", value)}
                />
            </div>
            <div className={"flex-col flex gap-1"}>
                <span className={"font-bold text-[14px]"}>Академические часы</span>
                <AcademicHoursPanel
                    credits={atomSemester.credit}
                    academicHours={atomSemester.academicActivityHours}
                    size={"large"}
                    isEditMode={true}
                    onChange={(activityId, value) => componentsStore.updateAtom(targetSubjectSemesterId, "academicHours", {
                        id: activityId,
                        value
                    })}
                    onAdd={(activityId) => componentsStore.updateAtom(targetSubjectSemesterId, "academicHours", {id: activityId, value: undefined})}
                    onRemove={(activityId) => componentsStore.updateAtom(targetSubjectSemesterId, "academicHours", {
                        id: activityId,
                        value: -1
                    })}
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
})

export default AtomContent;