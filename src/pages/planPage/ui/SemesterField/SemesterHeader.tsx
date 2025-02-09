import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {getIdFromPrefix} from "@/pages/planPage/provider/parseCurriculum.ts";
import {Tag} from "antd";
import AcademicHoursPanel from "@/pages/planPage/ui/AcademicHoursPanel.tsx";
import React from "react";

interface SemesterHeaderProps {
    semesterId: string;
}

const SemesterHeader = ({semesterId}: SemesterHeaderProps) => {

    const {
        displaySettings,
        semestersInfo,
    } = usePlan();

    const info = semestersInfo?.find(semester => semester.semester.id === Number(getIdFromPrefix(semesterId)));

    if (!info) return null;

    const {
        semester,
        nonElective,
        elective
    } = info;

    const examsCount: number = nonElective.attestations.reduce((sum, attestation) => sum + (attestation.shortName === "Эк" ? 1 : 0), 0);

    return (
        <div className={"absolute top-5 h-full w-full"}>
            <div className={`sticky top-7 bottom-4 left-4 z-10 w-max flex gap-2`}>
                <div className={"flex gap-5 items-center rounded-lg px-3 py-2 bg-white shadow-md"}>
                    <span className={"text-[14px] text-blue-400 font-bold"}>Семестр: {semester.number}</span>
                    <div className={"flex gap-1"}>
                        <Tag color={nonElective.credit > 30 ? "red" : nonElective.credit < 30 ? "default" : "green"} className={"m-0"} bordered={false}>{`${nonElective.credit} / 30 ЗЕТ`}</Tag>
                        <Tag
                            color={examsCount >= 3 ? "green" : "default"}
                            className={"m-0"}
                            bordered={false}
                        >{`${examsCount} / 3 Эк`}</Tag>
                        {
                            (elective.credit) ?
                                <Tag color={"purple"} className={"m-0"} bordered={false}>{`${elective.credit} ЗЕТ`}</Tag>
                                : null
                        }
                    </div>
                </div>
                {
                    displaySettings.academicHours &&
                    <div className={"rounded-lg px-3 py-2 bg-white shadow-md"}>
                        <AcademicHoursPanel
                            credits={nonElective.credit}
                            academicHours={nonElective.academicActivityHours}
                            layout={"horizontal"}
                            size={"large"}
                            showAllActivities={true}
                        />
                    </div>
                }
            </div>
        </div>
    )
}

export default SemesterHeader;