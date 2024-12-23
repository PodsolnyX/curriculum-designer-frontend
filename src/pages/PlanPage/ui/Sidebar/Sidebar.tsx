import {usePlan} from "@/pages/PlanPage/provider/PlanProvider.tsx";
import {Checkbox, InputNumber, Segmented, Tag} from "antd";
import {
    AttestationType,
    AttestationTypeFullName,
} from "@/pages/PlanPage/types/Subject.ts";
import React, {useEffect, useState} from "react";
import CompetenceSelector from "@/pages/PlanPage/ui/CompetenceSelector.tsx";
import AcademicHoursPanel from "@/pages/PlanPage/ui/AcademicHoursPanel.tsx";
import {AtomType} from "@/api/axios-client.ts";
import {AtomTypeFullName} from "@/pages/PlanPage/const/constants.ts";

const Sidebar = () => {

    const {selectedSubject, attestationTypes} = usePlan();

    const [selectedSemesterNumber, setSelectedSemesterNumber] = useState<number>(1);

    useEffect(() => {
        if (selectedSubject) {
            setSelectedSemesterNumber(1)
        }
    }, [selectedSubject])

    const atomSemester = selectedSubject?.semesters ? selectedSubject.semesters.find((atomSemester, index) => index === selectedSemesterNumber - 1) : null;

    console.log(selectedSubject, atomSemester)

    if (!selectedSubject || !atomSemester) return null;

    const {
        name = "",
        attestation,
        required = false,
        index = "Без индекса",
        department = "-",
        type = AtomType.Subject,
        competencies = []
    } = selectedSubject;

    return (
        <div className={"fixed z-10 right-0 top-0 bg-white/[0.8] backdrop-blur a p-5 w-[300px] h-screen shadow-md pt-16 flex flex-col gap-3 overflow-y-auto"}>
            <div className={"flex flex-col"}>
                <div className={"flex gap-1 items-center"}>
                    <span className={"text-[12px] text-stone-400"}>{index}</span>
                    {/*{*/}
                    {/*    semesterOrder &&*/}
                    {/*    <>*/}
                    {/*        <span className={"text-[8px] text-stone-400"}>•</span>*/}
                    {/*        <span className={"text-[12px] text-blue-500"}>{`Семестр: ${semesterOrder}`}</span>*/}
                    {/*    </>*/}
                    {/*}*/}
                </div>
                <div className={"text-black text-[18px]"}>
                    {name}
                </div>
            </div>
            <div className={"flex gap-3"}>
                <Checkbox checked={required}/>
                <span className={"font-bold text-[14px]"}>Обязательность</span>
            </div>
            <div className={"flex-col flex gap-1"}>
                <span className={"font-bold text-[14px]"}>Кафедра</span>
                <InputNumber size={"small"} className={"w-full"} min={0} value={department}/>
            </div>


            <div className={"flex-col flex gap-1"}>
                <span className={"font-bold text-[14px]"}>Тип</span>
                <div className={"gap-1 flex flex-wrap"}>
                    {
                        Object.values(AtomType).map(_type =>
                            <Tag
                                color={_type === type ? AtomTypeFullName[_type].color : "default"}
                                className={"m-0 bg-transparent cursor-pointer"}
                                key={_type}
                            >
                                {AtomTypeFullName[_type].name}
                            </Tag>
                        )
                    }
                </div>
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
                <div className={"gap-1 flex flex-wrap"}>
                    {
                        attestationTypes.map(type =>
                            <Tag
                                color={type.id === atomSemester.attestations[0].id ? "blue" : "default"}
                                className={"m-0 bg-transparent cursor-pointer"}
                                key={type.id}
                            >
                                {type.name}
                            </Tag>
                        )
                    }
                </div>
            </div>
            <div className={"flex-col flex gap-1"}>
                <span className={"font-bold text-[14px]"}>Академические часы</span>
                <AcademicHoursPanel credits={atomSemester.credit} academicHours={atomSemester.academicActivityHours} size={"large"}/>
            </div>
            <div className={"flex-col flex gap-1"}>
                <span className={"font-bold text-[14px]"}>Компетенции</span>
                <CompetenceSelector competencies={competencies} size={"large"}/>
            </div>
            {/*<div className={"flex-col flex gap-1"}>*/}
            {/*    <span className={"font-bold text-[14px]"}>Комментарии</span>*/}
            {/*    {*/}
            {/*        (notes && notes.length) ?*/}
            {/*            <div className={"flex flex-col gap-3"}>*/}
            {/*                {*/}
            {/*                    notes.map(note =>*/}
            {/*                        <div className={"flex flex-col"} key={note.id}>*/}
            {/*                            <div className={"flex gap-1 justify-between"}>*/}
            {/*                                <span className={"text-[12px] text-stone-400"}>{note.author}</span>*/}
            {/*                                <span className={"text-[12px] text-stone-400"}>{note.date}</span>*/}
            {/*                            </div>*/}
            {/*                            <p className={"text-black"}>{note.text}</p>*/}
            {/*                        </div>*/}
            {/*                    )*/}
            {/*                }*/}
            {/*            </div>*/}
            {/*            : <span className={"text-[12px] text-stone-400"}>Нет комментариев</span>*/}
            {/*    }*/}
            {/*</div>*/}
        </div>
    )
}

export default Sidebar;