import React from "react";
import {AcademicActivityDto, HoursDistributionDto} from "@/api/axios-client.ts";
import {Tooltip} from "antd";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";

interface AcademicHoursPanelProps {
    credits: number;
    academicHours: HoursDistributionDto[];
    size?: "small" | "large";
    layout?: "horizontal" | "vertical";
    showAllActivities?: boolean;
}

const AcademicHoursPanel = ({credits, academicHours, size = "small", layout = "vertical", showAllActivities}: AcademicHoursPanelProps) => {

    const {academicActivity} = usePlan();

    const sumAcademicHours = roundToTwo(academicHours.reduce((_sum, type) => _sum + type.value, 0));

    const textSize = size === "small" ? "text-[10px]" : "text-[12px]";
    const isFullHours = sumAcademicHours === credits * 36;
    const isMoreHours = sumAcademicHours > credits * 36;

    return (
        <div className={layout === "vertical" ? "flex flex-col gap-1" : "flex items-center flex-row-reverse gap-1"}>
            <div className={layout === "vertical" ? "grid grid-cols-2 gap-1" : "flex gap-1"}>
                {
                    showAllActivities
                    ? academicActivity.map((activity, index) =>
                        {
                            const academicHour = academicHours.find(hour => hour.academicActivity.id === activity.id);
                            return (
                                <AcademicActivityItem
                                    key={activity.id}
                                    academicActivity={activity}
                                    value={academicHour?.value || 0}
                                    index={index}
                                    academicActivityLength={academicActivity.length}
                                    textSize={textSize}
                                />
                            )
                        }
                    )
                    : academicHours.map((type, index) =>
                        <AcademicActivityItem
                            key={type.academicActivity.id}
                            academicActivity={type.academicActivity}
                            value={type.value}
                            index={index}
                            academicActivityLength={academicHours.length}
                            textSize={textSize}
                        />
                    )
                }
            </div>
            <div className={`flex justify-between rounded ${isFullHours ? "bg-[#f6ffed]" : isMoreHours ? "bg-[#fff1f0]" : "bg-[#fafafa]"}`}>
                <div className={`${isFullHours ? "text-[#389e0d]" : isMoreHours ? "text-[#cf1322]" : "text-stone-600"} px-1 ${textSize}`}>
                    {"Всего:"}
                </div>
                <div className={`${isFullHours ? "text-[#389e0d]" : isMoreHours ? "text-[#cf1322]" : "text-stone-600"} ${textSize} pr-1`}>
                    {`${sumAcademicHours}/${credits*36}`}
                </div>
            </div>
        </div>
    )
}

interface AcademicActivityItemProps {
    academicActivity: AcademicActivityDto;
    value: number;
    index: number;
    academicActivityLength: number;
    textSize?: string;
}

const AcademicActivityItem = ({academicActivity, value, academicActivityLength, index, textSize = "text-[12px]"}: AcademicActivityItemProps) => {
    return (
        <div className={`flex justify-between border border-solid border-stone-100 gap-1 rounded-md ${(index === academicActivityLength - 1 && academicActivityLength % 2 === 1) ? 'col-span-2' : ''}`}>
            <Tooltip title={academicActivity.name}>
                <div className={`bg-stone-100 pr-1 text-stone-600 ${textSize}`}>
                    {academicActivity.shortName}
                </div>
            </Tooltip>
            <div className={`${textSize} pr-1`}>{roundToTwo(value)}</div>
        </div>
    )
}

function roundToTwo(num: number): number {
    return parseFloat(num.toFixed(2));
}

export default AcademicHoursPanel;